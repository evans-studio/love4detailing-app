"use client"

import { useEffect } from 'react'
import { initSectionTransitions } from '@/lib/animations'

interface GSAPProviderProps {
  children: React.ReactNode
}

export default function GSAPProvider({ children }: GSAPProviderProps) {
  useEffect(() => {
    // Wait for DOM to be fully ready before initializing GSAP
    const initializeGSAP = () => {
      // Small delay to ensure all components are mounted
      setTimeout(() => {
        try {
          const sectionTransitions = initSectionTransitions()
        } catch (error) {
          console.warn('GSAP initialization delayed, retrying...', error)
          // Retry after a longer delay if elements aren't ready
          setTimeout(() => {
            try {
              initSectionTransitions()
            } catch (retryError) {
              console.warn('GSAP initialization failed on retry:', retryError)
            }
          }, 1000)
        }
      }, 100)
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeGSAP)
    } else {
      initializeGSAP()
    }

    // Cleanup
    return () => {
      document.removeEventListener('DOMContentLoaded', initializeGSAP)
    }
  }, [])

  return <>{children}</>
} 