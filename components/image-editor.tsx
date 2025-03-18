"use client"

import { useState } from "react"
import { Loader2, Wand2, Check, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { enhanceProductImage } from "@/lib/actions"

interface ImageEditorProps {
  imageUrl: string
  onImageUpdated: (newImageUrl: string) => void
}

export default function ImageEditor({ imageUrl, onImageUpdated }: ImageEditorProps) {
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string | null>(null)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [isCustomEditing, setIsCustomEditing] = useState(false)

  const handleAutoEnhance = async () => {
    setIsEnhancing(true)
    try {
      const result = await enhanceProductImage(imageUrl, {
        autoEnhance: true,
        autoCrop: true,
        brightness: 0,
        contrast: 0,
        saturation: 0,
      })
      setEnhancedImageUrl(result.enhancedImageUrl)
    } catch (error) {
      console.error("Error enhancing image:", error)
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleCustomEnhance = async () => {
    setIsEnhancing(true)
    try {
      const result = await enhanceProductImage(imageUrl, {
        autoEnhance: false,
        autoCrop: true,
        brightness: brightness - 100, // Convert to -100 to 100 range
        contrast: contrast - 100, // Convert to -100 to 100 range
        saturation: saturation - 100, // Convert to -100 to 100 range
      })
      setEnhancedImageUrl(result.enhancedImageUrl)
    } catch (error) {
      console.error("Error enhancing image:", error)
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleApplyChanges = () => {
    if (enhancedImageUrl) {
      onImageUpdated(enhancedImageUrl)
    }
  }

  const handleReset = () => {
    setEnhancedImageUrl(null)
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    setIsCustomEditing(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Image Editor</h3>
        {enhancedImageUrl && (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button size="sm" onClick={handleApplyChanges} className="bg-green-600 hover:bg-green-700 text-white">
              <Check className="h-4 w-4 mr-2" />
              Apply
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">Original</p>
          <div className="aspect-square relative rounded-md overflow-hidden border border-slate-200 dark:border-slate-700">
            <img src={imageUrl || "/placeholder.svg"} alt="Original" className="object-cover w-full h-full" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">Enhanced</p>
          <div className="aspect-square relative rounded-md overflow-hidden border border-slate-200 dark:border-slate-700">
            {isEnhancing ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
              </div>
            ) : enhancedImageUrl ? (
              <img src={enhancedImageUrl || "/placeholder.svg"} alt="Enhanced" className="object-cover w-full h-full" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500">
                <Wand2 className="h-8 w-8 mb-2" />
                <p className="text-sm">Enhance your image</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="auto" onValueChange={(value) => setIsCustomEditing(value === "custom")}>
        <TabsList className="w-full">
          <TabsTrigger value="auto" className="flex-1">
            Auto Enhance
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex-1">
            Custom Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="auto" className="pt-4">
          <Button onClick={handleAutoEnhance} disabled={isEnhancing} className="w-full">
            {isEnhancing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enhancing...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Auto Enhance
              </>
            )}
          </Button>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Automatically enhances your product image with professional settings optimized for marketplace listings.
          </p>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Brightness</label>
              <span className="text-sm text-slate-500">{brightness}%</span>
            </div>
            <Slider
              value={[brightness]}
              min={0}
              max={200}
              step={1}
              onValueChange={(value) => setBrightness(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Contrast</label>
              <span className="text-sm text-slate-500">{contrast}%</span>
            </div>
            <Slider value={[contrast]} min={0} max={200} step={1} onValueChange={(value) => setContrast(value[0])} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Saturation</label>
              <span className="text-sm text-slate-500">{saturation}%</span>
            </div>
            <Slider
              value={[saturation]}
              min={0}
              max={200}
              step={1}
              onValueChange={(value) => setSaturation(value[0])}
            />
          </div>

          <Button onClick={handleCustomEnhance} disabled={isEnhancing} className="w-full">
            {isEnhancing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Applying...
              </>
            ) : (
              "Apply Custom Settings"
            )}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}

