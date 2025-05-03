import { HF_API_BASE_URL, MODELS, ModelId } from '@/constants/huggingface';
import { ENV } from '@/config/env';

export async function analyseImage(imageBuffer: ArrayBuffer) {
  // Convert ArrayBuffer to Base64
  const base64Image = Buffer.from(imageBuffer).toString('base64');
  
  const predictions = await Promise.all(
    MODELS.map(async (model) => {
      const response = await fetch(`${HF_API_BASE_URL}/${model}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ENV.HUGGING_FACE_API_KEY}`,
        },
        body: JSON.stringify({
          inputs: {
            image: base64Image,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`Model ${model} error:`, error);
        throw new Error(`Failed to analyze image with model ${model}: ${error}`);
      }

      return response.json();
    })
  );

  // Flatten and sort predictions
  return predictions
    .flat()
    .sort((a, b) => b.score - a.score)
    .filter((pred) => pred.score > 0.1); // Filter out low confidence predictions
} 

export function normaliseBreedName(mlBreedName: string): string {
  return (
    mlBreedName
      .toLowerCase()
      // Remove nums and brackets
      .replace(/\([0-9]+\)/g, '')
      // Replace underscores and dashes with spaces
      .replace(/[_-]/g, ' ')
      // Clean up whitespace
      .trim()
  );
}