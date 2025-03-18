"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, Download, Edit2, Check, X, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import type { ProductAnalysis, SimilarProduct } from "@/lib/types"
import { saveProductListing } from "@/lib/actions"

export default function ProductResults({ productData }: { productData: ProductAnalysis }) {
  const [title, setTitle] = useState(productData.title)
  const [description, setDescription] = useState(productData.description)
  const [price, setPrice] = useState(productData.suggestedPrice.toString())
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingDescription, setEditingDescription] = useState(false)
  const [editingPrice, setEditingPrice] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveProductListing({
        id: productData.id,
        title,
        description,
        price: Number.parseFloat(price),
        imageUrl: productData.imageUrl,
        category: productData.category,
      })

      toast({
        title: "Product saved",
        description: "Your product listing has been saved successfully.",
      })
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Save failed",
        description: "There was an error saving your product listing.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = () => {
    // In a real app, this would generate a file for export to marketplaces
    const exportData = {
      title,
      description,
      price: Number.parseFloat(price),
      imageUrl: productData.imageUrl,
      category: productData.category,
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `product-listing-${productData.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Export complete",
      description: "Your product listing has been exported as JSON.",
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <Card className="p-6 lg:col-span-2 bg-white dark:bg-slate-800 shadow-md">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Product Information</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleExport} className="text-slate-600 dark:text-slate-400">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Listing
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
              {editingTitle ? (
                <div className="flex items-center">
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} className="flex-grow" />
                  <Button variant="ghost" size="icon" onClick={() => setEditingTitle(false)} className="ml-2">
                    <Check className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setTitle(productData.title)
                      setEditingTitle(false)
                    }}
                    className="ml-1"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
                  <p className="text-slate-800 dark:text-slate-200">{title}</p>
                  <Button variant="ghost" size="icon" onClick={() => setEditingTitle(true)}>
                    <Edit2 className="h-4 w-4 text-slate-500" />
                  </Button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              {editingDescription ? (
                <div className="flex flex-col">
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className="mb-2"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingDescription(false)}>
                      <Check className="h-4 w-4 mr-1 text-green-500" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDescription(productData.description)
                        setEditingDescription(false)
                      }}
                    >
                      <X className="h-4 w-4 mr-1 text-red-500" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
                  <p className="text-slate-800 dark:text-slate-200 whitespace-pre-line">{description}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingDescription(true)}
                    className="ml-2 flex-shrink-0"
                  >
                    <Edit2 className="h-4 w-4 text-slate-500" />
                  </Button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Suggested Price
              </label>
              {editingPrice ? (
                <div className="flex items-center">
                  <div className="relative flex-grow">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                    <Input
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="pl-8"
                      type="number"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setEditingPrice(false)} className="ml-2">
                    <Check className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setPrice(productData.suggestedPrice.toString())
                      setEditingPrice(false)
                    }}
                    className="ml-1"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
                  <p className="text-slate-800 dark:text-slate-200">${Number.parseFloat(price).toFixed(2)}</p>
                  <Button variant="ghost" size="icon" onClick={() => setEditingPrice(true)}>
                    <Edit2 className="h-4 w-4 text-slate-500" />
                  </Button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
                <p className="text-slate-800 dark:text-slate-200">{productData.category}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="p-6 bg-white dark:bg-slate-800 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Product Image</h2>
          <div className="aspect-square relative rounded-md overflow-hidden mb-4">
            <img
              src={productData.imageUrl || "/placeholder.svg"}
              alt="Product"
              className="object-cover w-full h-full"
            />
            {productData.imageUrl.includes("enhanced=true") && (
              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Enhanced
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-slate-800 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Similar Products</h2>
          <Tabs defaultValue="marketplace">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="marketplace" className="flex-1">
                Marketplace
              </TabsTrigger>
              <TabsTrigger value="competitors" className="flex-1">
                Competitors
              </TabsTrigger>
            </TabsList>

            <TabsContent value="marketplace" className="space-y-4">
              {productData.similarProducts.slice(0, 3).map((product, index) => (
                <SimilarProductCard key={index} product={product} />
              ))}
            </TabsContent>

            <TabsContent value="competitors" className="space-y-4">
              {productData.competitorProducts.slice(0, 3).map((product, index) => (
                <SimilarProductCard key={index} product={product} />
              ))}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

function SimilarProductCard({ product }: { product: SimilarProduct }) {
  return (
    <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
      <div className="w-16 h-16 flex-shrink-0">
        <img
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.title}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="text-sm font-medium text-slate-900 dark:text-white truncate">{product.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">${product.price.toFixed(2)}</p>
      </div>
      <Button variant="ghost" size="icon" className="flex-shrink-0">
        <ShoppingCart className="h-4 w-4 text-slate-500" />
      </Button>
    </div>
  )
}

