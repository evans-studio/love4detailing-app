import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { breakpoints } from '../constants/breakpoints'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Helper to check if we're on mobile
const isMobile = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < breakpoints.md
}

// Responsive animation timings
const timings = {
  fast: 0.2,
  medium: 0.4,
  slow: 0.6,
  extraSlow: 0.8,
}

// Responsive animation easings
const easings = {
  smooth: 'power2.out',
  bounce: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.3)',
  snappy: 'power4.out',
}

// Responsive animation distances (in pixels)
const distances = {
  short: isMobile() ? 20 : 30,
  medium: isMobile() ? 40 : 60,
  long: isMobile() ? 60 : 100,
}

// Fade in animation with optional Y movement
export const fadeIn = (
  element: string | Element,
  options = {
    y: 0,
    delay: 0,
    duration: timings.medium,
    ease: easings.smooth,
    scrollTrigger: false,
  }
) => {
  const animation = {
    opacity: 0,
    y: options.y,
    duration: options.duration,
    ease: options.ease,
    delay: options.delay,
  }

  if (options.scrollTrigger) {
    return gsap.from(element, {
      ...animation,
      scrollTrigger: {
        trigger: element,
        start: 'top bottom-=100',
        end: 'bottom top+=100',
        toggleActions: 'play none none reverse',
      },
    })
  }

  return gsap.from(element, animation)
}

// Stagger children animations
export const staggerChildren = (
  parent: string | Element,
  children: string,
  options = {
    y: distances.short,
    stagger: 0.1,
    duration: timings.medium,
    ease: easings.smooth,
    scrollTrigger: false,
  }
) => {
  const animation = {
    opacity: 0,
    y: options.y,
    duration: options.duration,
    stagger: options.stagger,
    ease: options.ease,
  }

  // Get all child elements that match the selector
  const childElements = parent instanceof Element 
    ? Array.from(parent.querySelectorAll(children))
    : Array.from(document.querySelectorAll(`${parent} ${children}`))

  if (options.scrollTrigger) {
    return gsap.from(childElements, {
      ...animation,
      scrollTrigger: {
        trigger: parent,
        start: 'top bottom-=100',
        end: 'bottom top+=100',
        toggleActions: 'play none none reverse',
      },
    })
  }

  return gsap.from(childElements, animation)
}

// Scale animation
export const scaleIn = (
  element: string | Element,
  options = {
    scale: 0.95,
    duration: timings.medium,
    ease: easings.bounce,
    scrollTrigger: false,
  }
) => {
  const animation = {
    opacity: 0,
    scale: options.scale,
    duration: options.duration,
    ease: options.ease,
  }

  if (options.scrollTrigger) {
    return gsap.from(element, {
      ...animation,
      scrollTrigger: {
        trigger: element,
        start: 'top bottom-=100',
        end: 'bottom top+=100',
        toggleActions: 'play none none reverse',
      },
    })
  }

  return gsap.from(element, animation)
}

// Slide in animation
export const slideIn = (
  element: string | Element,
  options = {
    x: distances.medium,
    duration: timings.medium,
    ease: easings.smooth,
    scrollTrigger: false,
  }
) => {
  const animation = {
    opacity: 0,
    x: options.x,
    duration: options.duration,
    ease: options.ease,
  }

  if (options.scrollTrigger) {
    return gsap.from(element, {
      ...animation,
      scrollTrigger: {
        trigger: element,
        start: 'top bottom-=100',
        end: 'bottom top+=100',
        toggleActions: 'play none none reverse',
      },
    })
  }

  return gsap.from(element, animation)
}

// Parallax scroll effect
export const parallaxScroll = (
  element: string | Element,
  options = {
    y: distances.long,
    scrub: true,
    ease: 'none',
  }
) => {
  // Don't apply parallax on mobile for better performance
  if (isMobile()) return

  return gsap.to(element, {
    y: options.y,
    ease: options.ease,
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: options.scrub,
    },
  })
}

// Text reveal animation
export const revealText = (
  element: string | Element,
  options = {
    y: distances.short,
    duration: timings.medium,
    stagger: 0.02,
    ease: easings.smooth,
    scrollTrigger: false,
  }
) => {
  // Split text into spans if not already split
  const splitText = (el: Element) => {
    const text = el.textContent || ''
    el.textContent = ''
    text.split('').forEach(char => {
      const span = document.createElement('span')
      span.textContent = char
      span.style.display = 'inline-block'
      el.appendChild(span)
    })
    return el.querySelectorAll('span')
  }

  let spans: Element[] = []
  
  if (typeof element === 'string') {
    document.querySelectorAll(element).forEach(el => {
      spans = [...spans, ...splitText(el)]
    })
  } else {
    spans = [...splitText(element)]
  }

  const animation = {
    opacity: 0,
    y: options.y,
    duration: options.duration,
    stagger: options.stagger,
    ease: options.ease,
  }

  if (options.scrollTrigger) {
    return gsap.from(spans, {
      ...animation,
      scrollTrigger: {
        trigger: typeof element === 'string' ? element : element,
        start: 'top bottom-=100',
        end: 'bottom top+=100',
        toggleActions: 'play none none reverse',
      },
    })
  }

  return gsap.from(spans, animation)
}

// Button hover animation
export const buttonHover = (element: string | Element) => {
  const button = typeof element === 'string' 
    ? document.querySelector(element)
    : element

  if (!button) return

  const tl = gsap.timeline({ paused: true })

  tl.to(button, {
    scale: 1.05,
    duration: timings.fast,
    ease: easings.smooth,
  })

  if (button instanceof Element) {
    button.addEventListener('mouseenter', () => tl.play())
    button.addEventListener('mouseleave', () => tl.reverse())
  }

  return tl
}

// Export all animations and utilities
export const animations = {
  fadeIn,
  staggerChildren,
  scaleIn,
  slideIn,
  parallaxScroll,
  revealText,
  buttonHover,
  timings,
  easings,
  distances,
}

export const animateElements = (parent: string | Element, children: string) => {
  if (typeof window === 'undefined') return

  // Convert NodeList to Array and ensure elements exist
  const childElements = parent instanceof Element 
    ? Array.from(parent.querySelectorAll(children))
    : Array.from(document.querySelectorAll(`${parent} ${children}`))

  if (!childElements.length) return

  gsap.fromTo(
    childElements,
    { 
      opacity: 0,
      y: 20 
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out'
    }
  )
}

export const animateSection = (section: Element | null) => {
  if (!section || typeof window === 'undefined') return

  const elements = Array.from(section.children)
  if (!elements.length) return

  gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: 30
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out'
    }
  )
}

export const animateHero = (heroSection: Element | null) => {
  if (!heroSection || typeof window === 'undefined') return

  const elements = Array.from(heroSection.children)
  if (!elements.length) return

  const timeline = gsap.timeline()

  timeline
    .fromTo(
      elements,
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out'
      }
    )
    .fromTo(
      heroSection.querySelectorAll('.hero-accent'),
      {
        scale: 0.8,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      },
      '-=0.4'
    )
} 