'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import PremiumLoadingScreen from '../ui/PremiumLoadingScreen'

interface PremiumLoadingContextType {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  showLoading: () => void
  hideLoading: () => void
}

const PremiumLoadingContext = React.createContext<PremiumLoadingContextType | undefined>(undefined)

export function usePremiumLoadingContext() {
  const context = React.useContext(PremiumLoadingContext)
  if (context === undefined) {
    throw new Error('usePremiumLoadingContext must be used within a PremiumLoadingProvider')
  }
  return context
}

interface PremiumLoadingProviderProps {
  children: React.ReactNode
  initialDelay?: number
  duration?: number
}

export default function PremiumLoadingProvider({ 
  children, 
  initialDelay = 0,
  duration = 3000 
}: PremiumLoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Show loading screen after initial delay
    const timer = setTimeout(() => {
      setIsLoading(true)
      setIsVisible(true)
    }, initialDelay)

    return () => {
      clearTimeout(timer)
    }
  }, [initialDelay])

  const showLoading = React.useCallback(() => {
    setIsLoading(true)
    setIsVisible(true)
  }, [])

  const hideLoading = React.useCallback(() => {
    setIsLoading(false)
    // Keep visible for smoother exit animation
    setTimeout(() => setIsVisible(false), 1000)
  }, [])

  const handleLoadingComplete = React.useCallback(() => {
    setIsLoading(false)
    setTimeout(() => setIsVisible(false), 1000)
  }, [])

  const contextValue = React.useMemo(() => ({
    isLoading,
    setIsLoading,
    showLoading,
    hideLoading
  }), [isLoading, showLoading, hideLoading])

  // Don't render anything during SSR
  if (!isMounted) {
    return null
  }

  return (
    <PremiumLoadingContext.Provider value={contextValue}>
      {/* Hide children completely when loading */}
      <div style={{ display: isLoading ? 'none' : 'block' }}>
        {children}
      </div>
      {isVisible && (
        <PremiumLoadingScreen
          isVisible={isLoading}
          onComplete={handleLoadingComplete}
          duration={duration}
        />
      )}
    </PremiumLoadingContext.Provider>
  )
} 