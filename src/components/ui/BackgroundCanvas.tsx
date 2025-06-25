/**
 * Animated Background Canvas
 * 
 * Modern fluid gradient background with brand-compliant colors.
 * Features:
 * - Smooth CSS gradient animations with brand colors
 * - Performance optimizations for mobile and low-power devices
 * - Brand colors: #141414 (base), #8A2B85 (primary), #A94C9D (secondary)
 * 
 * Props:
 * - intensity: 'low' | 'medium' | 'high' - Animation intensity
 * - speed: number - Animation speed multiplier
 * - opacity: number - Overall opacity (0-1)
 */
"use client"

import { useState, useEffect } from 'react'

interface BackgroundCanvasProps {
  className?: string
  intensity?: 'low' | 'medium' | 'high'
  speed?: number
  opacity?: number
}

export default function BackgroundCanvas({ 
  className = '',
  intensity = 'medium',
  speed = 1,
  opacity = 0.8
}: BackgroundCanvasProps) {
  // Use state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isLowPowerDevice, setIsLowPowerDevice] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Device detection after mount to prevent hydration issues
    const checkDevice = () => {
      const mobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const lowPower = mobile && (
        navigator.hardwareConcurrency <= 2 || 
        (navigator as any).deviceMemory <= 2 ||
        window.innerWidth < 480
      )
      
      setIsMobile(mobile)
      setIsLowPowerDevice(lowPower)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // Default values for SSR
  const animationDuration = mounted 
    ? `${(isLowPowerDevice ? 30 : isMobile ? 25 : 20) / speed}s`
    : '20s'

  const intensityValue = mounted
    ? (isLowPowerDevice ? (intensity === 'high' ? 0.6 : 0.4) : (intensity === 'low' ? 0.4 : intensity === 'high' ? 0.8 : 0.6))
    : 0.6

  const opacityValue = mounted
    ? (isLowPowerDevice ? opacity * 0.7 : opacity)
    : opacity

  // Always render with fallback styles to prevent black background
  const gradientStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -10,
    background: `
      radial-gradient(circle at 20% 30%, rgba(138, 43, 133, 0.6) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(169, 76, 157, 0.5) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(138, 43, 133, 0.4) 0%, transparent 50%),
      radial-gradient(circle at 90% 20%, rgba(169, 76, 157, 0.35) 0%, transparent 50%),
      radial-gradient(circle at 60% 50%, rgba(138, 43, 133, 0.3) 0%, transparent 60%),
      linear-gradient(135deg, #141414 0%, #1c1c1c 25%, #141414 50%, #1c1c1c 75%, #141414 100%)
    `,
    backgroundSize: '300% 300%, 250% 250%, 400% 400%, 280% 280%, 350% 350%, 100% 100%',
    opacity: opacityValue,
    animation: mounted ? `gradientFlow ${animationDuration} ease-in-out infinite` : 'none',
    willChange: mounted ? 'background-position' : 'auto'
  }

  return (
    <div 
      className={className}
      style={gradientStyle}
      suppressHydrationWarning
    />
  )
} 