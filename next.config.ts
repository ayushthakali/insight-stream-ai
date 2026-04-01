import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Disables Next.js Image Optimization for external URLs
  },
};

export default nextConfig;
