import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const ECOMMERCE_PROMPT = `Remove the current background completely and replace it with a clean pure white (#FFFFFF) ecommerce background. Remove harsh shining, reflections, and glare from the product surface. Enhance lighting while keeping the product’s true colors accurate. Increase sharpness, clarity, and contrast so the surface details and textures are clearly visible. Clean up dust, scratches, and imperfections. Remove any hands or boxes from the image, but do not remove any cables that are part of the product. Maintain the exact product shape and decals without distortion. Do not add any parts to it. Add a soft, natural product shadow below the item for a premium studio feel. Center the motorcycle body part in the frame with balanced spacing around it. Final result should be high-resolution and suitable for Amazon or Shopify product listing.`;

export async function editProductImage(base64ImageData: string, mimeType: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: base64ImageData,
                        mimeType: mimeType,
                    },
                },
                {
                    text: ECOMMERCE_PROMPT,
                },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }

    throw new Error("API did not return an image.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to edit image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the API.");
  }
}