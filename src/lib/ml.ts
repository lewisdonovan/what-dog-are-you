import { MLPrediction } from '@/types/ml';
import { MODELS, HF_API_BASE_URL, ModelId } from '@/constants/huggingface';

const MIN_CONFIDENCE_THRESHOLD = 0.4; // 40% minimum confidence
const MAX_PREDICTIONS = 3; // Return top 3 predictions

// Helper to normalize prediction format from different models
function normalizePrediction(pred: any, modelId: ModelId): MLPrediction | null {
  try {
    // Handle different response formats from various models
    const label = pred.label || pred.class || pred.breed;
    const score = typeof pred.score === 'number' ? pred.score : 
                 typeof pred.confidence === 'number' ? pred.confidence :
                 typeof pred.probability === 'number' ? pred.probability : null;

    if (!label || score === null) {
      console.warn(`Invalid prediction format from ${modelId}:`, pred);
      return null;
    }

    return {
      label,
      score,
      model: modelId
    };
  } catch (error) {
    console.error(`Error normalizing prediction from ${modelId}:`, error);
    return null;
  }
}

async function getPredictionsFromModel(imageData: string, modelId: ModelId): Promise<MLPrediction[]> {
  const response = await fetch(`${HF_API_BASE_URL}/${modelId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: imageData
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.log({error, response})
    throw new Error(`Model ${modelId} failed: ${error}`);
  }

  const predictions = await response.json();
  
  if (!Array.isArray(predictions) || predictions.length === 0) {
    throw new Error(`No valid predictions from model ${modelId}`);
  }

  // Normalize and filter predictions
  return predictions
    .map(pred => normalizePrediction(pred, modelId))
    .filter((pred): pred is MLPrediction => 
      pred !== null && pred.score >= MIN_CONFIDENCE_THRESHOLD
    );
}

export async function analyseImage(imageData: ArrayBuffer): Promise<MLPrediction[]> {
  if (!process.env.HUGGING_FACE_API_KEY) {
    throw new Error('HUGGING_FACE_API_KEY is not set');
  }

  // Convert buffer to base64
  const uint8Array = new Uint8Array(imageData);
  const base64Image = Buffer.from(uint8Array).toString('base64');

  // Get predictions from all models
  const modelPromises = MODELS.map(modelId => 
    getPredictionsFromModel(base64Image, modelId)
      .catch(error => {
        console.error(`Error with model ${modelId}:`, error);
        return [] as MLPrediction[];
      })
  );

  const allPredictions = await Promise.all(modelPromises);
  
  // Combine predictions, keeping the highest confidence for each breed
  const combinedPredictions = allPredictions
    .flat()
    .reduce((acc: { [key: string]: MLPrediction }, pred) => {
      const existing = acc[pred.label];
      if (!existing || existing.score < pred.score) {
        acc[pred.label] = pred;
      }
      return acc;
    }, {});

  // Sort by confidence and take top results
  return Object.values(combinedPredictions)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_PREDICTIONS);
}

// Helper func to normalise breed names between ML model and Dog API
export function normaliseBreedName(mlBreedName: string): string {
  return mlBreedName
    .toLowerCase()
    // Remove nums and brackets
    .replace(/\([0-9]+\)/g, '')
    // Replace underscores and dashes with spaces
    .replace(/[_-]/g, ' ')
    // Clean up whitespace
    .trim();
} 