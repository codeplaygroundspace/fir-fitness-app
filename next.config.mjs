/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: false, // Changed to false to use Next.js 15's improved image optimization
  },
  // Next.js 15 specific configurations
  experimental: {
    // Enable React 19 features
    serverComponentsExternalPackages: [], // Now stable in Next.js 15
  },
}

export default nextConfig
