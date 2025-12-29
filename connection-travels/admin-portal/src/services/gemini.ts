
import { GoogleGenAI, Type } from "@google/genai";

// Fixed: Correctly initialize GoogleGenAI with a named parameter using process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeBusFeatures = async (features: string[], description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these bus features: ${features.join(', ')}. 
      Context: ${description}. 
      Flag any suspicious features (e.g., claiming a DJ booth on a 10-seater van) or missing standards.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Legitimacy score 0-100" },
            redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendation: { type: Type.STRING }
          },
          required: ["score", "redFlags", "recommendation"]
        }
      }
    });
    // response.text is a property, not a method.
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
