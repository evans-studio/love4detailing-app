/**
 * Premium Animated Background Canvas
 * 
 * High-quality fluid gradient background with brand-compliant colors and elegant motion.
 * Features:
 * - Crisp, high-resolution gradients with minimal blur
 * - Brand colors: #141414 (base), #9747FF (primary), #B558AA (secondary glow)
 * - Smooth, elegant motion inspired by Unicorn Studio
 * - Optimized performance for all devices
 * - Directional lighting and depth
 * - Accessibility support (respects reduced motion preferences)
 * 
 * Props:
 * - intensity: 'low' | 'medium' | 'high' - Animation intensity
 * - speed: number - Animation speed multiplier
 * - opacity: number - Overall opacity (0-1)
 */
"use client"

import { useState, useEffect, useRef } from 'react'

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
  opacity = 0.9
}: BackgroundCanvasProps) {
  const [mounted, setMounted] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    setIsMobile(window.innerWidth < 768)

    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    const handleResize = () => setIsMobile(window.innerWidth < 768)

    mediaQuery.addEventListener('change', handleMotionChange)
    window.addEventListener('resize', handleResize)

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Intensity-based configuration
  const intensityConfig = {
    low: { multiplier: 0.7, duration: 1.5 },
    medium: { multiplier: 0.85, duration: 1.2 },
    high: { multiplier: 1, duration: 1 }
  }[intensity]

  const intensityMultiplier = intensityConfig.multiplier
  const baseAnimationDuration = 20 * intensityConfig.duration / speed
  const pulseAnimationDuration = 8 * intensityConfig.duration / speed
  const shiftAnimationDuration = 30 * intensityConfig.duration / speed

  const finalOpacity = opacity * intensityMultiplier * (isMobile ? 0.8 : 1)

  // Premium gradient configuration with brand colors
  const gradientStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -10,
    background: `
      radial-gradient(ellipse 800px 600px at 25% 20%, rgba(151, 71, 255, ${isMobile ? '0.08' : '0.12'}) 0%, transparent 60%),
      radial-gradient(ellipse 1000px 800px at 75% 80%, rgba(181, 88, 170, ${isMobile ? '0.05' : '0.08'}) 0%, transparent 65%),
      radial-gradient(ellipse 600px 900px at 90% 30%, rgba(151, 71, 255, ${isMobile ? '0.04' : '0.06'}) 0%, transparent 55%),
      radial-gradient(ellipse 900px 700px at 10% 70%, rgba(181, 88, 170, ${isMobile ? '0.03' : '0.05'}) 0%, transparent 60%),
      radial-gradient(ellipse 1200px 500px at 50% 50%, rgba(151, 71, 255, ${isMobile ? '0.02' : '0.04'}) 0%, transparent 70%),
      linear-gradient(135deg, #141414 0%, #1A1A1A 25%, #141414 50%, #1C1C1C 75%, #141414 100%),
      linear-gradient(45deg, rgba(151, 71, 255, 0.02) 0%, transparent 30%, rgba(181, 88, 170, 0.01) 70%, transparent 100%)
    `,
    backgroundSize: isMobile 
      ? '100% 100%, 110% 110%, 90% 120%, 100% 100%, 150% 80%, 100% 100%, 100% 100%'
      : '120% 120%, 140% 140%, 110% 160%, 130% 120%, 200% 100%, 100% 100%, 100% 100%',
    opacity: finalOpacity,
    animation: mounted && !prefersReducedMotion ? `
      premiumGradientFlow ${baseAnimationDuration}s ease-in-out infinite,
      premiumGradientPulse ${pulseAnimationDuration}s ease-in-out infinite alternate,
      premiumGradientShift ${shiftAnimationDuration}s linear infinite
    ` : 'none',
    // Only apply will-change when animation is active
    willChange: mounted && !prefersReducedMotion ? 'opacity' : 'auto',
    // Use transform3d for hardware acceleration without will-change
    transform: 'translate3d(0, 0, 0)',
  }

  return (
    <div 
      className={`fixed inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <div style={gradientStyle} />
    </div>
  )
} 