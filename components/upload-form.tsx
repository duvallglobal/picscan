"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, ImagePlus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { analyzeProductImage } from "@/lib/actions"

// Add these imports at the top
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ImageEditor from "./image-editor"

export default function UploadForm() {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Add a new state for edited images
  const [editedPreviews, setEditedPreviews] = useState<string[]>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  // Add a function to handle image updates from the editor
  const handleImageUpdated = (newImageUrl: string) => {
    if (selectedImageIndex !== null) {
      const newEditedPreviews = [...editedPreviews]
      newEditedPreviews[selectedImageIndex] = newImageUrl
      setEditedPreviews(newEditedPreviews)
    }
  }

  // Update the handleFileChange function to initialize editedPreviews
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files)
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles])

      // Create previews
      selectedFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setPreviews((prev) => [...prev, e.target!.result as string])
            setEditedPreviews((prev) => [...prev, ""]) // Initialize with empty string
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  // Update the handleDrop function to initialize editedPreviews
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files)
      setFiles((prevFiles) => [...prevFiles, ...droppedFiles])

      // Create previews
      droppedFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setPreviews((prev) => [...prev, e.target!.result as string])
            setEditedPreviews((prev) => [...prev, ""]) // Initialize with empty string
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  // Update the handleRemoveFile function to also remove from editedPreviews
  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
    setEditedPreviews(editedPreviews.filter((_, i) => i !== index))
    if (selectedImageIndex === index) {
      setSelectedImageIndex(null)
    }
  }

  // Update the handleSubmit function to use editedPreviews when available
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one product image.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Use the edited image if available, otherwise use the original
      const imageToAnalyze = editedPreviews[0] && editedPreviews[0] !== "" ? editedPreviews[0] : previews[0]

      // Analyze the product image
      const result = await analyzeProductImage(imageToAnalyze)

      // Navigate to results page with the analysis data
      router.push(`/results?id=${result.id}`)
    } catch (error) {
      console.error("Error analyzing product image:", error)
      toast({
        title: "Analysis failed",
        description: "There was an error processing your image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <Card className="p-6 max-w-3xl mx-auto bg-white dark:bg-slate-800 shadow-md">
      <form onSubmit={handleSubmit}>
        <div
          className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center ${
            previews.length > 0 ? "border-slate-300" : "border-slate-300 hover:border-slate-400"
          } transition-colors`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {previews.length === 0 ? (
            <div className="flex flex-col items-center justify-center">
              <ImagePlus className="h-12 w-12 text-slate-400 mb-4" />
              <p className="text-slate-600 dark:text-slate-400 mb-2">
                Drag and drop your product images here, or click to browse
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500">Supports: JPG, PNG, WEBP (Max 10MB)</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="preview" className="flex-1">
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="edit" className="flex-1">
                    Edit
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="preview">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {previews.map((preview, index) => (
                      <div
                        key={index}
                        className={`relative group cursor-pointer ${selectedImageIndex === index ? "ring-2 ring-blue-500" : ""}`}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <img
                          src={editedPreviews[index] && editedPreviews[index] !== "" ? editedPreviews[index] : preview}
                          alt={`Preview ${index + 1}`}
                          className="h-40 w-full object-cover rounded-md"
                        />
                        {editedPreviews[index] && editedPreviews[index] !== "" && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            Enhanced
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveFile(index)
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <div
                      className="h-40 border-2 border-dashed border-slate-300 rounded-md flex items-center justify-center cursor-pointer hover:border-slate-400 transition-colors"
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      <ImagePlus className="h-8 w-8 text-slate-400" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="edit">
                  {selectedImageIndex !== null ? (
                    <ImageEditor imageUrl={previews[selectedImageIndex]} onImageUpdated={handleImageUpdated} />
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <p>Select an image to edit</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            className="mr-4"
            onClick={() => document.getElementById("file-upload")?.click()}
            disabled={isUploading}
          >
            Browse Files
          </Button>
          <Button
            type="submit"
            disabled={files.length === 0 || isUploading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Analyze Product
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  )
}

