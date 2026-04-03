const fs = require('fs');
const { PDFParse } = require('pdf-parse');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

async function test() {
  console.log('--- Starting perf test ---');
  console.log('GEMINI_API_KEY present: ' + !!process.env.GEMINI_API_KEY);
  
  const startTime = Date.now();
  
  // Test Gemini
  console.log('Testing Gemini...');
  const geminiStart = Date.now();
  try {
    const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await gemini.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Respond with a simple hello.',
    });
    console.log('Gemini finished in ' + (Date.now() - geminiStart) + 'ms');
    console.log('Gemini response: ' + response.text);
  } catch(e) {
    console.error('Gemini Error: ' + e.message);
  }

  console.log('Total time: ' + (Date.now() - startTime) + 'ms');
}
test();
