/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Completely disable ESLint during builds
    ignoreDuringBuilds: true
  },
  typescript: {
    // Completely disable TypeScript errors during builds
    ignoreBuildErrors: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  // Force SWC
  swcMinify: true,
}

export default nextConfig
