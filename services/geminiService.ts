
import { GoogleGenAI, Type } from "@google/genai";
import { UserData } from "../types";

// Fix: Strictly following the required initialization pattern
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPersonalizedHealthTips = async (userData: UserData) => {
  try {
    const prompt = `Based on my fitness profile:
    - Goal: ${userData.goal}
    - Current Weight: ${userData.weight}kg, Height: ${userData.height}cm
    - Desired Weight: ${userData.desiredWeight}kg
    - Workout Frequency: ${userData.workoutFrequency} times/week
    - Diet: ${userData.diet}
    
    Provide 3 concise, highly actionable daily tips for health and diet.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ["title", "description", "category"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [
      { title: "Hydrate", description: "Drink at least 2L of water today.", category: "General" },
      { title: "Protein", description: "Ensure you hit your protein goals for muscle retention.", category: "Diet" }
    ];
  }
};
