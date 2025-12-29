
import { GoogleGenAI } from "@google/genai";

// Fix: Initialize GoogleGenAI strictly using process.env.API_KEY as per the coding guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBusDescription = async (details: {
  name: string;
  type: string;
  features: string[];
}) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a professional and enticing marketing description for a ${details.type} bus named "${details.name}". 
      It features ${details.features.join(', ')}. Keep it under 100 words. Focus on comfort, safety, and amenities.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating description. Please write manually.";
  }
};

export const chatWithSupport = async (message: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: `You are a helpful support assistant for "Connections - Travel Owner Portal". 
        You help bus owners with issues regarding bookings, payments, and bus registration. 
        Always be polite and professional.`
      }
    });
    return response.text;
  } catch (error) {
    console.error("Support API Error:", error);
    return "Our support AI is currently offline. Please try again later.";
  }
};
