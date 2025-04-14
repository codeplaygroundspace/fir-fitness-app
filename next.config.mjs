/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['nadfduujsmcwckcdsmlb.supabase.co', 'live.staticflickr.com'],
    unoptimized: process.env.NODE_ENV !== 'production'
  },
  // We're not disabling ESLint or TypeScript checks anymore
}

export default nextConfig
