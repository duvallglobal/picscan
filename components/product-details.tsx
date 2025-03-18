"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Edit2, Save, Download, ShoppingBag, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import EnhancedImageEditor from "./enhanced-image-editor"
import { ECOMMERCE_PLATFORMS } from "@/lib/api-clients"

interface ProductDetailsProps {
  productData: {
    id: string
    title: string
    description: string
    price: number
    images: string[]
    category: string
    features: string[]
    specifications: Record<string, string>
  }
  onSave: (data: any) => Promise<void>
}

export default function ProductDetails({ productData, onSave }: ProductDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState(productData)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

  const handleImageNext = () => {
    setCurrentImageIndex((prev) => (prev === productData.images.length - 1 ? 0 : prev + 1))
  }

  const handleImagePrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? productData.images.length - 1 : prev - 1))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(editedData)
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving product:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpdate = (index: number, newUrl: string) => {
    const newImages = [...editedData.images]
    newImages[index] = newUrl
    setEditedData((prev) => ({ ...prev, images: newImages }))
  }

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) => (prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={productData.images[currentImageIndex]}
                alt={`Product image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>

            <button
              onClick={handleImagePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleImageNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {isEditing && (
              <Dialog>
                <DialogTrigger asChild>
                  <button className="absolute bottom-2 right-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
                    <Edit2 className="w-5 h-5" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-full">
                  <EnhancedImageEditor
                    imageUrl={productData.images[currentImageIndex]}
                    onSave={(url) => handleImageUpdate(currentImageIndex, url)}
                    onClose={() => {}}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="grid grid-cols-6 gap-2">
            {productData.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`aspect-square rounded-md overflow-hidden border-2 ${
                  index === currentImageIndex ? "border-blue-500" : "border-transparent"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1 flex-1">
              {isEditing ? (
                <Input
                  value={editedData.title}
                  onChange={(e) => setEditedData((prev) => ({ ...prev, title: e.target.value }))}
                  className="text-2xl font-bold"
                />
              ) : (
                <h1 className="text-2xl font-bold">{productData.title}</h1>
              )}
              <p className="text-slate-500">{productData.category}</p>
            </div>

            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {isSaving ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price</label>
                {isEditing ? (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                    <Input
                      type="number"
                      value={editedData.price}
                      onChange={(e) =>
                        setEditedData((prev) => ({
                          ...prev,
                          price: Number(e.target.value),
                        }))
                      }
                      className="pl-8"
                      step="0.01"
                    />
                  </div>
                ) : (
                  <p className="text-2xl font-bold">${productData.price.toFixed(2)}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                {isEditing ? (
                  <Textarea
                    value={editedData.description}
                    onChange={(e) =>
                      setEditedData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={6}
                  />
                ) : (
                  <p className="text-slate-600 whitespace-pre-line">{productData.description}</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              {isEditing ? (
                <div className="space-y-2">
                  {editedData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...editedData.features]
                          newFeatures[index] = e.target.value
                          setEditedData((prev) => ({
                            ...prev,
                            features: newFeatures,
                          }))
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditedData((prev) => ({
                            ...prev,
                            features: prev.features.filter((_, i) => i !== index),
                          }))
                        }}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditedData((prev) => ({
                        ...prev,
                        features: [...prev.features, ""],
                      }))
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              ) : (
                <ul className="list-disc list-inside space-y-2">
                  {productData.features.map((feature, index) => (
                    <li key={index} className="text-slate-600">
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="specs" className="space-y-4">
              {isEditing ? (
                <div className="space-y-2">
                  {Object.entries(editedData.specifications).map(([key, value], index) => (
                    <div key={index} className="grid grid-cols-2 gap-2">
                      <Input
                        value={key}
                        onChange={(e) => {
                          const newSpecs = { ...editedData.specifications }
                          delete newSpecs[key]
                          newSpecs[e.target.value] = value
                          setEditedData((prev) => ({
                            ...prev,
                            specifications: newSpecs,
                          }))
                        }}
                        placeholder="Specification name"
                      />
                      <div className="flex items-center space-x-2">
                        <Input
                          value={value}
                          onChange={(e) => {
                            setEditedData((prev) => ({
                              ...prev,
                              specifications: {
                                ...prev.specifications,
                                [key]: e.target.value,
                              },
                            }))
                          }}
                          placeholder="Value"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newSpecs = { ...editedData.specifications }
                            delete newSpecs[key]
                            setEditedData((prev) => ({
                              ...prev,
                              specifications: newSpecs,
                            }))
                          }}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditedData((prev) => ({
                        ...prev,
                        specifications: {
                          ...prev.specifications,
                          "": "",
                        },
                      }))
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Specification
                  </Button>
                </div>
              ) : (
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {Object.entries(productData.specifications).map(([key, value], index) => (
                    <div key={index} className="col-span-2 grid grid-cols-2">
                      <dt className="text-slate-600 font-medium">{key}</dt>
                      <dd className="text-slate-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </TabsContent>
          </Tabs>

          {/* E-commerce Platform Integration */}
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Export to Marketplace</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ECOMMERCE_PLATFORMS.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => togglePlatform(platform.name)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedPlatforms.includes(platform.name)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <img src={platform.icon || "/placeholder.svg"} alt={platform.name} className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm text-center font-medium">{platform.name}</p>
                </button>
              ))}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" disabled={selectedPlatforms.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" disabled={selectedPlatforms.length === 0}>
                <ShoppingBag className="w-4 h-4 mr-2" />
                List on Selected
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

