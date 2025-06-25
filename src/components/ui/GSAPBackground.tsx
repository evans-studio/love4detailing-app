"use client"

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { easePresets } from '@/lib/animations/utils'

interface GSAPBackgroundProps {
  className?: string
  intensity?: 'low' | 'medium' | 'high'
  variant?: 'hero' | 'section' | 'sidebar'
}

export default function GSAPBackground({ 
  className = '', 
  intensity = 'medium',
  variant = 'section'
}: GSAPBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!containerRef.current || !isClient) return

    const container = containerRef.current
    const orbs = container.querySelectorAll('.gsap-ambient')
    const particles = container.querySelectorAll('.gsap-particle')
    const glows = container.querySelectorAll('.gsap-glow')



    // Constrained animation configurations to prevent overflow
    const orbAnimations = [
      { x: 80, y: -60, duration: 25, opacity: 0.5, opacityDuration: 10 },
      { x: -70, y: 90, duration: 30, opacity: 0.6, opacityDuration: 12 },
      { x: 100, y: 80, duration: 35, opacity: 0.4, opacityDuration: 9 },
      { x: -90, y: -70, duration: 28, opacity: 0.7, opacityDuration: 11 },
      { x: 80, y: 90, duration: 32, opacity: 0.5, opacityDuration: 13 }
    ]

    const particleAnimations = [
      { x: 120, y: -100, duration: 35, opacity: 0.4, opacityDuration: 6 },
      { x: -90, y: 130, duration: 40, opacity: 0.6, opacityDuration: 7 },
      { x: 110, y: 90, duration: 42, opacity: 0.3, opacityDuration: 5 },
      { x: -100, y: -110, duration: 38, opacity: 0.7, opacityDuration: 8 },
      { x: 140, y: 100, duration: 45, opacity: 0.5, opacityDuration: 6 },
      { x: -80, y: 120, duration: 41, opacity: 0.4, opacityDuration: 7 },
      { x: 95, y: -90, duration: 37, opacity: 0.6, opacityDuration: 5 },
      { x: -120, y: 80, duration: 43, opacity: 0.3, opacityDuration: 8 },
      { x: 100, y: 110, duration: 39, opacity: 0.5, opacityDuration: 6 },
      { x: -85, y: -100, duration: 36, opacity: 0.7, opacityDuration: 7 },
      { x: 130, y: 90, duration: 44, opacity: 0.4, opacityDuration: 5 },
      { x: -95, y: 100, duration: 40, opacity: 0.6, opacityDuration: 8 },
      { x: 85, y: -80, duration: 38, opacity: 0.3, opacityDuration: 6 },
      { x: -110, y: 90, duration: 42, opacity: 0.5, opacityDuration: 7 },
      { x: 120, y: 80, duration: 41, opacity: 0.4, opacityDuration: 5 }
    ]

    const glowAnimations = [
      { x: 60, y: -50, duration: 45, opacity: 0.6, opacityDuration: 15 },
      { x: -70, y: 65, duration: 50, opacity: 0.5, opacityDuration: 18 },
      { x: 80, y: 55, duration: 55, opacity: 0.7, opacityDuration: 16 }
    ]

    // Animate orbs with enhanced settings
    orbs.forEach((orb, index) => {
      const config = orbAnimations[index]
      if (!config) return

      // Position animation
      gsap.to(orb, {
        x: `+=${config.x}`,
        y: `+=${config.y}`,
        duration: config.duration,
        ease: easePresets.smooth,
        repeat: -1,
        yoyo: true,
        delay: index * 2,
        force3D: true
      })

      // Opacity animation
      gsap.to(orb, {
        opacity: config.opacity,
        duration: config.opacityDuration,
        ease: easePresets.smooth,
        repeat: -1,
        yoyo: true,
        delay: index * 1.5,
        force3D: true
      })
    })

    // Animate particles
    particles.forEach((particle, index) => {
      const config = particleAnimations[index]
      if (!config) return

      gsap.to(particle, {
        x: `+=${config.x}`,
        y: `+=${config.y}`,
        duration: config.duration,
        ease: easePresets.smooth,
        repeat: -1,
        yoyo: true,
        delay: index * 0.5
      })

      gsap.to(particle, {
        opacity: config.opacity,
        duration: config.opacityDuration,
        ease: easePresets.smooth,
        repeat: -1,
        yoyo: true,
        delay: index * 0.3
      })
    })

    // Animate glows
    glows.forEach((glow, index) => {
      const config = glowAnimations[index]
      if (!config) return

      gsap.to(glow, {
        x: `+=${config.x}`,
        y: `+=${config.y}`,
        duration: config.duration,
        ease: easePresets.smooth,
        repeat: -1,
        yoyo: true,
        delay: index * 3
      })

      gsap.to(glow, {
        opacity: config.opacity,
        duration: config.opacityDuration,
        ease: easePresets.smooth,
        repeat: -1,
        yoyo: true,
        delay: index * 2.5
      })
    })

    return () => {
      gsap.killTweensOf([...orbs, ...particles, ...glows])
    }
  }, [isClient])

  const getVariantClasses = () => {
    switch (variant) {
      case 'hero':
        return 'min-h-screen'
      case 'sidebar':
        return 'h-full'
      default:
        return 'min-h-[50vh]'
    }
  }

  const getBackgroundStyle = () => {
    switch (variant) {
      case 'hero':
        return 'radial-gradient(ellipse at top, rgba(138, 43, 133, 0.1) 0%, rgba(20, 20, 20, 0.9) 50%, #141414 100%)'
      case 'sidebar':
        return 'linear-gradient(135deg, #141414 0%, #1E1E1E 100%)'
      default:
        return 'linear-gradient(135deg, #141414 0%, #1C0F1C 100%)'
    }
  }

  // Predefined configurations for consistent rendering
  const orbConfigs = [
    { size: 250, left: 20, top: 15 },
    { size: 300, left: 70, top: 25 },
    { size: 200, left: 50, top: 60 },
    { size: 280, left: 85, top: 70 },
    { size: 220, left: 10, top: 80 }
  ]

  const particlePositions = [
    { left: 10, top: 20, size: 3 },
    { left: 25, top: 35, size: 4 },
    { left: 40, top: 15, size: 2 },
    { left: 55, top: 45, size: 3 },
    { left: 70, top: 25, size: 4 },
    { left: 85, top: 40, size: 2 },
    { left: 15, top: 65, size: 3 },
    { left: 30, top: 75, size: 4 },
    { left: 45, top: 85, size: 2 },
    { left: 60, top: 70, size: 3 },
    { left: 75, top: 80, size: 4 },
    { left: 90, top: 60, size: 2 },
    { left: 20, top: 90, size: 3 },
    { left: 65, top: 95, size: 4 },
    { left: 80, top: 10, size: 2 }
  ]

  const glowConfigs = [
    { size: 450, left: 15, top: 20 },
    { size: 500, left: 60, top: 50 },
    { size: 400, left: 80, top: 10 }
  ]

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${getVariantClasses()} ${className}`}
      style={{ 
        background: getBackgroundStyle(),
        maxWidth: '100vw',
        width: '100%'
      }}
      suppressHydrationWarning
    >
      {/* Ambient Orbs */}
      {orbConfigs.map((config, index) => (
        <div
          key={`orb-${index}`}
          className="gsap-ambient absolute rounded-full pointer-events-none"
          style={{
            width: `${config.size}px`,
            height: `${config.size}px`,
            background: 'radial-gradient(circle, rgba(138, 43, 133, 0.15) 0%, rgba(138, 43, 133, 0.05) 50%, transparent 100%)',
            filter: 'blur(40px)',
            left: `${config.left}%`,
            top: `${config.top}%`,
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform, opacity',
            zIndex: 1,
          }}
        />
      ))}

      {/* Floating Particles */}
      {particlePositions.map((pos, index) => (
        <div
          key={`particle-${index}`}
          className="gsap-particle absolute rounded-full pointer-events-none"
          style={{
            width: `${pos.size}px`,
            height: `${pos.size}px`,
            background: 'rgba(138, 43, 133, 0.6)',
            left: `${pos.left}%`,
            top: `${pos.top}%`,
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform, opacity',
            zIndex: 2,
          }}
        />
      ))}

      {/* Glow Effects */}
      {glowConfigs.map((config, index) => (
        <div
          key={`glow-${index}`}
          className="gsap-glow absolute rounded-full pointer-events-none"
          style={{
            width: `${config.size}px`,
            height: `${config.size}px`,
            background: 'radial-gradient(circle, rgba(138, 43, 133, 0.08) 0%, rgba(186, 12, 47, 0.05) 40%, transparent 100%)',
            filter: 'blur(60px)',
            left: `${config.left}%`,
            top: `${config.top}%`,
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform, opacity',
            zIndex: 1,
          }}
        />
      ))}
    </div>
  )
} 