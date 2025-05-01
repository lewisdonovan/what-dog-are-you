// Dog API types
export interface DogBreed {
  id: number;
  name: string;
  temperament: string;
  image: {
    id: string;
    url: string;
  };
}

// API response types
export interface BreedMatch {
  breed: string;
  confidence: number;
  description: string;
  imageUrl: string;
  alternativeMatches?: Array<{
    breed: string;
    confidence: number;
  }>;
}