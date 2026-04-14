const fs = require('fs');
let code = fs.readFileSync('index.js', 'utf8');

code = code.replace(/if \(gemini\) \{[\s\S]*?\} else \{[\s\S]*?"GEMINI_API_KEY is not configured[\s\S]*?\}/, `if (openai) {
      const systemPrompt = \`You are an expert AI recruiter and career coach. You will be provided with a user's resume text, a target job title, and a job description. 
      Analyze the skill gap between the resume and the job requirements.
      Make scores realistic.
      Resume: \${resumeText.substring(0, 3000)}
      Job Title: \${jobTitle}
      Job Description: \${jobDescription.substring(0, 1500)}
      
      You must respond in JSON format with the following structure:
      {
        "matchScore": number,
        "skillInventory": { "matched": ["string"], "missing": ["string"], "recommended": ["string"] },
        "gapAnalysisMatrix": [ { "subject": "string", "A": number, "fullMark": 100 } ],
        "learningRoadmap": [ { "title": "string", "description": "string", "courseLinks": [], "duration": "string" } ],
        "aiRecommendation": "string"
      }\`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: systemPrompt }],
        response_format: { type: "json_object" }
      });
      aiResponseJson = JSON.parse(completion.choices[0].message.content);
    } else {
       return res.status(500).json({ success: false, message: "OPENAI_API_KEY is not configured in environment variables." });
    }`);

code = code.replace(/if \(!gemini\) \{[\s\S]*?"GEMINI_API_KEY is not configured." \}\);[\s\S]*?\}[\s\S]*?const replyText = result.response.text\(\)\.trim\(\);/, `if (!openai) {
      return res.status(500).json({ success: false, message: "OPENAI_API_KEY is not configured." });
    }

    const oaiMessages = [
      { role: "system", content: "You are an expert AI career coach and technical mentor for a skill gap analyzer platform. Your goal is to provide concise, helpful, and encouraging answers about skills, careers, resumes, and learning roadmaps." }
    ];
    messages.forEach(m => {
       oaiMessages.push({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content });
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: oaiMessages
    });
    const replyText = completion.choices[0].message.content.trim();`);

fs.writeFileSync('index.js', code);
console.log('OpenAI replacement applied.');
