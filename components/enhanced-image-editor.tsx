"use client"

import { useState, useCallback } from "react"
import { Loader2, Wand2, Crop, Sun, Contrast, Droplet, Undo, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { enhancePhoto, type PhotoEnhancementOptions } from "@/lib/api-clients"

interface EnhancedImageEditorProps {
  imageUrl: string
  onSave: (enhancedUrl: string) => void
  onClose: () => void
}

export default function EnhancedImageEditor({ imageUrl, onSave, onClose }: EnhancedImageEditorProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentImage, setCurrentImage] = useState(imageUrl)
  const [editHistory, setEditHistory] = useState<string[]>([imageUrl])
  const [settings, setSettings] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
  })

  const applyEnhancement = useCallback(
    async (options: PhotoEnhancementOptions) => {
      setIsProcessing(true)
      try {
        const result = await enhancePhoto(currentImage, options)
        setCurrentImage(result.url)
        setEditHistory((prev) => [...prev, result.url])
      } catch (error) {
        console.error("Error enhancing image:", error)
      } finally {
        setIsProcessing(false)
      }
    },
    [currentImage],
  )

  const handleAutoEnhance = () => {
    applyEnhancement({ autoEnhance: true, autoCrop: true })
  }

  const handleUndo = () => {
    if (editHistory.length > 1) {
      const newHistory = [...editHistory]
      newHistory.pop()
      setEditHistory(newHistory)
      setCurrentImage(newHistory[newHistory.length - 1])
    }
  }

  const handleSave = () => {
    onSave(currentImage)
    onClose()
  }

  return (
    <Card className="p-6 bg-white dark:bg-slate-800 shadow-lg max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="aspect-square relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
            <img src={currentImage || "/placeholder.svg"} alt="Current edit" className="w-full h-full object-cover" />
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleUndo} disabled={editHistory.length <= 1 || isProcessing}>
              <Undo className="w-4 h-4 mr-2" />
              Undo
            </Button>
            <Button onClick={handleSave} disabled={isProcessing} className="bg-green-600 hover:bg-green-700 text-white">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="auto" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="auto">Auto Enhance</TabsTrigger>
              <TabsTrigger value="manual">Manual Adjust</TabsTrigger>
            </TabsList>

            <TabsContent value="auto" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={handleAutoEnhance} disabled={isProcessing} className="w-full">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Auto Enhance
                </Button>
                <Button onClick={() => applyEnhancement({ autoCrop: true })} disabled={isProcessing} className="w-full">
                  <Crop className="w-4 h-4 mr-2" />
                  Auto Crop
                </Button>
              </div>

              <Button
                onClick={() => applyEnhancement({ removeBackground: true })}
                disabled={isProcessing}
                className="w-full"
              >
                Remove Background
              </Button>
            </TabsContent>

            <TabsContent value="manual" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium flex items-center">
                      <Sun className="w-4 h-4 mr-2" />
                      Brightness
                    </label>
                    <span className="text-sm text-slate-500">{settings.brightness}</span>
                  </div>
                  <Slider
                    value={[settings.brightness]}
                    min={-100}
                    max={100}
                    step={1}
                    onValueChange={([value]) => {
                      setSettings((prev) => ({ ...prev, brightness: value }))
                    }}
                    onValueCommit={() => {
                      applyEnhancement({ brightness: settings.brightness })
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium flex items-center">
                      <Contrast className="w-4 h-4 mr-2" />
                      Contrast
                    </label>
                    <span className="text-sm text-slate-500">{settings.contrast}</span>
                  </div>
                  <Slider
                    value={[settings.contrast]}
                    min={-100}
                    max={100}
                    step={1}
                    onValueChange={([value]) => {
                      setSettings((prev) => ({ ...prev, contrast: value }))
                    }}
                    onValueCommit={() => {
                      applyEnhancement({ contrast: settings.contrast })
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium flex items-center">
                      <Droplet className="w-4 h-4 mr-2" />
                      Saturation
                    </label>
                    <span className="text-sm text-slate-500">{settings.saturation}</span>
                  </div>
                  <Slider
                    value={[settings.saturation]}
                    min={-100}
                    max={100}
                    step={1}
                    onValueChange={([value]) => {
                      setSettings((prev) => ({ ...prev, saturation: value }))
                    }}
                    onValueCommit={() => {
                      applyEnhancement({ saturation: settings.saturation })
                    }}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Card>
  )
}

