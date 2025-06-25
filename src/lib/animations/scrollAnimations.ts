import { gsap } from 'gsap'
import { easePresets } from './utils'

// Try to register ScrollTrigger if available
let ScrollTrigger: any = null
try {
  if (typeof window !== 'undefined') {
    ScrollTrigger = require('gsap/ScrollTrigger').ScrollTrigger
    gsap.registerPlugin(ScrollTrigger)
  }
} catch (error) {
  console.warn('ScrollTrigger not available, scroll animations will be disabled')
}

export const createScrollTrigger = (
  trigger: string | HTMLElement,
  animation: any,
  options: any = {}
) => {
  if (!ScrollTrigger) {
    console.warn('ScrollTrigger not available, running animation immediately')
    return animation
  }
  
  const defaultOptions = {
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse",
    ...options
  }
  
  return ScrollTrigger.create({
    trigger,
    ...defaultOptions,
    animation
  })
}

export const initParallaxEffects = () => {
  if (!ScrollTrigger) {
    return
  }
  
  // Parallax background elements
  const parallaxElements = document.querySelectorAll('.gsap-ambient, .gsap-glow')
  
  parallaxElements.forEach((element, index) => {
    gsap.to(element, {
      y: (i, target) => -ScrollTrigger.maxScroll(window) * (0.15 + (index * 0.02)), // Use index instead of random
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true
      }
    })
  })
}

export const initScrollAnimations = () => {
  if (!ScrollTrigger) {
    console.warn('ScrollTrigger not available, scroll animations disabled')
    return {
      refresh: () => {},
      kill: () => {}
    }
  }
  
  // Refresh ScrollTrigger when window resizes
  ScrollTrigger.addEventListener("refresh", () => {
    // Force refresh on resize
  })
  
  // Smooth scroll to top on page load
  window.scrollTo(0, 0)
  
  // Initialize parallax effects
  setTimeout(initParallaxEffects, 100)
  
  return {
    refresh: () => ScrollTrigger.refresh(),
    kill: () => ScrollTrigger.killAll()
  }
} 