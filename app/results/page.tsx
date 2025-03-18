import { Suspense } from "react"
import { notFound } from "next/navigation"
import ProductResults from "@/components/product-results"
import { getProductAnalysis } from "@/lib/actions"

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: { id?: string }
}) {
  const id = searchParams.id

  if (!id) {
    notFound()
  }

  let productData
  try {
    productData = await getProductAnalysis(id)
  } catch (error) {
    console.error("Error fetching product analysis:", error)
    // Redirect to error page or handle gracefully
    notFound()
  }

  if (!productData) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-2 text-slate-900 dark:text-white">Product Analysis Results</h1>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
          Review and edit the AI-generated product information before saving or exporting.
        </p>

        <Suspense fallback={<div className="text-center">Loading product analysis...</div>}>
          <ProductResults productData={productData} />
        </Suspense>
      </div>
    </main>
  )
}

