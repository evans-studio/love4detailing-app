// Global error boundary must be Client Component to use hooks (useEffect) and handle runtime errors
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

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
        <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#141414]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md space-y-6 sm:space-y-8 text-center"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <AlertTriangle className="w-12 h-12 sm:w-16 sm:h-16 text-[#8A2B85] mx-auto" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-xl sm:text-2xl font-bold text-[#F8F4EB]"
              >
                Application Error
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-sm sm:text-base text-[#C7C7C7]"
              >
                A critical error occurred. Please refresh the page to continue.
              </motion.p>
              {error.digest && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-xs font-mono text-[#C7C7C7]/60"
                >
                  Error ID: {error.digest}
                </motion.p>
              )}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col gap-4 justify-center"
            >
              <Button
                onClick={reset}
                className={cn(
                  "flex items-center gap-2 mx-auto",
                  "bg-[#8A2B85] hover:bg-[#8A2B85]/90",
                  "text-[#F8F4EB]",
                  "touch-target min-h-[44px]"
                )}
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </body>
    </html>
  )
} 