import { useState, useEffect } from 'react'
import { breakpoints } from '@/lib/constants/breakpoints'

type Breakpoint = keyof typeof breakpoints

export function useResponsive() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('sm')
  const [isMobile, setIsMobile] = useState(true)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isLargeDesktop, setIsLargeDesktop] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth

      // Update current breakpoint
      if (width >= breakpoints['2xl']) {
        setCurrentBreakpoint('2xl')
      } else if (width >= breakpoints.xl) {
        setCurrentBreakpoint('xl')
      } else if (width >= breakpoints.lg) {
        setCurrentBreakpoint('lg')
      } else if (width >= breakpoints.md) {
        setCurrentBreakpoint('md')
      } else {
        setCurrentBreakpoint('sm')
      }

      // Update device type flags
      setIsMobile(width < breakpoints.md)
      setIsTablet(width >= breakpoints.md && width < breakpoints.lg)
      setIsDesktop(width >= breakpoints.lg && width < breakpoints.xl)
      setIsLargeDesktop(width >= breakpoints.xl)
    }

    // Initial check
    handleResize()

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isBreakpoint = (bp: Breakpoint) => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 0
    return width >= breakpoints[bp]
  }

  const isBetweenBreakpoints = (start: Breakpoint, end: Breakpoint) => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 0
    return width >= breakpoints[start] && width < breakpoints[end]
  }

  return {
    // Current breakpoint
    breakpoint: currentBreakpoint,
    
    // Device type flags
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    
    // Breakpoint utilities
    isBreakpoint,
    isBetweenBreakpoints,
    
    // Raw breakpoint values
    breakpoints,
  }
} 