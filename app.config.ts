import 'dotenv/config';
import { ExpoConfig } from '@expo/config-types';

const config: ExpoConfig = {
  name: "what-dog-are-you",
  slug: "what-dog-are-you",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    }
  },
  web: {
    favicon: "./assets/favicon.png", 
    "output": "server"
  },
  extra: {
    apiUrl: process.env.API_URL,
    huggingFaceApiKey: process.env.HUGGING_FACE_API_KEY,
    dogApiKey: process.env.DOG_API_KEY,
  },
};

export default config; 