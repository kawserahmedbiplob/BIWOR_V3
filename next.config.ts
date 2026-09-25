import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    unoptimized: true,
  },
  // Prevent ESLint module-resolution issues from failing production builds on Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Optional: don't fail build on type warnings already fixed in admin
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
