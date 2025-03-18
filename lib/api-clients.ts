async function pixlrFetch(endpoint: string, options: RequestInit = {}) {
  const baseUrl = "https://api.pixlr.com/v1"
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PIXLR_API_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Pixlr API error: ${response.status} ${response.statusText} - ${errorText}`)
  }

  return response.json()
}

export interface PhotoEnhancementOptions {
  brightness?: number // -100 to 100
  contrast?: number // -100 to 100
  saturation?: number // -100 to 100
  autoEnhance?: boolean
  autoCrop?: boolean
  removeBackground?: boolean
}

export async function enhancePhoto(imageUrl: string, options: PhotoEnhancementOptions) {
  try {
    const result = await pixlrFetch("/enhance", {
      method: "POST",
      body: JSON.stringify({
        image: imageUrl,
        ...options,
      }),
    })
    return result
  } catch (error) {
    console.error("Error enhancing photo:", error)
    throw error
  }
}

export async function analyzeImage(imageUrl: string) {
  try {
    const response = await fetch("/api/analyze-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Image analysis error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error analyzing image:", error)
    throw error
  }
}

// E-commerce platform integrations
export interface EcommercePlatform {
  name: string
  icon: string
  fields: string[]
}

export const ECOMMERCE_PLATFORMS: EcommercePlatform[] = [
  {
    name: "Shopify",
    icon: "/icons/shopify.svg",
    fields: ["title", "description", "price", "images", "variants"],
  },
  {
    name: "Amazon",
    icon: "/icons/amazon.svg",
    fields: ["title", "description", "price", "images", "category"],
  },
  {
    name: "Etsy",
    icon: "/icons/etsy.svg",
    fields: ["title", "description", "price", "images", "tags"],
  },
  {
    name: "eBay",
    icon: "/icons/ebay.svg",
    fields: ["title", "description", "price", "images", "condition"],
  },
]

