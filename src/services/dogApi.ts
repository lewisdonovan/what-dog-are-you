import { ENV } from '@/config/env';

const DOG_API_BASE_URL = 'https://api.thedogapi.com/v1';

export async function getDogBreed(breedName: string) {
  const response = await fetch(
    `${DOG_API_BASE_URL}/breeds/search?q=${encodeURIComponent(breedName)}`,
    {
      headers: {
        'x-api-key': ENV.DOG_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch breed information');
  }

  const breeds = await response.json();
  if (!breeds.length) {
    throw new Error(`No breed found matching ${breedName}`);
  }

  return breeds[0];
}

export async function getRandomBreedImage(breedId: string) {
  const response = await fetch(
    `${DOG_API_BASE_URL}/images/search?breed_id=${breedId}`,
    {
      headers: {
        'x-api-key': ENV.DOG_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch breed image');
  }

  const images = await response.json();
  if (!images.length) {
    throw new Error(`No images found for breed ID ${breedId}`);
  }

  return images[0].url;
} 