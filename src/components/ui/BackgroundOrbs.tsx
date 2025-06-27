"use client"

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface BackgroundOrbsProps {
  intensity?: 'low' | 'medium' | 'high'
  color?: string
  className?: string
}

export const BackgroundOrbs = ({ 
  intensity = 'medium',
  color = '#8A2B85',
  className = ''
}: BackgroundOrbsProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const orbs = containerRef.current.querySelectorAll('.orb')
    
    // Clear any existing animations
    gsap.killTweensOf(orbs)

    // Animation configurations based on intensity
    const getConfig = (index: number) => {
      const baseConfig = {
        low: {
          scale: 0.9,
          duration: 8,
          opacity: 0.35
        },
        medium: {
          scale: 1.1,
          duration: 6,
          opacity: 0.45
        },
        high: {
          scale: 1.3,
          duration: 4,
          opacity: 0.55
        }
      }[intensity]

      // Randomize movement range based on index
      const range = 80 + (index * 15) // Reduced range for more contained movement
      return {
        ...baseConfig,
        x: Math.sin(index) * range,
        y: Math.cos(index) * range
      }
    }

    // Animate each orb
    orbs.forEach((orb, index) => {
      const config = getConfig(index)
      
      // Create floating animation
      gsap.to(orb, {
        x: config.x,
        y: config.y,
        scale: config.scale,
        opacity: config.opacity,
        duration: config.duration,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.5
      })
    })

    return () => {
      gsap.killTweensOf(orbs)
    }
  }, [intensity])

  return (
    <div ref={containerRef} className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Large central orb */}
      <svg className="orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px]" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="orbMain" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.45" />
            <stop offset="45%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#orbMain)" />
      </svg>

      {/* Top right orb */}
      <svg className="orb absolute -top-[10%] -right-[10%] w-[800px] h-[800px]" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="orbTR" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="50%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#orbTR)" />
      </svg>

      {/* Bottom left orb */}
      <svg className="orb absolute -bottom-[15%] -left-[5%] w-[850px] h-[850px]" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="orbBL" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.42" />
            <stop offset="55%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#orbBL)" />
      </svg>

      {/* Additional accent orb */}
      <svg className="orb absolute top-[40%] -right-[5%] w-[750px] h-[750px]" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="orbAccent" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.38" />
            <stop offset="60%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#orbAccent)" />
      </svg>
    </div>
  )
} 