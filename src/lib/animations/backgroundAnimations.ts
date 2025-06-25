import { gsap } from 'gsap'
import { easePresets } from './utils'

export const initGSAPBackground = (container: HTMLElement) => {
  // Clear any existing animations
  gsap.killTweensOf(container.querySelectorAll('.gsap-particle, .gsap-glow, .gsap-ambient'))
  
  // Create premium ambient orbs with reduced blur and brand colors
  const createAmbientOrbs = () => {
    const orbCount = 4 // Reduced for cleaner look
    const orbs: HTMLElement[] = []
    
    // Fixed positions optimized for premium feel
    const orbConfigs = [
      { size: 320, left: 15, top: 20 },
      { size: 280, left: 75, top: 30 },
      { size: 350, left: 45, top: 65 },
      { size: 300, left: 85, top: 75 }
    ]
    
    for (let i = 0; i < orbCount; i++) {
      const config = orbConfigs[i]
      const orb = document.createElement('div')
      orb.className = 'gsap-ambient'
      orb.style.cssText = `
        position: absolute;
        width: ${config.size}px;
        height: ${config.size}px;
        background: radial-gradient(circle, rgba(138, 43, 133, 0.08) 0%, rgba(181, 88, 170, 0.04) 40%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        filter: blur(20px);
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
  
  // Create elegant floating particles with crisp rendering
  const createFloatingParticles = () => {
    const particleCount = 8 // Reduced for premium, clean look
    const particles: HTMLElement[] = []
    
    // Optimized positions for elegant distribution
    const particlePositions = [
      { left: 20, top: 25, size: 2 },
      { left: 35, top: 40, size: 3 },
      { left: 55, top: 20, size: 2 },
      { left: 70, top: 55, size: 3 },
      { left: 25, top: 70, size: 2 },
      { left: 60, top: 80, size: 3 },
      { left: 80, top: 35, size: 2 },
      { left: 40, top: 90, size: 3 }
    ]
    
    for (let i = 0; i < particleCount; i++) {
      const pos = particlePositions[i]
      const particle = document.createElement('div')
      particle.className = 'gsap-particle'
      particle.style.cssText = `
        position: absolute;
        width: ${pos.size}px;
        height: ${pos.size}px;
        background: rgba(181, 88, 170, 0.4);
        border-radius: 50%;
        pointer-events: none;
        z-index: 2;
        will-change: transform, opacity;
        transform: translate3d(0, 0, 0);
        left: ${pos.left}%;
        top: ${pos.top}%;
        box-shadow: 0 0 ${pos.size * 2}px rgba(138, 43, 133, 0.3);
      `
      
      container.appendChild(particle)
      particles.push(particle)
    }
    
    return particles
  }
  
  // Create premium glow effects with minimal blur
  const createGlowEffects = () => {
    const glowCount = 2 // Reduced for cleaner premium look
    const glows: HTMLElement[] = []
    
    // Strategic positioning for depth
    const glowConfigs = [
      { size: 500, left: 25, top: 35 },
      { size: 450, left: 70, top: 60 }
    ]
    
    for (let i = 0; i < glowCount; i++) {
      const config = glowConfigs[i]
      const glow = document.createElement('div')
      glow.className = 'gsap-glow'
      glow.style.cssText = `
        position: absolute;
        width: ${config.size}px;
        height: ${config.size}px;
        background: radial-gradient(circle, rgba(138, 43, 133, 0.04) 0%, rgba(181, 88, 170, 0.02) 50%, transparent 80%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        filter: blur(30px);
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
  
  // Premium animation configurations - slower, more elegant
  const orbAnimations = [
    { x: 120, y: -80, duration: 40, opacity: 0.6, opacityDuration: 15 },
    { x: -100, y: 140, duration: 50, opacity: 0.5, opacityDuration: 18 },
    { x: 150, y: 100, duration: 45, opacity: 0.7, opacityDuration: 12 },
    { x: -130, y: -90, duration: 55, opacity: 0.4, opacityDuration: 20 }
  ]
  
  const particleAnimations = [
    { x: 150, y: -120, duration: 60, opacity: 0.6, opacityDuration: 8 },
    { x: -120, y: 180, duration: 70, opacity: 0.5, opacityDuration: 10 },
    { x: 180, y: 140, duration: 65, opacity: 0.7, opacityDuration: 7 },
    { x: -160, y: -140, duration: 75, opacity: 0.4, opacityDuration: 12 },
    { x: 140, y: 160, duration: 68, opacity: 0.6, opacityDuration: 9 },
    { x: -140, y: 120, duration: 72, opacity: 0.5, opacityDuration: 11 },
    { x: 120, y: -100, duration: 63, opacity: 0.7, opacityDuration: 8 },
    { x: -100, y: 100, duration: 77, opacity: 0.4, opacityDuration: 10 }
  ]
  
  const glowAnimations = [
    { x: 80, y: -60, duration: 80, opacity: 0.5, opacityDuration: 25 },
    { x: -90, y: 70, duration: 85, opacity: 0.6, opacityDuration: 30 }
  ]
  
  // Animate ambient orbs - slow, elegant movement
  orbs.forEach((orb, index) => {
    const config = orbAnimations[index]
    
    gsap.to(orb, {
      x: `+=${config.x}`,
      y: `+=${config.y}`,
      duration: config.duration,
      ease: "power1.inOut", // Smoother easing
      repeat: -1,
      yoyo: true,
      delay: index * 3 // Increased delay for more elegant staggering
    })
    
    // Gentle opacity pulse
    gsap.to(orb, {
      opacity: config.opacity,
      duration: config.opacityDuration,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: index * 2
    })
  })
  
  // Animate floating particles - gentle, premium drift
  particles.forEach((particle, index) => {
    const config = particleAnimations[index]
    
    gsap.to(particle, {
      x: `+=${config.x}`,
      y: `+=${config.y}`,
      duration: config.duration,
      ease: "none", // Linear for continuous drift
      repeat: -1,
      yoyo: true,
      delay: index * 4
    })
    
    // Subtle twinkling effect
    gsap.to(particle, {
      opacity: config.opacity,
      duration: config.opacityDuration,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: index * 1.5
    })
    
    // Gentle scale variation
    gsap.to(particle, {
      scale: 1.3,
      duration: config.opacityDuration * 2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: index * 2.5
    })
  })
  
  // Animate glow effects - very slow, ambient movement
  glows.forEach((glow, index) => {
    const config = glowAnimations[index]
    
    gsap.to(glow, {
      x: `+=${config.x}`,
      y: `+=${config.y}`,
      duration: config.duration,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
      delay: index * 5
    })
    
    // Very subtle opacity variation
    gsap.to(glow, {
      opacity: config.opacity,
      duration: config.opacityDuration,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: index * 3
    })
  })
  
  // Cleanup function
  return () => {
    gsap.killTweensOf([...orbs, ...particles, ...glows])
    orbs.forEach(orb => orb.remove())
    particles.forEach(particle => particle.remove())
    glows.forEach(glow => glow.remove())
  }
}

// Premium scroll-based background effects
export const initScrollBasedBackground = (container: HTMLElement) => {
  const elements = container.querySelectorAll('.gsap-ambient, .gsap-particle, .gsap-glow')
  
  // Subtle parallax effect on scroll
  gsap.to(elements, {
    y: -50,
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom top",
      scrub: 1.5 // Slower, smoother scrub
    }
  })
}

// Premium background for specific sections
export const createSectionBackground = (section: HTMLElement, intensity: 'low' | 'medium' | 'high' = 'medium') => {
  const overlay = document.createElement('div')
  overlay.className = 'premium-section-overlay'
  
  const intensityMap = {
    low: 0.02,
    medium: 0.04,
    high: 0.06
  }
  
  overlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse 600px 400px at 50% 30%, rgba(138, 43, 133, ${intensityMap[intensity]}) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  `
  
  section.style.position = 'relative'
  section.insertBefore(overlay, section.firstChild)
  
  // Subtle animation
  gsap.to(overlay, {
    opacity: intensityMap[intensity] * 1.5,
    duration: 8,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  })
  
  return overlay
} 