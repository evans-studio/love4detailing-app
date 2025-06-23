'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground">
          <div className="w-full max-w-md space-y-8 text-center">
            <div className="space-y-4">
              <AlertTriangle className="w-16 h-16 text-destructive mx-auto" />
              <h1 className="text-2xl font-bold">Application Error</h1>
              <p className="text-muted-foreground">
                A critical error occurred. Please refresh the page to continue.
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground font-mono">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
            
            <div className="flex flex-col gap-4 justify-center">
              <Button
                onClick={reset}
                className="flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
} 