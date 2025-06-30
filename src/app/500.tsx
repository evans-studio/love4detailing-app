'use client'

import Link from 'next/link'
import { AlertTriangle, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Error500() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6 sm:space-y-8 text-center">
        <div className="space-y-4">
          <div>
            <AlertTriangle className="w-12 h-12 sm:w-16 sm:h-16 text-[#9747FF] mx-auto" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F8F4EB]">
            Server Error
          </h1>
          <p className="text-sm sm:text-base text-[#C7C7C7]">
            Sorry, something went wrong on our end. Please try again later.
          </p>
        </div>
        
        <div className="flex justify-center">
          <Link
            href="/"
            className={cn(
              "inline-flex items-center justify-center gap-2",
              "bg-[#9747FF] hover:bg-[#9747FF]/90",
              "text-[#F8F4EB]",
              "touch-target min-h-[44px] px-4 py-2 rounded-md",
              "transition-colors duration-200"
            )}
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
} 