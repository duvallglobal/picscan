'use server'

import { enhancePhoto } from "./api-clients"
import { createServerReference } from "./server-utils"
import { ProductAnalysis, ProductListing, ApiResponse } from "./types";
import { generateFallbackTitle, generateFallbackDescription } from "./fallback-generator"

export async function analyzeProductImage(imageUrl: string): Promise<ProductAnalysis> {
  try {
    // First enhance the image
    const enhancedImage = await enhancePhoto(imageUrl, {
      autoEnhance: true,
      autoCrop: true
    })

    // Return analysis with fallback data for demo
    return {
      id: Date.now().toString(),
      title: generateFallbackTitle(),
      description: generateFallbackDescription(),
      suggestedPrice: 999.99,
      imageUrl: enhancedImage.url,
      category: "Smartphones",
      features: [
        "High-resolution display",
        "Advanced camera system",
        "Long battery life",
        "Fast processor",
        "Premium design"
      ],
      specifications: {
        "Display": "6.7-inch OLED",
        "Camera": "48MP main sensor",
        "Battery": "4500mAh",
        "Storage": "256GB"
      },
      similarProducts: [],
      competitorProducts: []
    }
  } catch (error) {
    console.error("Error analyzing product image:", error)
    throw error
  }
}

export async function enhanceProductImage(imageUrl: string, options: any) {
  try {
    const result = await enhancePhoto(imageUrl, options)
    return {
      enhancedImageUrl: result.url,
      width: result.width,
      height: result.height
    }
  } catch (error) {
    console.error("Error enhancing image:", error)
    throw error
  }
}

export async function exportToMarketplace(product: ProductAnalysis, platforms: string[]): Promise<void> {
  try {
    // In a real app, we would use the respective marketplace APIs
    // For this demo, we'll simulate the export
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("Product exported to platforms:", platforms)
  } catch (error) {
    console.error("Error exporting product:", error)
    throw error
  }
}

export async function saveProductListing(product: Omit<ProductListing, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ProductListing>> {
  try {
    const response = await fetch('/api/save-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to save product:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save product'
    };
  }
}

// Client-side references
export const saveProductListingRef = createServerReference<typeof saveProductListing>(saveProductListing.name);
export const exportToMarketplaceRef = createServerReference<typeof exportToMarketplace>(exportToMarketplace.name);
export const analyzeProductImageRef = createServerReference<typeof analyzeProductImage>(analyzeProductImage.name);

