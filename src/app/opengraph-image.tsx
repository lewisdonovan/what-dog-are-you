import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'What breed of dog are you?';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Load the fonts at the module level
const regularFont = fetch(
  new URL('../../public/fonts/Geist-Regular.ttf', import.meta.url)
).then(async (res) => {
  if (!res.ok) throw new Error(`Failed to load font: ${res.statusText}`);
  return res.arrayBuffer();
});

const boldFont = fetch(
  new URL('../../public/fonts/Geist-Bold.ttf', import.meta.url)
).then(async (res) => {
  if (!res.ok) throw new Error(`Failed to load font: ${res.statusText}`);
  return res.arrayBuffer();
});

export default async function Image() {
  try {
    // Load fonts
    const [regular, bold] = await Promise.all([regularFont, boldFont]);

    // Fetch a random dog image from The Dog API
    const response = await fetch('https://api.thedogapi.com/v1/images/search?size=med', {
      headers: {
        'x-api-key': process.env.DOG_API_KEY || '',
      },
    });
    
    const [data] = await response.json();
    const dogImageUrl = data?.url;

    return new ImageResponse(
      (
        <div
          style={{
            background: 'black',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 80,
            gap: 48,
          }}
        >
          {/* Left side - Text */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '60%',
            }}
          >
            <h1
              style={{
                fontSize: 64,
                fontFamily: 'Geist',
                color: 'white',
                lineHeight: 1.2,
                margin: 0,
                fontWeight: 700,
              }}
            >
              What breed of dog are you?
            </h1>
            <p
              style={{
                fontSize: 32,
                fontFamily: 'Geist',
                color: '#888888',
                margin: '24px 0 0 0',
              }}
            >
              Find your canine counterpart with AI
            </p>
          </div>

          {/* Right side - Dog Image */}
          <div
            style={{
              width: '35%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 24,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dogImageUrl}
              alt="Dog"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        </div>
      ),
      {
        ...size,
        fonts: [
          {
            name: 'Geist',
            data: regular,
            weight: 400,
            style: 'normal',
          },
          {
            name: 'Geist',
            data: bold,
            weight: 700,
            style: 'normal',
          },
        ],
      }
    );
  } catch (error) {
    console.error('OpenGraph generation error:', error);
    
    // Fallback to a simple text-only OG image if something goes wrong
    const regular = await regularFont;
    
    return new ImageResponse(
      (
        <div
          style={{
            background: 'black',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 80,
          }}
        >
          <h1
            style={{
              fontSize: 64,
              fontFamily: 'Geist',
              color: 'white',
              textAlign: 'center',
              lineHeight: 1.2,
            }}
          >
            What breed of dog are you?
          </h1>
        </div>
      ),
      {
        ...size,
        fonts: [
          {
            name: 'Geist',
            data: regular,
            weight: 400,
            style: 'normal',
          },
        ],
      }
    );
  }
} 