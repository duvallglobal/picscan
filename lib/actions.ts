"use server"

import { generateText } from "ai"
import { perplexity } from "@ai-sdk/perplexity"
import { analyzeImage, enhancePhoto } from "./api-clients"
import { ProductAnalysis, ProductListing, ApiResponse } from "./types";
import { useToast } from "@/hooks/use-toast";export async function analyzeProductImage(imageUrl: string): Promise<ProductAnalysis> {
  // ...
}plugins: [require('tailwindcss-animate')],import { Font } from 'next/font';import type { Metadata } from 'next';

export const metadata: Metadata = {
  // ...
}
export async function analyzeProductImage(imageUrl: string): Promise<ProductAnalysis> {
  try {
    // Analyze the image with Google Cloud Vision
    const imageAnalysis = await analyzeImage(imageUrl)

    // Extract relevant information from the analysis
    const detectedLabels = imageAnalysis.labels.map((label) => label.description)
    const detectedObjects = imageAnalysis.objects.map((obj) => obj.name)
    const detectedText = imageAnalysis.text[0]?.description || ""

    // Generate product title using Perplexity AI
    const titlePrompt = `Generate a concise, appealing product title based on these details:
      Labels: ${detectedLabels.join(", ")}
      Objects: ${detectedObjects.join(", ")}
      Text: ${detectedText}
      Keep it under 10 words and make it marketable.`

    const { text: title } = await generateText({
      model: perplexity("pplx-7b-online"),
      prompt: titlePrompt,
      apiKey: process.env.PERPLEXITY_API_KEY,
    })

    // Generate product description
    const descriptionPrompt = `Generate a detailed product description based on these details:
      Labels: ${detectedLabels.join(", ")}
      Objects: ${detectedObjects.join(", ")}
      Text: ${detectedText}
      Include key features and selling points. Keep it under 200 words.`

    const { text: description } = await generateText({
      model: perplexity("pplx-7b-online"),
      prompt: descriptionPrompt,
      apiKey: process.env.PERPLEXITY_API_KEY,
    })

    // Generate features list
    const featuresPrompt = `List 5 key features based on these details:
      Labels: ${detectedLabels.join(", ")}
      Objects: ${detectedObjects.join(", ")}
      Text: ${detectedText}
      Make them concise and marketable.`

    const { text: featuresText } = await generateText({
      model: perplexity("pplx-7b-online"),
      prompt: featuresPrompt,
      apiKey: process.env.PERPLEXITY_API_KEY,
    })

    const features = featuresText
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => line.replace(/^-\s*/, ""))

    // Enhance the product image
    const enhancedImage = await enhancePhoto(imageUrl, {
      autoEnhance: true,
      autoCrop: true,
    })

    // Return the complete product analysis
    return {
      id: Math.random().toString(36).substring(2, 15),
      title: title.trim(),
      description: description.trim(),
      price: 0, // To be set by user
      images: [enhancedImage.url],
      category: detectedLabels[0] || "Uncategorized",
      features,
      specifications: {
        Category: detectedLabels[0] || "Uncategorized",
        Type: detectedObjects[0] || "Unknown",
        Condition: "New", // Default value
      },
    }
  } catch (error) {
    console.error("Error analyzing product image:", error)
    throw error
  }
}

export async function saveProductListing(product: ProductAnalysis): Promise<void> {
  try {
    // In a real app, we would save to a database
    // For this demo, we'll simulate saving
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Product saved:", product)
  } catch (error) {
    console.error("Error saving product:", error)
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

export async function analyzeProductImage(imageFile: File): Promise<ApiResponse<ProductAnalysis>> {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch('/api/analyze-product-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to analyze image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze image'
    };
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

