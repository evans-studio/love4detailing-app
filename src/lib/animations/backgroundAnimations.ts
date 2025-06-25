import { gsap } from 'gsap'
import { easePresets } from './utils'

export const initGSAPBackground = (container: HTMLElement) => {
  // Clear any existing animations
  gsap.killTweensOf(container.querySelectorAll('.gsap-particle, .gsap-glow, .gsap-ambient'))
  
  // Create ambient glow orbs with fixed positions to avoid hydration mismatch
  const createAmbientOrbs = () => {
    const orbCount = 5
    const orbs: HTMLElement[] = []
    
    // Use fixed positions and sizes to ensure consistency
    const orbConfigs = [
      { size: 250, left: 20, top: 15 },
      { size: 300, left: 70, top: 25 },
      { size: 200, left: 50, top: 60 },
      { size: 280, left: 85, top: 70 },
      { size: 220, left: 10, top: 80 }
    ]
    
    for (let i = 0; i < orbCount; i++) {
      const config = orbConfigs[i]
      const orb = document.createElement('div')
      orb.className = 'gsap-ambient'
      orb.style.cssText = `
        position: absolute;
        width: ${config.size}px;
        height: ${config.size}px;
        background: radial-gradient(circle, rgba(138, 43, 133, 0.15) 0%, rgba(138, 43, 133, 0.05) 50%, transparent 100%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        filter: blur(40px);
        will-change: transform, opacity;
        transform: translate3d(0, 0, 0);
        left: ${config.left}%;
        top: ${config.top}%;
      `
      
      container.appendChild(orb)
      orbs.push(orb)
    }
    
    return orbs
  }
  
  // Create floating particles with fixed positions
  const createFloatingParticles = () => {
    const particleCount = 15
    const particles: HTMLElement[] = []
    
    // Use fixed positions to avoid hydration mismatch
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
    
    for (let i = 0; i < particleCount; i++) {
      const pos = particlePositions[i]
      const particle = document.createElement('div')
      particle.className = 'gsap-particle'
      particle.style.cssText = `
        position: absolute;
        width: ${pos.size}px;
        height: ${pos.size}px;
        background: rgba(138, 43, 133, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 2;
        will-change: transform, opacity;
        transform: translate3d(0, 0, 0);
        left: ${pos.left}%;
        top: ${pos.top}%;
      `
      
      container.appendChild(particle)
      particles.push(particle)
    }
    
    return particles
  }
  
  // Create soft glow effects with fixed positions
  const createGlowEffects = () => {
    const glowCount = 3
    const glows: HTMLElement[] = []
    
    // Fixed configurations to prevent hydration mismatch
    const glowConfigs = [
      { size: 450, left: 15, top: 20 },
      { size: 500, left: 60, top: 50 },
      { size: 400, left: 80, top: 10 }
    ]
    
    for (let i = 0; i < glowCount; i++) {
      const config = glowConfigs[i]
      const glow = document.createElement('div')
      glow.className = 'gsap-glow'
      glow.style.cssText = `
        position: absolute;
        width: ${config.size}px;
        height: ${config.size}px;
        background: radial-gradient(circle, rgba(138, 43, 133, 0.08) 0%, rgba(186, 12, 47, 0.05) 40%, transparent 100%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        filter: blur(60px);
        will-change: transform, opacity;
        transform: translate3d(0, 0, 0);
        left: ${config.left}%;
        top: ${config.top}%;
      `
      
      container.appendChild(glow)
      glows.push(glow)
    }
    
    return glows
  }
  
  // Initialize elements
  const orbs = createAmbientOrbs()
  const particles = createFloatingParticles()
  const glows = createGlowEffects()
  
  // Predefined animation values to ensure consistency
  const orbAnimations = [
    { x: 180, y: -120, duration: 25, opacity: 0.5, opacityDuration: 10 },
    { x: -150, y: 200, duration: 30, opacity: 0.6, opacityDuration: 12 },
    { x: 220, y: 160, duration: 35, opacity: 0.4, opacityDuration: 9 },
    { x: -180, y: -140, duration: 28, opacity: 0.7, opacityDuration: 11 },
    { x: 160, y: 180, duration: 32, opacity: 0.5, opacityDuration: 13 }
  ]
  
  const particleAnimations = [
    { x: 250, y: -200, duration: 35, opacity: 0.4, opacityDuration: 6 },
    { x: -180, y: 260, duration: 40, opacity: 0.6, opacityDuration: 7 },
    { x: 220, y: 180, duration: 42, opacity: 0.3, opacityDuration: 5 },
    { x: -200, y: -220, duration: 38, opacity: 0.7, opacityDuration: 8 },
    { x: 280, y: 200, duration: 45, opacity: 0.5, opacityDuration: 6 },
    { x: -160, y: 240, duration: 41, opacity: 0.4, opacityDuration: 7 },
    { x: 190, y: -180, duration: 37, opacity: 0.6, opacityDuration: 5 },
    { x: -240, y: 160, duration: 43, opacity: 0.3, opacityDuration: 8 },
    { x: 200, y: 220, duration: 39, opacity: 0.5, opacityDuration: 6 },
    { x: -170, y: -200, duration: 36, opacity: 0.7, opacityDuration: 7 },
    { x: 260, y: 180, duration: 44, opacity: 0.4, opacityDuration: 5 },
    { x: -190, y: 200, duration: 40, opacity: 0.6, opacityDuration: 8 },
    { x: 170, y: -160, duration: 38, opacity: 0.3, opacityDuration: 6 },
    { x: -220, y: 180, duration: 42, opacity: 0.5, opacityDuration: 7 },
    { x: 240, y: 160, duration: 41, opacity: 0.4, opacityDuration: 5 }
  ]
  
  const glowAnimations = [
    { x: 120, y: -100, duration: 45, opacity: 0.6, opacityDuration: 15 },
    { x: -140, y: 130, duration: 50, opacity: 0.5, opacityDuration: 18 },
    { x: 160, y: 110, duration: 55, opacity: 0.7, opacityDuration: 16 }
  ]
  
  // Animate ambient orbs - slow, subtle movement
  orbs.forEach((orb, index) => {
    const config = orbAnimations[index]
    
    gsap.to(orb, {
      x: `+=${config.x}`,
      y: `+=${config.y}`,
      duration: config.duration,
      ease: easePresets.smooth,
      repeat: -1,
      yoyo: true,
      delay: index * 2
    })
    
    // Pulse opacity
    gsap.to(orb, {
      opacity: config.opacity,
      duration: config.opacityDuration,
      ease: easePresets.smooth,
      repeat: -1,
      yoyo: true,
      delay: index * 1.5
    })
  })
  
  // Animate floating particles - gentle drift
  particles.forEach((particle, index) => {
    const config = particleAnimations[index]
    
    gsap.to(particle, {
      x: `+=${config.x}`,
      y: `+=${config.y}`,
      duration: config.duration,
      ease: easePresets.smooth,
      repeat: -1,
      yoyo: true,
      delay: index * 0.5
    })
    
    // Subtle opacity animation
    gsap.to(particle, {
      opacity: config.opacity,
      duration: config.opacityDuration,
      ease: easePresets.smooth,
      repeat: -1,
      yoyo: true,
      delay: index * 0.3
    })
  })
  
  // Animate glow effects - very slow, ambient movement
  glows.forEach((glow, index) => {
    const config = glowAnimations[index]
    
    gsap.to(glow, {
      x: `+=${config.x}`,
      y: `+=${config.y}`,
      duration: config.duration,
      ease: easePresets.smooth,
      repeat: -1,
      yoyo: true,
      delay: index * 3
    })
    
    // Soft pulsing
    gsap.to(glow, {
      opacity: config.opacity,
      duration: config.opacityDuration,
      ease: easePresets.smooth,
      repeat: -1,
      yoyo: true,
      delay: index * 2.5
    })
  })
  
  // Return cleanup function
  return () => {
    // Kill all animations
    gsap.killTweensOf([...orbs, ...particles, ...glows])
    
    // Remove elements
    orbs.forEach(orb => orb.remove())
    particles.forEach(particle => particle.remove())
    glows.forEach(glow => glow.remove())
  }
} 