/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    CHUNKR_API_KEY: process.env.CHUNKR_API_KEY,
  },
  publicRuntimeConfig: {
    // Add public runtime config here if needed
  },
};

export default nextConfig;
