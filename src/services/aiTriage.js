import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import logger from '../config/logger.js';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const triageSchema = {
  type: SchemaType.OBJECT,
  properties: {
    priority: {
      type: SchemaType.STRING,
      enum: ["CRITICAL", "STABLE", "INFO"],
      description: "Priority of the SOS request based on severity.",
    },
    category: {
      type: SchemaType.STRING,
      enum: ["Medical", "Fire", "Trapped", "Other"],
      description: "Classification of the emergency.",
    },
    summary: {
      type: SchemaType.STRING,
      description: "A concise 1-2 sentence summary of the situation.",
    },
    locationCertainty: {
      type: SchemaType.NUMBER,
      description: "Confidence level of the location from 0 to 100 based on the text context.",
    },
  },
  required: ["priority", "category", "summary", "locationCertainty"],
};

export const analyzeSosText = async (rawText) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: triageSchema,
      },
    });

    const prompt = `You are an expert emergency triage AI for the ResQWave disaster-resilient system.
Analyze the following raw SOS message coming from an offline Acoustic Mesh network.
Provide a structured response using the JSON schema.

SOS Message: "${rawText}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonStr = response.text();
    return JSON.parse(jsonStr);
  } catch (error) {
    logger.error(`AI Triage Error: ${error.message}`);
    // Fallback classification if AI fails
    return {
      priority: 'INFO',
      category: 'Other',
      summary: 'Automated triage failed. Needs human review: ' + rawText.substring(0, 100),
      locationCertainty: 0
    };
  }
};
