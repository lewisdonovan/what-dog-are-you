export const HF_API_BASE_URL = 'https://api-inference.huggingface.co/models';

// Array of models to use for breed prediction
export const MODELS = [
  'prithivMLmods/Dog-Breed-120',        // Primary model - SiglipForImageClassification (86.81% accuracy)
  'dima806/133_dog_breeds_image_detection',  // Secondary model - ViT based
  'amaye15/ViT-Standford-Dogs'          // Tertiary model - ViT based on Stanford Dogs dataset
] as const;

export type ModelId = typeof MODELS[number];