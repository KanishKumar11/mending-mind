/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Configure static exports for Netlify
  output: "export",
  // Disable server components for static export
  experimental: {
    appDir: true,
  },
  // Handle images in static export
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
