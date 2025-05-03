import { analyseImage } from './huggingface';
import { getDogBreed, getRandomBreedImage } from './dogApi';
import { normaliseBreedName } from './huggingface';
import { BreedMatch } from '@/types/api';

export async function analyzeAndMatchDogBreed(imageBuffer: ArrayBuffer): Promise<BreedMatch> {
  // Get ML predictions
  const predictions = await analyseImage(imageBuffer);

  // Make sure we've got some predictions
  if (!predictions.length) {
    throw new Error('Could not determine dog breed match');
  }

  // Get the top match
  const topMatch = predictions[0];
  const alternativeMatches = predictions.slice(1).map((pred) => ({
    breed: normaliseBreedName(pred.label),
    confidence: pred.score,
  }));

  // Normalise breed name to match the Dog API format
  const normalisedBreed = normaliseBreedName(topMatch.label);

  try {
    // Get breed info
    const breedInfo = await getDogBreed(normalisedBreed);

    // Get random img of the matched breed
    const imageUrl = await getRandomBreedImage(breedInfo.id.toString());

    return {
      breed: breedInfo.name,
      confidence: topMatch.score,
      description: breedInfo.temperament,
      imageUrl,
      alternativeMatches,
    };
  } catch (breedError) {
    // If we can't find the breed in Dog API, return ML result anyway
    return {
      breed: normalisedBreed,
      confidence: topMatch.score,
      description: 'No additional information available for this breed.',
      imageUrl: '', // Frontend will handle empty img url
      alternativeMatches,
    };
  }
} 