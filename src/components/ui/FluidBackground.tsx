"use client"

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface FluidBackgroundProps {
  intensity?: 'low' | 'medium' | 'high'
  className?: string
}

export const FluidBackground = ({
  intensity = 'medium',
  className = ''
}: FluidBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleMotionChange)
    return () => mediaQuery.removeEventListener('change', handleMotionChange)
  }, [])

  useEffect(() => {
    if (!containerRef.current || !mounted || prefersReducedMotion) return

    const orbs = containerRef.current.querySelectorAll('.orb')
    gsap.killTweensOf(orbs)

    // Premium animation configurations
    const getConfig = (index: number) => {
      const baseConfig = {
        low: {
          scale: 0.9,
          duration: 8,
          opacity: 0.35,
          delay: 0.3
        },
        medium: {
          scale: 1.1,
          duration: 6,
          opacity: 0.45,
          delay: 0.2
        },
        high: {
          scale: 1.3,
          duration: 4,
          opacity: 0.55,
          delay: 0.1
        }
      }[intensity]

      // Smooth, organic movement paths
      const paths = [
        { x: 80, y: -60 },
        { x: -70, y: 80 },
        { x: 60, y: 90 },
        { x: -90, y: -40 }
      ]

      const path = paths[index % paths.length]
      return {
        ...baseConfig,
        ...path
      }
    }

    // Animate each orb with premium motion
    orbs.forEach((orb, index) => {
      const config = getConfig(index)
      
      // Create smooth floating animation
      gsap.to(orb, {
        x: config.x,
        y: config.y,
        scale: config.scale,
        opacity: config.opacity,
        duration: config.duration,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * config.delay
      })
    })

    return () => {
      gsap.killTweensOf(orbs)
    }
  }, [intensity, mounted, prefersReducedMotion])

  return (
    <div 
      ref={containerRef} 
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ 
        perspective: '1000px',
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Large central orb */}
      <svg className="orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="orbMain" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#8A2B85" stopOpacity="0.4" />
            <stop offset="45%" stopColor="#8A2B85" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8A2B85" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#orbMain)" />
      </svg>

      {/* Top right orb */}
      <svg className="orb absolute -top-[10%] -right-[10%] w-[600px] h-[600px]" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="orbTR" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#8A2B85" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#8A2B85" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#8A2B85" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#orbTR)" />
      </svg>

      {/* Bottom left orb */}
      <svg className="orb absolute -bottom-[15%] -left-[5%] w-[700px] h-[700px]" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="orbBL" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#8A2B85" stopOpacity="0.38" />
            <stop offset="55%" stopColor="#8A2B85" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#8A2B85" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#orbBL)" />
      </svg>

      {/* Additional accent orb */}
      <svg className="orb absolute top-[40%] -right-[5%] w-[500px] h-[500px]" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="orbAccent" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#8A2B85" stopOpacity="0.32" />
            <stop offset="60%" stopColor="#8A2B85" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#8A2B85" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#orbAccent)" />
      </svg>
    </div>
  )
} 