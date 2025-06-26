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

export const initSectionTransitions = () => {
  // Section entrance animations with stagger
  const animateSectionEntrance = (selector: string, delay: number = 0) => {
    const elements = document.querySelectorAll(selector)
    
    elements.forEach((element, index) => {
      try {
        gsap.fromTo(element, 
          {
            y: 60,
            opacity: 0,
            scale: 0.95
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: easePresets.premium,
            delay: delay + (index * 0.1),
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse"
            }
          }
        )
      } catch (error) {
        // Fallback without ScrollTrigger
        gsap.fromTo(element, 
          {
            y: 60,
            opacity: 0,
            scale: 0.95
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: easePresets.premium,
            delay: delay + (index * 0.1)
          }
        )
      }
    })
  }
  
  // Create wave divider between sections
  const createWaveDivider = (section: HTMLElement, position: 'top' | 'bottom' = 'bottom') => {
    const wave = document.createElement('div')
    wave.className = 'gsap-wave-divider'
    wave.innerHTML = `
      <svg width="100%" height="60" viewBox="0 0 1200 60" preserveAspectRatio="none">
        <path d="M0,30 Q300,0 600,30 T1200,30 L1200,60 L0,60 Z" 
              fill="rgba(138, 43, 133, 0.1)" 
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
  
  // Staggered card animations
  const animateCards = (containerSelector: string) => {
    const container = document.querySelector(containerSelector)
    if (!container) return
    
    const cards = container.querySelectorAll('[class*="Card"], .card, [class*="card"]')
    
    gsap.fromTo(cards,
      {
        y: 40,
        opacity: 0,
        rotateX: 10
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.8,
        ease: easePresets.premium,
        stagger: 0.15,
        scrollTrigger: {
          trigger: container,
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play none none reverse"
        }
      }
    )
  }
  
  // Text reveal animations
  const animateTextReveal = (selector: string) => {
    const elements = document.querySelectorAll(selector)
    
    elements.forEach((element) => {
      // Split text into lines
      const text = element.textContent || ''
      const lines = text.split('\n').filter(line => line.trim())
      
      if (lines.length > 1) {
        element.innerHTML = lines.map(line => 
          `<div style="overflow: hidden;"><div class="text-line">${line}</div></div>`
        ).join('')
        
        const textLines = element.querySelectorAll('.text-line')
        
        gsap.fromTo(textLines,
          {
            y: '100%',
            opacity: 0
          },
          {
            y: '0%',
            opacity: 1,
            duration: 0.8,
            ease: easePresets.premium,
            stagger: 0.1,
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        )
      }
    })
  }
  
  // Initialize all section transitions
  const initializeTransitions = () => {
    // Animate main sections
    animateSectionEntrance('section', 0)
    
    // Animate cards in grids
    animateCards('[class*="grid"]')
    
    // Add wave dividers to alternating sections
    const sections = document.querySelectorAll('section')
    sections.forEach((section, index) => {
      if (index > 0 && index % 2 === 0) {
        createWaveDivider(section as HTMLElement, 'top')
      }
    })
    
    // Animate headings with text reveal
    animateTextReveal('h1, h2')
  }
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTransitions)
  } else {
    initializeTransitions()
  }
  
  return {
    animateSectionEntrance,
    createWaveDivider,
    animateCards,
    animateTextReveal
  }
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
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
} 