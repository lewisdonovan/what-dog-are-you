import Constants from 'expo-constants';

// API keys should only be accessed in API routes
export const ENV = {
  API_URL: Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000',
};

// Validate environment variables in API routes only
export function validateApiKeys() {
  const requiredEnvVars = ['HUGGING_FACE_API_KEY', 'DOG_API_KEY'] as const;

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
} 