export interface ProductAnalysis {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  category: string
  features: string[]
  specifications: Record<string, string>
}

export interface MarketplaceListing {
  platform: string
  productId: string
  status: "draft" | "published" | "error"
  url?: string
  error?: string
}

export interface PhotoEnhancementResult {
  url: string
  width: number
  height: number
  size: number
}

