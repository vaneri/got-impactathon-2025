import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/api/images/**",
      },
    ],
    // Allow unoptimized images for development
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
