import { analyzeAndMatchDogBreed } from '@/services/imageAnalysis';

export function GET(request: Request) {
  return Response.json({ hello: 'world' });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return Response.json(
        { error: 'No photo provided' },
        { status: 400 }
      );
    }

    // Convert base64 to buffer and then to ArrayBuffer
    const tempBuffer = Buffer.from(image, 'base64');
    const buffer = tempBuffer.buffer.slice(
      tempBuffer.byteOffset,
      tempBuffer.byteOffset + tempBuffer.byteLength
    );
    
    // Get the analysis result
    const result = await analyzeAndMatchDogBreed(buffer);

    return Response.json({
      success: true,
      match: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to process photo';
    return Response.json(
      { error: message },
      { status: 500 }
    );
  }
}