
import { GoogleGenAI } from "@google/genai";

let cachedClient: GoogleGenAI | null = null;

function resolveApiKey(): string | undefined {
  const viteKey = import.meta.env?.VITE_GEMINI_API_KEY as string | undefined;
  const envKey = typeof process !== 'undefined'
    ? ((process.env?.API_KEY || process.env?.GEMINI_API_KEY) as string | undefined)
    : undefined;
  return viteKey || envKey;
}

function getClient(): GoogleGenAI | null {
  const apiKey = resolveApiKey();
  if (!apiKey) {
    return null;
  }
  if (!cachedClient) {
    cachedClient = new GoogleGenAI({ apiKey });
  }
  return cachedClient;
}

export const generateBusDescription = async (details: {
  name: string;
  type: string;
  features: string[];
}) => {
  const client = getClient();
  if (!client) {
    console.warn("Gemini API key missing. Returning fallback description.");
    return `Premium ${details.type} bus "${details.name}" featuring ${details.features.join(", ")}.`;
  }
  try {
    const response = await client.models.generateContent({
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
  const client = getClient();
  if (!client) {
    console.warn("Gemini API key missing. Falling back to manual support response.");
    return "Our support AI is currently offline. Please raise a ticket with the admin team.";
  }
  try {
    const response = await client.models.generateContent({
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
