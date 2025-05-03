import Constants from 'expo-constants';

// In Expo, we need to access environment variables through Constants.expoConfig.extra
export const ENV = {
  HUGGING_FACE_API_KEY: Constants.expoConfig?.extra?.huggingFaceApiKey || '',
  DOG_API_KEY: Constants.expoConfig?.extra?.dogApiKey || '',
};

// Validate environment variables
const requiredEnvVars = ['HUGGING_FACE_API_KEY', 'DOG_API_KEY'] as const;

for (const envVar of requiredEnvVars) {
  if (!ENV[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
  }
} 