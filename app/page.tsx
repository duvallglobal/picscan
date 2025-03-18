import { Suspense } from "react"
import UploadForm from "@/components/upload-form"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-2 text-slate-900 dark:text-white">
          Product Listing Accelerator
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
          Upload product photos and let AI generate descriptions, titles, and pricing suggestions to speed up your
          marketplace listings.
        </p>

        <Suspense fallback={<div className="text-center">Loading upload form...</div>}>
          <UploadForm />
        </Suspense>
      </div>
      <Toaster />
    </main>
  )
}

