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

import { useMemo } from 'react'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'

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
  const { isMobile, isLowPowerDevice } = useDeviceDetection()
  
  // Performance-based adjustments
  const animationDuration = useMemo(() => {
    const baseSpeed = isLowPowerDevice ? 30 : isMobile ? 25 : 20
    return `${baseSpeed / speed}s`
  }, [isMobile, isLowPowerDevice, speed])

  const intensityValue = useMemo(() => {
    if (isLowPowerDevice) return intensity === 'high' ? 0.6 : 0.4
    return intensity === 'low' ? 0.4 : intensity === 'high' ? 0.8 : 0.6
  }, [intensity, isLowPowerDevice])

  const opacityValue = useMemo(() => {
    if (isLowPowerDevice) return opacity * 0.7
    return opacity
  }, [opacity, isLowPowerDevice])

  const gradientStyle = useMemo(() => ({
    background: `
      radial-gradient(circle at 20% 30%, rgba(138, 43, 133, ${intensityValue * 0.3}) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(169, 76, 157, ${intensityValue * 0.25}) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(138, 43, 133, ${intensityValue * 0.2}) 0%, transparent 50%),
      radial-gradient(circle at 90% 20%, rgba(169, 76, 157, ${intensityValue * 0.15}) 0%, transparent 50%),
      linear-gradient(135deg, #141414 0%, #1a1a1a 50%, #141414 100%)
    `,
    backgroundSize: '400% 400%, 300% 300%, 500% 500%, 350% 350%, 100% 100%',
    opacity: opacityValue,
    animation: `
      gradientFlow ${animationDuration} ease-in-out infinite,
      gradientPulse ${parseFloat(animationDuration) * 1.5}s ease-in-out infinite alternate
    `,
    willChange: 'background-position, opacity'
  }), [animationDuration, intensityValue, opacityValue])

  return (
    <div 
      className={`fixed inset-0 -z-10 ${className}`}
      style={gradientStyle}
    />
  )
} 