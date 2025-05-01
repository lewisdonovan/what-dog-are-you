import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'What Dog Breed Are You?',
  description:
    'Upload your photo and find out which dog breed matches your personality using AI!',
  applicationName: 'What Dog Are you?',
  authors: [{ name: 'Lewis Donovan', url: 'https://lewisdonovan.dev' }],
  generator: 'Next.js',
  keywords: [
    'dog',
    'breed',
    'classification',
    'image',
    'recognition',
    'lewis',
    'donovan',
    'lewisdonovan',
    'barkibu',
  ],
  robots: 'index, follow',
  creator: 'Lewis Donovan',
  publisher: 'Lewis Donovan',
  openGraph: {
    title: 'What Dog Breed Are You?',
    description:
      'Upload your photo and find out which dog breed matches your personality using AI!',
    type: 'website',
    images: [
      { url: 'https://what-dog-are-you-ochre.vercel.app/opengraph-image' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Dog Breed Are You?',
    description:
      'Upload your photo and find out which dog breed matches your personality using AI!',
    images: [
      { url: 'https://what-dog-are-you-ochre.vercel.app/opengraph-image' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
