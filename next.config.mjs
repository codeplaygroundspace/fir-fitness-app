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
  // Ensure SWC is enabled for font optimization
  swcMinify: true,
  compiler: {
    // Recommended SWC configuration
    styledComponents: false,
  },
  experimental: {
    // Only keep necessary experimental features
    serverComponentsExternalPackages: [],
  },
}

export default nextConfig
