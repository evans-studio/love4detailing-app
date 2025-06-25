"use client"

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface AnimatedBackgroundProps {
  variant?: 'default' | 'subtle' | 'minimal'
  className?: string
}

export function AnimatedBackground({ variant = 'default', className = '' }: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const orbsRef = useRef<HTMLDivElement[]>([])
  const sparklesRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Create floating orbs
    const createOrbs = () => {
      const orbCount = variant === 'minimal' ? 2 : variant === 'subtle' ? 3 : 5
      
      for (let i = 0; i < orbCount; i++) {
        const orb = document.createElement('div')
        orb.className = 'absolute rounded-full opacity-20 pointer-events-none'
        
        // Orb sizes and colors based on variant
        const size = variant === 'minimal' ? 
          Math.random() * 200 + 100 : 
          Math.random() * 300 + 150
        
        orb.style.width = `${size}px`
        orb.style.height = `${size}px`
        orb.style.background = `radial-gradient(circle, rgba(166, 74, 251, 0.3) 0%, rgba(166, 74, 251, 0.1) 50%, transparent 100%)`
        orb.style.filter = 'blur(1px)'
        
        // Random initial position
        orb.style.left = `${Math.random() * 100}%`
        orb.style.top = `${Math.random() * 100}%`
        
        container.appendChild(orb)
        orbsRef.current.push(orb)
        
        // GSAP animation for orbs
        gsap.to(orb, {
          x: `+=${Math.random() * 200 - 100}`,
          y: `+=${Math.random() * 200 - 100}`,
          rotation: 360,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          duration: Math.random() * 20 + 15,
          delay: Math.random() * 5
        })
      }
    }

    // Create sparkles
    const createSparkles = () => {
      if (variant === 'minimal') return // No sparkles in minimal mode
      
      const sparkleCount = variant === 'subtle' ? 8 : 12
      
      for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div')
        sparkle.className = 'sparkle absolute w-1 h-1 bg-white rounded-full opacity-60 pointer-events-none'
        sparkle.style.boxShadow = '0 0 6px rgba(166, 74, 251, 0.8)'
        
        // Random initial position
        sparkle.style.left = `${Math.random() * 100}%`
        sparkle.style.top = `${Math.random() * 100}%`
        
        container.appendChild(sparkle)
        sparklesRef.current.push(sparkle)
      }
      
      // GSAP animation for sparkles (following the provided sample config)
      gsap.to(".sparkle", {
        x: "+=10",
        y: "-=5", 
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        duration: 8,
        stagger: {
          each: 0.6,
          from: "random"
        }
      })
      
      // Additional sparkle fade animation
      gsap.to(".sparkle", {
        opacity: 0.2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        duration: 3,
        stagger: {
          each: 0.8,
          from: "random"
        }
      })
    }

    createOrbs()
    createSparkles()

    // Cleanup function
    return () => {
      gsap.killTweensOf(orbsRef.current)
      gsap.killTweensOf(".sparkle")
      orbsRef.current = []
      sparklesRef.current = []
    }
  }, [variant])

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden z-0 pointer-events-none ${className}`}
      style={{
        background: `
          radial-gradient(circle at 20% 80%, rgba(166, 74, 251, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(166, 74, 251, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #141414 0%, #1a1a1a 100%)
        `
      }}
    />
  )
} 