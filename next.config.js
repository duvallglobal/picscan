/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_PIXLR_API_KEY: process.env.PIXLR_API_CLIENT_KEY,
  },
}

module.exports = nextConfig

