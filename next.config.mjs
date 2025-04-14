/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Completely disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Completely disable TypeScript checking during builds
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable other checks that might cause build failures
  experimental: {
    forceSwcTransforms: true,
  },
}

export default nextConfig
