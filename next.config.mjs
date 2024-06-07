/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  experimental: {
    reactCompiler: true,
    ppr: true,
  },
};

export default nextConfig;
