# What Dog Are You?

A React Native Expo app that uses AI to tell you which dog breed you look like! Built with:

- Expo 53.0.7
- React Native 0.79.2
- HuggingFace API for image analysis
- The Dog API for breed information

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your API keys:
```
HUGGING_FACE_API_KEY=your_key_here
DOG_API_KEY=your_key_here
```

3. Start the development server:
```bash
npx expo start
```

4. Use Expo Go on your device or an emulator to run the app.

## Features

- Take or select a photo
- AI-powered breed matching
- View breed characteristics and traits
- See alternative breed matches
- Beautiful native UI

## Development

- `src/app/` - App screens and API routes
- `src/services/` - API integrations
- `src/types/` - TypeScript types
- `src/constants/` - Configuration constants
