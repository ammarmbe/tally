import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com"
      }
    ]
  },
  rewrites: async () => [
    {
      source: "/",
      destination: "/date/today",
    }
  ]
};

export default nextConfig;
