const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_PIXLR_API_KEY: process.env.NEXT_PUBLIC_PIXLR_API_KEY,
    GOOGLE_CLOUD_VISION_CREDENTIALS: process.env.GOOGLE_CLOUD_VISION_CREDENTIALS,
    PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY,
  },
}

module.exports = nextConfig

