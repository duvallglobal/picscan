"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error boundary caught error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <h2 className="text-2xl font-bold mb-4 text-red-600">Something went wrong</h2>
      <p className="mb-6 text-slate-600 max-w-md">
        We encountered an error while processing your request. Please try again or contact support if the problem
        persists.
      </p>
      <Button onClick={reset} className="bg-blue-600 hover:bg-blue-700 text-white">
        Try again
      </Button>
    </div>
  )
}

