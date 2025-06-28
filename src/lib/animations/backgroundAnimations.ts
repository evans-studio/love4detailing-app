import { gsap } from 'gsap'

export const initGSAPBackground = (container: HTMLElement) => {
  if (!container) return

  // Clear any existing animations
  gsap.killTweensOf(container.querySelectorAll('.gsap-particle, .gsap-glow, .gsap-ambient'))
  
  // Create premium ambient orbs with reduced blur and brand colors
  const createAmbientOrbs = () => {
    // Reduce number of orbs on mobile
    const isMobile = window.innerWidth < 768
    const orbCount = isMobile ? 2 : 4
    const orbs: HTMLElement[] = []
    
    // Fixed positions optimized for premium feel
    const orbConfigs = [
      { size: isMobile ? 160 : 320, left: 15, top: 20 },
      { size: isMobile ? 140 : 280, left: 75, top: 30 },
      { size: isMobile ? 175 : 350, left: 45, top: 65 },
      { size: isMobile ? 150 : 300, left: 85, top: 75 }
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
        filter: blur(${isMobile ? '10px' : '20px'});
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
    // Reduce particles on mobile
    const isMobile = window.innerWidth < 768
    const particleCount = isMobile ? 4 : 8
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
    // Reduce glows on mobile
    const isMobile = window.innerWidth < 768
    const glowCount = isMobile ? 1 : 2
    const glows: HTMLElement[] = []
    
    // Strategic positioning for depth
    const glowConfigs = [
      { size: isMobile ? 250 : 500, left: 25, top: 35 },
      { size: isMobile ? 225 : 450, left: 70, top: 60 }
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
        filter: blur(${isMobile ? '15px' : '30px'});
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
  
  // Slower animations on mobile for better performance
  const isMobile = window.innerWidth < 768
  const durationMultiplier = isMobile ? 1.5 : 1
  
  // Premium animation configurations - slower, more elegant
  const orbAnimations = [
    { x: 60, y: -40, duration: 40 * durationMultiplier, opacity: 0.6, opacityDuration: 15 * durationMultiplier },
    { x: -50, y: 70, duration: 50 * durationMultiplier, opacity: 0.5, opacityDuration: 18 * durationMultiplier },
    { x: 75, y: 50, duration: 45 * durationMultiplier, opacity: 0.7, opacityDuration: 12 * durationMultiplier },
    { x: -65, y: -45, duration: 55 * durationMultiplier, opacity: 0.4, opacityDuration: 20 * durationMultiplier }
  ]
  
  const particleAnimations = [
    { x: 75, y: -60, duration: 60 * durationMultiplier, opacity: 0.6, opacityDuration: 8 * durationMultiplier },
    { x: -60, y: 90, duration: 70 * durationMultiplier, opacity: 0.5, opacityDuration: 10 * durationMultiplier },
    { x: 90, y: 70, duration: 65 * durationMultiplier, opacity: 0.7, opacityDuration: 7 * durationMultiplier },
    { x: -80, y: -70, duration: 75 * durationMultiplier, opacity: 0.4, opacityDuration: 12 * durationMultiplier }
  ]
  
  const glowAnimations = [
    { x: 40, y: -30, duration: 80 * durationMultiplier, opacity: 0.5, opacityDuration: 25 * durationMultiplier },
    { x: -45, y: 35, duration: 85 * durationMultiplier, opacity: 0.6, opacityDuration: 30 * durationMultiplier }
  ]
  
  // Animate ambient orbs with reduced movement on mobile
  orbs.forEach((orb, index) => {
    if (!orb) return
    const config = orbAnimations[index]
    
    gsap.to(orb, {
      x: `+=${config.x}`,
      y: `+=${config.y}`,
      duration: config.duration,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
      delay: index * 3
    })
    
    gsap.to(orb, {
      opacity: config.opacity,
      duration: config.opacityDuration,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: index * 2
    })
  })
  
  // Animate floating particles with reduced movement
  particles.forEach((particle, index) => {
    if (!particle) return
    const config = particleAnimations[index % particleAnimations.length]
    
    gsap.to(particle, {
      x: `+=${config.x}`,
      y: `+=${config.y}`,
      duration: config.duration,
      ease: "none",
      repeat: -1,
      yoyo: true,
      delay: index * 4
    })
    
    gsap.to(particle, {
      opacity: config.opacity,
      duration: config.opacityDuration,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: index * 1.5
    })
    
    gsap.to(particle, {
      scale: 1.3,
      duration: config.opacityDuration * 2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: index * 2.5
    })
  })
  
  // Animate glow effects with reduced movement
  glows.forEach((glow, index) => {
    if (!glow) return
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
    
    gsap.to(glow, {
      opacity: config.opacity,
      duration: config.opacityDuration,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: index * 3
    })
  })
  
  // Handle window resize
  const handleResize = () => {
    // Kill all animations
    gsap.killTweensOf([...orbs, ...particles, ...glows])
    
    // Remove existing elements
    orbs.forEach(orb => orb?.remove())
    particles.forEach(particle => particle?.remove())
    glows.forEach(glow => glow?.remove())
    
    // Reinitialize with new sizes
    initGSAPBackground(container)
  }
  
  window.addEventListener('resize', handleResize)
  
  // Cleanup function
  return () => {
    window.removeEventListener('resize', handleResize)
    gsap.killTweensOf([...orbs, ...particles, ...glows])
    orbs.forEach(orb => orb?.remove())
    particles.forEach(particle => particle?.remove())
    glows.forEach(glow => glow?.remove())
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