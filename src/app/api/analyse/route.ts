import { NextResponse } from "next/server";
import { analyseImage, normaliseBreedName } from "@/lib/ml";
import { getDogBreed, getRandomBreedImage } from "@/lib/api";
import { BreedMatch } from "@/types/api";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const photo = formData.get("photo") as File;

    if (!photo) {
      return NextResponse.json(
        { error: "No photo provided" },
        { status: 400 }
      );
    }

    // Convert file to ArrayBuf for ML processing
    const buffer = await photo.arrayBuffer();
    
    // Get ML predictions
    const predictions = await analyseImage(buffer);
    
    // Make sure we've got some predictions
    if (!predictions.length) {
      return NextResponse.json(
        { error: "Could not determine dog breed match" },
        { status: 400 }
      );
    }
    
    // Get the top match
    const topMatch = predictions[0];
    const alternativeMatches = predictions.slice(1).map(pred => ({
      breed: normaliseBreedName(pred.label),
      confidence: pred.score
    }));
    
    // Normalise breed name to match the Dog API format
    const normalisedBreed = normaliseBreedName(topMatch.label);
    
    try {
      // Get breed info
      const breedInfo = await getDogBreed(normalisedBreed);
      
      // Get random img of the matched breed
      const imageUrl = await getRandomBreedImage(breedInfo.id.toString());

      const match: BreedMatch = {
        breed: breedInfo.name,
        confidence: topMatch.score,
        description: breedInfo.temperament,
        imageUrl,
        alternativeMatches
      };

      return NextResponse.json({
        success: true,
        match
      });
    } catch (breedError) {
      // If we can't find the breed in Dog API, return ML result anyway
      return NextResponse.json({
        success: true,
        match: {
          breed: normalisedBreed,
          confidence: topMatch.score,
          description: "No additional information available for this breed.",
          imageUrl: "", // Frontend will handle empty img url
          alternativeMatches
        }
      });
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process photo";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
} 