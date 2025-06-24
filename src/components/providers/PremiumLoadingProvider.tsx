'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import PremiumLoadingScreen from '../ui/PremiumLoadingScreen'

interface PremiumLoadingContextType {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  showLoading: () => void
  hideLoading: () => void
}

const PremiumLoadingContext = createContext<PremiumLoadingContextType | undefined>(undefined)

export function usePremiumLoadingContext() {
  const context = useContext(PremiumLoadingContext)
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
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Show loading screen immediately on mount, then start timer
    const timer = setTimeout(() => {
      setIsLoading(true)
      setIsVisible(true)
    }, initialDelay)

    return () => clearTimeout(timer)
  }, [initialDelay])

  const showLoading = () => {
    setIsLoading(true)
    setIsVisible(true)
  }

  const hideLoading = () => {
    setIsLoading(false)
    // Keep visible for smoother exit animation
    setTimeout(() => setIsVisible(false), 1000)
  }

  const handleLoadingComplete = () => {
    setIsLoading(false)
    setTimeout(() => setIsVisible(false), 1000)
  }

  const contextValue: PremiumLoadingContextType = {
    isLoading,
    setIsLoading,
    showLoading,
    hideLoading
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