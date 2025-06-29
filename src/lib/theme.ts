/**
 * Love4Detailing Theme Utilities
 * Based on dev-guidelines.md specifications
 * 
 * Brand Colors (Dev Guidelines):
 * - Purple (Primary Accent): #8A2B85
 * - True Black (Base): #141414  
 * - Canvas/Off-white (Text Contrast): #F8F4EB
 * - Support Accent (Subtle): #DAD7CE (Stone Grey)
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Core theme configuration based on dev-guidelines.md
export const theme = {
  colors: {
    primary: '#8A2B85',
    secondary: '#141414',
    accent: '#F8F4EB',
    muted: '#C7C7C7',
    background: '#141414',
    surface: '#262626',
    text: '#F8F4EB',
    textMuted: '#C7C7C7',
    error: '#BA0C2F',
    success: '#28C76F',
    warning: '#FFA726',
    info: '#29B6F6',
    purple: {
      50: 'rgba(151, 71, 255, 0.05)',
      100: 'rgba(151, 71, 255, 0.1)',
      200: 'rgba(151, 71, 255, 0.2)',
      300: 'rgba(151, 71, 255, 0.3)',
      400: 'rgba(151, 71, 255, 0.4)',
      500: '#9747FF',
      600: '#8532FF',
      700: '#721DFF',
      800: '#5F08FF',
      900: '#4C00F2',
    }
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
    '5xl': '8rem'
  },
  
  borderRadius: {
    none: '0',
    sm: '0.75rem',
    base: '1rem',
    md: '1rem',
    lg: '1rem',
    xl: '1rem',
    '2xl': '1.25rem',
    full: '9999px'
  },
  
  typography: {
    fontFamily: {
      heading: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      body: ['var(--font-sans)', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    }
  },
  
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '750ms'
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      gsap: 'Power2.easeOut'
    }
  },
  
  shadows: {
    card: '0 4px 16px rgba(20, 20, 20, 0.4)',
    button: '0 2px 8px rgba(138, 43, 133, 0.3)',
    buttonHover: '0 4px 16px rgba(138, 43, 133, 0.5)',
    purpleGlow: '0 0 20px rgba(138, 43, 133, 0.4)',
    glass: '0 8px 32px rgba(20, 20, 20, 0.6)',
    modal: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
  },
  
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
} as const

// Component style variants following dev-guidelines
export const themeVariants = {
  button: {
    base: "inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    
    variant: {
      primary: "bg-[#8A2B85] text-canvas-white hover:bg-[#8A2B85]/90 shadow-lg hover:shadow-purple-glow",
      secondary: "bg-true-black text-canvas-white border border-[#8A2B85] hover:bg-[#8A2B85] hover:text-canvas-white",
      ghost: "text-canvas-white hover:bg-[#8A2B85]/10 hover:text-[#8A2B85]",
      glass: "bg-true-black/50 backdrop-blur-sm text-canvas-white border border-[#8A2B85]/30 hover:bg-[#8A2B85]/20",
      premium: "bg-gradient-to-r from-[#8A2B85] to-rich-crimson text-canvas-white hover:shadow-purple-glow hover:scale-105",
    },
    
    size: {
      sm: "h-8 px-3 text-sm rounded-md",
      md: "h-10 px-4 text-sm rounded-md", 
      lg: "h-12 px-6 text-base rounded-lg",
      icon: "h-10 w-10 rounded-md",
    }
  },
  
  card: {
    base: "rounded-lg border transition-all duration-300",
    
    variant: {
      default: "bg-sidebar-bg border-[#8A2B85]/20 text-primary-text shadow-sm hover:shadow-md",
      glass: "bg-true-black/50 backdrop-blur-sm border-[#8A2B85]/30 text-primary-text hover:shadow-purple-glow",
      gradient: "bg-gradient-to-br from-sidebar-bg to-true-black border-[#8A2B85]/40 text-primary-text",
      elevated: "bg-sidebar-bg border-[#8A2B85]/30 text-primary-text shadow-lg hover:shadow-purple-glow",
    }
  },
  
  input: {
    base: "flex w-full rounded-md border px-3 py-2 text-sm transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    
    variant: {
      default: "bg-true-black border-stone-grey text-canvas-white placeholder:text-secondary-text focus:border-[#8A2B85] focus:ring-[#8A2B85]/20",
      glass: "bg-true-black/50 backdrop-blur-sm border-[#8A2B85]/30 text-canvas-white placeholder:text-secondary-text focus:border-[#8A2B85]",
      minimal: "bg-transparent border-transparent border-b-2 border-stone-grey rounded-none text-canvas-white placeholder:text-secondary-text focus:border-[#8A2B85]",
    }
  },
  
  text: {
    variant: {
      heading: "font-bold text-primary-text font-heading",
      body: "text-secondary-text font-body leading-relaxed",
      muted: "text-secondary-text/70 font-body",
      accent: "text-[#8A2B85] font-medium",
      contrast: "text-canvas-white font-body",
    },
    
    size: {
      xs: "text-xs",
      sm: "text-sm", 
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
    }
  }
}

// Glassmorphism utility (dev-guidelines approved)
export const glassmorphism = {
  light: "bg-true-black/30 backdrop-blur-sm border border-[#8A2B85]/20",
  medium: "bg-true-black/50 backdrop-blur-md border border-[#8A2B85]/30", 
  heavy: "bg-true-black/70 backdrop-blur-lg border border-[#8A2B85]/40",
  modal: "bg-true-black/80 backdrop-blur-xl border border-[#8A2B85]/50",
}

// Animation presets for GSAP (dev-guidelines compliant)
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  
  slideUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  
  slideLeft: {
    initial: { opacity: 0, x: -300 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  
  glow: {
    initial: { boxShadow: "0 0 0 rgba(138, 43, 133, 0)" },
    animate: { boxShadow: "0 0 20px rgba(138, 43, 133, 0.4)" },
    transition: { duration: 0.3, ease: "easeOut" }
  }
}

// Responsive breakpoints (dev-guidelines mobile-first)
export const breakpoints = {
  mobile: "640px",   // sm
  tablet: "768px",   // md  
  desktop: "1024px", // lg
  wide: "1280px",    // xl
}

// Utility function for consistent class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Theme-aware component builder
export function createThemeComponent(baseClasses: string, variants?: Record<string, string>) {
  return function(variant?: string, className?: string) {
    const variantClass = variants && variant ? variants[variant] : ""
    return cn(baseClasses, variantClass, className)
  }
}

// Background patterns (dev-guidelines approved)
export const backgrounds = {
  app: "bg-true-black",
  sidebar: "bg-gradient-to-b from-true-black to-sidebar-bg",
  card: "bg-sidebar-bg/50 backdrop-blur-sm",
  modal: "bg-true-black/90 backdrop-blur-lg",
  surface: "bg-sidebar-bg",
  accent: "bg-gradient-to-r from-deep-purple/10 to-transparent",
}

// Shadow utilities (dev-guidelines compliant)
export const shadows = {
  card: "shadow-lg shadow-true-black/50",
  button: "shadow-md shadow-deep-purple/20",
  glow: "shadow-xl shadow-deep-purple/40",
  modal: "shadow-2xl shadow-true-black/80",
}

// CSS Custom Properties Generator
export const generateCSSCustomProperties = () => {
  return `
    :root {
      /* Colors */
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-accent: ${theme.colors.accent};
      --color-muted: ${theme.colors.muted};
      --color-background: ${theme.colors.background};
      --color-surface: ${theme.colors.surface};
      --color-text: ${theme.colors.text};
      --color-text-muted: ${theme.colors.textMuted};
      --color-error: ${theme.colors.error};
      --color-success: ${theme.colors.success};
      --color-warning: ${theme.colors.warning};
      --color-info: ${theme.colors.info};
      
      /* Purple Scale */
      --purple-50: ${theme.colors.purple[50]};
      --purple-100: ${theme.colors.purple[100]};
      --purple-200: ${theme.colors.purple[200]};
      --purple-300: ${theme.colors.purple[300]};
      --purple-400: ${theme.colors.purple[400]};
      --purple-500: ${theme.colors.purple[500]};
      --purple-600: ${theme.colors.purple[600]};
      --purple-700: ${theme.colors.purple[700]};
      --purple-800: ${theme.colors.purple[800]};
      --purple-900: ${theme.colors.purple[900]};
      
      /* Typography */
      --font-heading: ${theme.typography.fontFamily.heading.join(', ')};
      --font-body: ${theme.typography.fontFamily.body.join(', ')};
      
      /* Spacing */
      --spacing-xs: ${theme.spacing.xs};
      --spacing-sm: ${theme.spacing.sm};
      --spacing-md: ${theme.spacing.md};
      --spacing-lg: ${theme.spacing.lg};
      --spacing-xl: ${theme.spacing.xl};
      --spacing-2xl: ${theme.spacing['2xl']};
      --spacing-3xl: ${theme.spacing['3xl']};
      --spacing-4xl: ${theme.spacing['4xl']};
      --spacing-5xl: ${theme.spacing['5xl']};
      
      /* Border Radius */
      --radius-none: ${theme.borderRadius.none};
      --radius-sm: ${theme.borderRadius.sm};
      --radius-base: ${theme.borderRadius.base};
      --radius-md: ${theme.borderRadius.md};
      --radius-lg: ${theme.borderRadius.lg};
      --radius-xl: ${theme.borderRadius.xl};
      --radius-2xl: ${theme.borderRadius['2xl']};
      --radius-full: ${theme.borderRadius.full};
      
      /* Shadows */
      --shadow-card: ${theme.shadows.card};
      --shadow-button: ${theme.shadows.button};
      --shadow-button-hover: ${theme.shadows.buttonHover};
      --shadow-purple-glow: ${theme.shadows.purpleGlow};
      --shadow-glass: ${theme.shadows.glass};
      --shadow-modal: ${theme.shadows.modal};
      
      /* Animation */
      --duration-fast: ${theme.animation.duration.fast};
      --duration-normal: ${theme.animation.duration.normal};
      --duration-slow: ${theme.animation.duration.slow};
      --duration-slower: ${theme.animation.duration.slower};
      
      --ease-default: ${theme.animation.easing.default};
      --ease-in: ${theme.animation.easing.in};
      --ease-out: ${theme.animation.easing.out};
      --ease-in-out: ${theme.animation.easing.inOut};
      --ease-gsap: ${theme.animation.easing.gsap};
      
      /* Breakpoints */
      --breakpoint-xs: ${theme.breakpoints.xs};
      --breakpoint-sm: ${theme.breakpoints.sm};
      --breakpoint-md: ${theme.breakpoints.md};
      --breakpoint-lg: ${theme.breakpoints.lg};
      --breakpoint-xl: ${theme.breakpoints.xl};
      --breakpoint-2xl: ${theme.breakpoints['2xl']};
    }
  `
}

// Export types for TypeScript support
export type Theme = typeof theme
export type ThemeColors = keyof typeof theme.colors
export type ThemeSpacing = keyof typeof theme.spacing
export type ThemeBorderRadius = keyof typeof theme.borderRadius
export type ThemeShadows = keyof typeof theme.shadows
export type ThemeBreakpoints = keyof typeof theme.breakpoints

export default theme 