// Mongoose connection established reliably
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Razorpay = require('razorpay');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose');
const { PDFParse } = require('pdf-parse');
const { protect } = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const User = require('./models/User');
const Report = require('./models/Report');

console.log('Dependencies loaded!');

dotenv.config({ path: path.resolve(__dirname, '.env') });
console.log('Dotenv loaded from', path.resolve(__dirname, '.env'));

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Vercel path homogenization: Strip /_/backend prefix if present so that standard routes like /api/analyze match perfectly
app.use((req, res, next) => {
  if (req.url.startsWith('/_/backend')) {
    req.url = req.url.substring('/_/backend'.length);
    if (!req.url.startsWith('/')) req.url = '/' + req.url;
  }
  next();
});
// Connect to MongoDB
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB successfully connected.');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });
}

// Routes
app.use('/api/auth', authRoutes);

const upload = multer({ dest: 'uploads/' });

const safelyDeleteFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.warn(`Could not delete file ${filePath}:`, err.message);
  }
};

// Initialize specialized services conditionally
let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

let gemini;
if (process.env.GEMINI_API_KEY) {
  gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

app.get('/', (req, res) => {
  res.send('Skill Gap Analyzer API is running.');
});

// AI Analysis Endpoint - Full Integration
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    const { jobDescription, jobTitle, userId } = req.body;
    
    if (!req.file || !jobDescription) {
      if (req.file && req.file.path) {
        safelyDeleteFile(req.file.path);
      }
      return res.status(400).json({ success: false, message: "Resume file and job description are required." });
    }

    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    if (req.file.mimetype !== 'application/pdf' || fileExtension !== '.pdf') {
      if (req.file.path) {
        safelyDeleteFile(req.file.path);
      }
      return res.status(400).json({ success: false, message: "Only PDF resumes are supported. Please upload a PDF file." });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);
    const parser = new PDFParse({ data: pdfBuffer });
    const pdfData = await parser.getText();
    const resumeText = pdfData.text;
    await parser.destroy();
    
    safelyDeleteFile(req.file.path);

    let aiResponseJson;

    if (gemini) {
      const systemPrompt = `You are an expert AI recruiter and career coach. You will be provided with a user's resume text, a target job title, and a job description. 
      Analyze the skill gap between the resume and the job requirements.
      Make scores realistic.
      Resume: ${resumeText.substring(0, 3000)}
      Job Title: ${jobTitle}
      Job Description: ${jobDescription.substring(0, 1500)}
      
      You must respond in JSON format with the following structure:
      {
        "matchScore": number (0-100),
        "skillInventory": { "matched": [string], "missing": [string], "recommended": [string] },
        "gapAnalysisMatrix": [ { "subject": string, "A": number, "fullMark": 100 } ],
        "learningRoadmap": [ { "title": string, "description": string, "courseLinks": [string], "duration": string } ],
        "aiRecommendation": string
      }`;

      const model = gemini.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: "application/json" }
      });
      const result = await model.generateContent(systemPrompt);
      let responseText = result.response.text();
      
      let cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const start = cleanedText.indexOf('{');
      const end = cleanedText.lastIndexOf('}');
      
      if (start !== -1 && end !== -1) {
        cleanedText = cleanedText.substring(start, end + 1);
      }

      try {
        aiResponseJson = JSON.parse(cleanedText);
      } catch(parseErr) {
        console.error("Failed to parse Gemini JSON:", responseText);
        throw new Error("AI returned malformed JSON");
      }
    } else {
       return res.status(500).json({ success: false, message: "GEMINI_API_KEY is not configured in environment variables." });
    }

    // Save report functionality if user is authenticated
    if (userId) {
      try {
        await Report.create({
          userId,
          jobTitle: jobTitle && jobTitle.length > 0 ? jobTitle : (jobDescription.length > 50 ? jobDescription.substring(0, 47) + '...' : jobDescription),
          matchScore: aiResponseJson.matchScore,
          data: aiResponseJson
        });
      } catch (dbError) {
        console.error("Error saving report to DB:", dbError);
      }
    }

    res.json({
      success: true,
      data: aiResponseJson
    });

  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ success: false, message: error.message || "Error processing the resume analysis." });
  }
});

// Get Recent Reports for Dashboard
app.get('/api/reports/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ success: false, message: "UserId is required." });
    }
    const reports = await Report.find({ userId }).sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, reports });
  } catch (error) {
    console.error("Fetch reports error:", error);
    res.status(500).json({ success: false, message: "Error fetching reports." });
  }
});

// Razorpay Order Creation
app.post('/api/payment/create-order', async (req, res) => {
  try {
    // Hot-reload .env secrets so the user doesn't have to restart their Node instance
    const envPath = require('path').resolve(__dirname, '.env');
    require('dotenv').config({ path: envPath, override: true });

    const key_id = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.error("Razorpay order creation error: Missing Razorpay environment variables. key_id present:", !!key_id, "key_secret present:", !!key_secret);
      return res.status(500).json({ success: false, message: "Razorpay credentials are not configured in environment variables." });
    }

    const dynamicRazorpay = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });

    const { amount } = req.body;
    
    if (!amount) {
      console.error("Razorpay order creation error: Missing amount in request body.");
      return res.status(400).json({ success: false, message: "Amount is required to create a payment order." });
    }

    const options = {
      amount: amount, // Amount in paise received from frontend (e.g. 99900 for ₹999)
      currency: "INR",
      receipt: "receipt_live_" + Date.now(),
    };

    const order = await dynamicRazorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error("Razorpay order creation error from SDK:", error.message || error);
    res.status(500).json({ success: false, message: error.message || "Error creating payment order." });
  }
});

// Razorpay Verification & Premium Unlock
app.post('/api/payment/verify', async (req, res) => {
  // Hot-reload .env secrets so the user doesn't have to restart their Node instance
  require('dotenv').config({ override: true });
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  if (!process.env.RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ success: false, message: "Razorpay secrets missing." });
  }

  const crypto = require("crypto");
  const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = shasum.digest("hex");

  if (digest === razorpay_signature) {
    // Payment is valid! Upgrade the user to pro conceptually
    return res.json({ success: true, message: "Payment verified successfully. Welcome Pro User 🚀!" });
  } else {
    res.status(400).json({ success: false, message: "Payment verification failed" });
  }
});

// AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userId } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: "Messages array is required." });
    }

    if (!gemini) {
      return res.status(500).json({ success: false, message: "GEMINI_API_KEY is not configured." });
    }

    let chatContext = "You are an expert AI career coach and technical mentor for a skill gap analyzer platform. Your goal is to provide concise, helpful, and encouraging answers about skills, careers, resumes, and learning roadmaps.\n\n";
    messages.forEach(m => {
       chatContext += `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}\n`;
    });
    chatContext += "AI:";

    const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(chatContext);
    const replyText = result.response.text().trim();

    res.json({
      success: true,
      message: replyText
    });

  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ success: false, message: error.message || "Error processing chat." });
  }
});

// Get User Profile Route
app.get('/api/users/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
       _id: user._id,
       name: user.name,
       email: user.email,
       isPro: user.isPro,
       subscriptionType: user.subscriptionType,
       subscriptionEndDate: user.subscriptionEndDate
    });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
});

console.log('Preparing to listen on port...', port);
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
console.log('Listen command executed. Node should stay alive now.');

// Export for Vercel serverless integration
module.exports = app;
