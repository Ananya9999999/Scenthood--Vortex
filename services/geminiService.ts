
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Perfume, Recommendation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPerfumeRecommendation = async (
  profile: UserProfile,
  collection: Perfume[],
  mood: string,
  occasion: string = 'N/A'
): Promise<Recommendation> => {
  const collectionList = collection.map(p => `${p.brand} - ${p.name} (Notes: ${p.notes || 'N/A'})`).join(', ');
  const blacklistedList = (profile.blacklist || []).join(', ');
  const isCandle = profile.productType === 'CANDLE';

  const prompt = isCandle 
    ? `
    Product Category: LUXURY SCENTED CANDLES
    User Profile:
    - Age: ${profile.age}
    - Location: ${profile.country}
    - Budget: ${profile.minPrice} to ${profile.maxPrice}
    
    Context:
    - Desired Mood for the room: ${mood}
    - Existing Candle Collection: [${collectionList || 'None'}]
    - Blacklisted/Rejected: [${blacklistedList || 'None'}]

    Task:
    1. Select the best match from their current candle library for this room mood.
    2. Recommend ONE NEW luxury scented candle.
    3. Include "atomizingStrength" (Scent Throw): Describe the intensity of the scent in a room (e.g., "Fills Large Halls", "Intimate Glow").
    4. Prioritize high-end candle houses like Diptyque, Jo Malone, Byredo, Cire Trudon, or premium local brands from ${profile.country}.
    5. Focus on room ambiance and throw quality.
    `
    : `
    Product Category: LUXURY PERFUMES
    User Profile:
    - Age: ${profile.age}
    - Gender: ${profile.gender}
    - Weather Preference: ${profile.weatherPreference}
    - Time of Day: ${profile.timeOfDay}
    - Occupation: ${profile.occupation}
    - Location: ${profile.country}
    - Budget: ${profile.minPrice} to ${profile.maxPrice}

    Context:
    - Current Mood: ${mood}
    - Current Occasion: ${occasion}
    - Existing Collection: [${collectionList || 'None'}]
    - Blacklisted: [${blacklistedList || 'None'}]

    Task:
    1. Select the best match from their collection for these conditions.
    2. Recommend ONE NEW luxury perfume.
    3. Include "atomizingStrength" (Longevity & Sillage): Describe how long it lasts and how it projects (e.g., "8-10 Hours, Strong Sillage", "Intimate Skin Scent").
    4. Respect price and location preferences.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          collectionMatch: {
            type: Type.OBJECT,
            nullable: true,
            properties: {
              name: { type: Type.STRING },
              brand: { type: Type.STRING },
              id: { type: Type.STRING }
            }
          },
          newDiscovery: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              brand: { type: Type.STRING },
              notes: { type: Type.STRING },
              price: { type: Type.STRING },
              currency: { type: Type.STRING },
              description: { type: Type.STRING },
              officialUrl: { type: Type.STRING },
              atomizingStrength: { type: Type.STRING, description: "Longevity and projection level" },
              isLocalBrand: { type: Type.BOOLEAN }
            }
          }
        },
        required: ["newDiscovery"]
      }
    }
  });

  const data = JSON.parse(response.text);
  
  return {
    collectionMatch: data.collectionMatch ? {
        id: data.collectionMatch.id || 'match-1',
        name: data.collectionMatch.name,
        brand: data.collectionMatch.brand,
        notes: ''
    } : null,
    newDiscovery: data.newDiscovery
  };
};

export const generatePerfumeImage = async (name: string, brand: string, type: 'PERFUME' | 'CANDLE' = 'PERFUME'): Promise<string | null> => {
  const productLabel = type === 'PERFUME' ? 'luxury perfume bottle' : 'luxury scented candle in a glass jar';
  const prompt = `A professional, high-end commercial product photograph of a ${productLabel} named "${name}" by "${brand}". Soft studio lighting, minimalist black or gold background, 8k resolution. Elegant branding visible.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};
