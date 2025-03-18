import { NextResponse } from "next/server"
import { ImageAnnotatorClient } from "@google-cloud/vision"

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
    const { imageUrl } = await request.json()

    if (!visionClient) {
      throw new Error("Google Cloud Vision client not initialized")
    }

    const [result] = await visionClient.annotateImage({
      image: { source: { imageUri: imageUrl } },
      features: [
        { type: "LABEL_DETECTION" },
        { type: "OBJECT_LOCALIZATION" },
        { type: "IMAGE_PROPERTIES" },
        { type: "TEXT_DETECTION" },
      ],
    })

    return NextResponse.json({
      labels: result.labelAnnotations || [],
      objects: result.localizedObjectAnnotations || [],
      properties: result.imagePropertiesAnnotation || {},
      text: result.textAnnotations || [],
    })
  } catch (error) {
    console.error("Error analyzing image:", error)
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 })
  }
}

