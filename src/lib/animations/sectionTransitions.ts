import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { easePresets } from './utils'

// Try to register ScrollTrigger if available
try {
  if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
  }
} catch (error) {
  console.warn('ScrollTrigger not available, animations will work without scroll triggers')
}

// Utility function to safely convert NodeList to Array and validate elements
const getValidElements = (selector: string): Element[] => {
  if (typeof window === 'undefined') return []
  const elements = document.querySelectorAll(selector)
  return Array.from(elements).filter(el => el instanceof Element)
}

// Utility function to safely animate with ScrollTrigger
const safeAnimate = (elements: Element[], animation: gsap.TweenVars, scrollTrigger?: ScrollTrigger.Vars) => {
  if (!elements.length) return

  const tween = gsap.to(elements, {
    ...animation,
    scrollTrigger: scrollTrigger ? {
      ...scrollTrigger,
      // Kill ScrollTrigger when animation is done
      onLeave: () => {
        ScrollTrigger.getAll().forEach(st => st.kill())
      }
    } : undefined
  })

  return tween
}

// Create wave divider between sections
export const createWaveDivider = (section: HTMLElement, position: 'top' | 'bottom' = 'bottom') => {
  const wave = document.createElement('div')
  wave.className = 'gsap-wave-divider'
  wave.innerHTML = `
    <svg width="100%" height="60" viewBox="0 0 1200 60" preserveAspectRatio="none">
      <path d="M0,30 Q300,0 600,30 T1200,30 L1200,60 L0,60 Z" 
            fill="rgba(151, 71, 255, 0.1)" 
            opacity="0.5">
      </path>
    </svg>
  `
  
  wave.style.cssText = `
    position: absolute;
    ${position}: 0;
    left: 0;
    right: 0;
    height: 60px;
    pointer-events: none;
    z-index: 5;
    transform: ${position === 'top' ? 'rotate(180deg)' : 'rotate(0deg)'};
  `
  
  section.style.position = 'relative'
  section.appendChild(wave)
  
  // Animate wave
  const path = wave.querySelector('path')
  if (path) {
    gsap.to(path, {
      attr: { d: "M0,30 Q450,10 600,30 T1200,30 L1200,60 L0,60 Z" },
      duration: 8,
      ease: easePresets.smooth,
      repeat: -1,
      yoyo: true
    })
  }
  
  return wave
}

// Text reveal animations
export const animateTextReveal = (selector: string) => {
  const elements = getValidElements(selector)
  if (!elements.length) return

  elements.forEach(element => {
    // Split text into lines
    const text = element.textContent || ''
    const lines = text.split('\\n').filter(line => line.trim())

    if (lines.length > 1) {
      element.innerHTML = lines.map(line => 
        `<div style="overflow: hidden;"><div class="text-line">${line}</div></div>`
      ).join('')

      const textLines = Array.from(element.querySelectorAll('.text-line'))
      if (!textLines.length) return

      safeAnimate(textLines, {
        y: '0%',
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: easePresets.smooth
      })
    } else {
      safeAnimate([element], {
        y: '0%',
        opacity: 1,
        duration: 0.8,
        ease: easePresets.smooth
      })
    }
  })
}

// Section reveal animations
export const animateSectionReveal = (selector: string) => {
  const elements = getValidElements(selector)
  if (!elements.length) return

  safeAnimate(elements, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: easePresets.smooth,
    stagger: 0.2
  }, {
    trigger: elements[0],
    start: 'top 80%',
    end: 'bottom 20%',
    toggleActions: 'play none none reverse'
  })
}

// Cleanup function to kill all animations
export const cleanupAnimations = () => {
  if (typeof window === 'undefined') return
  
  gsap.killTweensOf('*')
  ScrollTrigger.getAll().forEach(st => st.kill())
}

export const fadeInOnScroll = (element: HTMLElement, delay = 0) => {
  gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 50,
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    }
  )
}

export const staggerChildren = (
  container: HTMLElement,
  childSelector: string,
  staggerDelay = 0.2
) => {
  const children = container.querySelectorAll(childSelector)
  gsap.fromTo(
    children,
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: staggerDelay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    }
  )
}

export const parallaxScroll = (element: HTMLElement, speed = 0.5) => {
  gsap.to(element, {
    y: () => element.offsetHeight * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
}

export const scaleOnScroll = (element: HTMLElement, scale = 1.2) => {
  gsap.fromTo(
    element,
    {
      scale: 1,
    },
    {
      scale,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top center',
        end: 'bottom center',
        scrub: true,
      },
    }
  )
}

export const rotateOnScroll = (element: HTMLElement, rotation = 360) => {
  gsap.to(element, {
    rotation,
    duration: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
}

// Initialize all section transitions
export const initSectionTransitions = () => {
  if (typeof window === 'undefined') return

  // Animate text elements
  animateTextReveal('.gsap-text-reveal')

  // Animate sections
  animateSectionReveal('.gsap-section-reveal')

  // Add wave dividers to sections that need them
  document.querySelectorAll('.gsap-wave-section').forEach(section => {
    if (section instanceof HTMLElement) {
      createWaveDivider(section)
    }
  })

  // Initialize parallax elements
  document.querySelectorAll('.gsap-parallax').forEach(element => {
    if (element instanceof HTMLElement) {
      parallaxScroll(element)
    }
  })

  // Initialize scale animations
  document.querySelectorAll('.gsap-scale').forEach(element => {
    if (element instanceof HTMLElement) {
      scaleOnScroll(element)
    }
  })

  // Initialize rotate animations
  document.querySelectorAll('.gsap-rotate').forEach(element => {
    if (element instanceof HTMLElement) {
      rotateOnScroll(element)
    }
  })

  // Initialize stagger animations for lists
  document.querySelectorAll('.gsap-stagger-container').forEach(container => {
    if (container instanceof HTMLElement) {
      staggerChildren(container, '.gsap-stagger-item')
    }
  })

  // Initialize fade-in animations
  document.querySelectorAll('.gsap-fade-in').forEach((element, index) => {
    if (element instanceof HTMLElement) {
      fadeInOnScroll(element, index * 0.1)
    }
  })

  return () => {
    cleanupAnimations()
  }
} 