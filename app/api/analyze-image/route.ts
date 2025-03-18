import { NextResponse } from "next/server"
import { ImageAnnotatorClient } from "@google-cloud/vision"
import { z } from 'zod'

const requestSchema = z.object({
  imageUrl: z.string().url()
})

let visionClient: ImageAnnotatorClient

try {
  visionClient = new ImageAnnotatorClient({
    credentials: JSON.parse(process.env.GOOGLE_CLOUD_VISION_CREDENTIALS || "{}"),
  })
} catch (error) {
  console.error("Error initializing Google Cloud Vision client:", error)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = requestSchema.parse(body)

    if (!visionClient) {
      return NextResponse.json(
        { error: "Vision API client not initialized" },
        { status: 500 }
      )
    }

    const [result] = await visionClient.annotateImage({
      image: { source: { imageUri: validatedData.imageUrl } },
      features: [
        { type: "LABEL_DETECTION" },
        { type: "OBJECT_LOCALIZATION" },
        { type: "IMAGE_PROPERTIES" },
        { type: "TEXT_DETECTION" },
      ],
    })

    if (!result) {
      return NextResponse.json(
        { error: "Failed to analyze image" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      labels: result.labelAnnotations || [],
      objects: result.localizedObjectAnnotations || [],
      properties: result.imagePropertiesAnnotation || {},
      text: result.textAnnotations || [],
    })
  } catch (error) {
    console.error("Error analyzing image:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze image" },
      { status: 500 }
    )
  }
}

