/**
 * Premium Animated Background Canvas
 * 
 * High-quality fluid gradient background with brand-compliant colors and elegant motion.
 * Features:
 * - Crisp, high-resolution gradients with minimal blur
 * - Brand colors: #141414 (base), #8A2B85 (primary), #B558AA (secondary glow)
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
  const [isMobile, setIsMobile] = useState(false)
  const [isHighDPI, setIsHighDPI] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    
    // Enhanced device detection for optimal rendering
    const checkDevice = () => {
      const mobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const highDPI = window.devicePixelRatio > 1
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      
      setIsMobile(mobile)
      setIsHighDPI(highDPI)
      setPrefersReducedMotion(reducedMotion)
    }

    checkDevice()
    
    // Listen for changes in reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleMotionChange)
    
    window.addEventListener('resize', checkDevice)
    return () => {
      window.removeEventListener('resize', checkDevice)
      mediaQuery.removeEventListener('change', handleMotionChange)
    }
  }, [])

  // Premium animation durations - slower, more elegant
  const baseAnimationDuration = mounted 
    ? (prefersReducedMotion ? 120 : isMobile ? 45 : 35) / speed
    : 35

  const pulseAnimationDuration = mounted
    ? (prefersReducedMotion ? 60 : isMobile ? 25 : 20) / speed
    : 20

  const shiftAnimationDuration = mounted
    ? (prefersReducedMotion ? 180 : isMobile ? 60 : 50) / speed
    : 50

  // Intensity-based opacity adjustments
  const intensityMultiplier = intensity === 'low' ? 0.7 : intensity === 'high' ? 1.1 : 1
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
      radial-gradient(ellipse 800px 600px at 25% 20%, rgba(138, 43, 133, ${isMobile ? '0.08' : '0.12'}) 0%, transparent 60%),
      radial-gradient(ellipse 1000px 800px at 75% 80%, rgba(181, 88, 170, ${isMobile ? '0.05' : '0.08'}) 0%, transparent 65%),
      radial-gradient(ellipse 600px 900px at 90% 30%, rgba(138, 43, 133, ${isMobile ? '0.04' : '0.06'}) 0%, transparent 55%),
      radial-gradient(ellipse 900px 700px at 10% 70%, rgba(181, 88, 170, ${isMobile ? '0.03' : '0.05'}) 0%, transparent 60%),
      radial-gradient(ellipse 1200px 500px at 50% 50%, rgba(138, 43, 133, ${isMobile ? '0.02' : '0.04'}) 0%, transparent 70%),
      linear-gradient(135deg, #141414 0%, #1A1A1A 25%, #141414 50%, #1C1C1C 75%, #141414 100%),
      linear-gradient(45deg, rgba(138, 43, 133, 0.02) 0%, transparent 30%, rgba(181, 88, 170, 0.01) 70%, transparent 100%)
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
    willChange: mounted && !prefersReducedMotion ? 'background-position, opacity' : 'auto',
    transform: 'translate3d(0, 0, 0)', // GPU acceleration
    backfaceVisibility: 'hidden' as const,
    perspective: 1000,
  }

  // Ambient light overlay for depth
  const ambientLightStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -9,
    background: `
      radial-gradient(circle 400px at 20% 30%, rgba(181, 88, 170, ${isMobile ? '0.02' : '0.03'}) 0%, transparent 50%),
      radial-gradient(circle 600px at 80% 70%, rgba(138, 43, 133, ${isMobile ? '0.015' : '0.02'}) 0%, transparent 50%),
      linear-gradient(180deg, rgba(138, 43, 133, 0.01) 0%, transparent 40%, rgba(181, 88, 170, 0.005) 100%)
    `,
    backgroundSize: isMobile ? '60% 60%, 70% 70%, 100% 100%' : '80% 80%, 90% 90%, 100% 100%',
    opacity: finalOpacity * 0.6,
    animation: mounted && !prefersReducedMotion ? `premiumAmbientGlow ${baseAnimationDuration * 1.5}s ease-in-out infinite alternate` : 'none',
    willChange: mounted && !prefersReducedMotion ? 'opacity' : 'auto',
    transform: 'translate3d(0, 0, 0)',
  }

  return (
    <div 
      ref={containerRef}
      className={className}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -10 }}
      suppressHydrationWarning
      aria-hidden="true"
    >
      {/* Main gradient layer */}
      <div style={gradientStyle} />
      
      {/* Ambient light overlay for premium depth */}
      <div style={ambientLightStyle} />
    </div>
  )
} 