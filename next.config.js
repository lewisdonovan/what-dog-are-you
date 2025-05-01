/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.thedogapi.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig 