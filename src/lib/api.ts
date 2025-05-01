import { DogBreed } from '@/types/api';

const DOG_API_BASE_URL = 'https://api.thedogapi.com/v1';

async function searchBreed(breedName: string): Promise<DogBreed> {
  const response = await fetch(`${DOG_API_BASE_URL}/breeds/search?q=${encodeURIComponent(breedName)}`, {
    headers: {
      'x-api-key': process.env.DOG_API_KEY!
    }
  });

  if (!response.ok) {
    throw new Error('Failed to search for breed');
  }

  const breeds = await response.json();
  if (!breeds.length) {
    throw new Error(`No breed found matching: ${breedName}`);
  }

  return breeds[0];
}

export async function getDogBreed(breedName: string): Promise<DogBreed> {
  if (!process.env.DOG_API_KEY) {
    throw new Error('DOG_API_KEY is not set');
  }

  const breed = await searchBreed(breedName);
  return breed;
}

export async function getRandomBreedImage(breedId: string): Promise<string> {
  if (!process.env.DOG_API_KEY) {
    throw new Error('DOG_API_KEY is not set');
  }

  const response = await fetch(`${DOG_API_BASE_URL}/images/search?breed_id=${breedId}`, {
    headers: {
      'x-api-key': process.env.DOG_API_KEY
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch breed image');
  }

  const [image] = await response.json();
  if (!image?.url) {
    throw new Error('No image found for breed');
  }

  return image.url;
} 