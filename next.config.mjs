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
    unoptimized: true,
  },
  // Explicitly enable SWC
  swcMinify: true,
  experimental: {
    // Only keep necessary experimental features
    serverComponentsExternalPackages: [],
    // Force SWC even with Babel config
    forceSwcTransforms: true,
  },
}

export default nextConfig
