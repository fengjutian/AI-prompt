import { GoogleGenAI, Type } from "@google/genai";
import { PromptResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// 1. Expand a simple idea into a professional prompt
export const generateDetailedPrompt = async (topic: string): Promise<PromptResponse> => {
  const modelId = "gemini-2.5-flash"; // Good for text generation

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `You are an expert AI Art Prompt Engineer. 
      Convert the following short idea (which may be in Chinese or English) into a highly detailed, professional image generation prompt suitable for high-end models like Midjourney or Stable Diffusion.
      
      User Idea: "${topic}"
      
      Return JSON only with the following structure:
      {
        "enhancedPrompt": "The detailed prompt text (keep in English as it works best for models)...",
        "negativePrompt": "What to avoid (English)...",
        "suggestedModel": "Name of a suitable model style (Translate this to Chinese, e.g. 写实风格, 动漫风格, 油画风格)"
      }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            enhancedPrompt: { type: Type.STRING },
            negativePrompt: { type: Type.STRING },
            suggestedModel: { type: Type.STRING }
          },
          required: ["enhancedPrompt", "negativePrompt", "suggestedModel"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    // Handle potential markdown wrapping (e.g., ```json ... ```)
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr) as PromptResponse;

  } catch (error) {
    console.error("Error generating prompt:", error);
    throw error;
  }
};

// 2. Generate an actual image using Gemini (Imagen 3)
export const generateAiImage = async (prompt: string): Promise<string> => {
  // Using Imagen 3.0 for reliable image generation via generateImages API
  const modelId = "imagen-3.0-generate-001"; 

  try {
    const response = await ai.models.generateImages({
      model: modelId,
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: "1:1",
        outputMimeType: "image/jpeg"
      }
    });

    const base64 = response.generatedImages?.[0]?.image?.imageBytes;
    if (base64) {
      return `data:image/jpeg;base64,${base64}`;
    }

    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};