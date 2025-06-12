import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["media.licdn.com"],
    unoptimized: true,
  },
  // Increase body size limit for server actions to handle PDF uploads
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb", // Increased from default 1MB to 10MB
    },
  },
}

export default nextConfig
