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
    // Primary brand colors (dev-guidelines compliant)
    primary: "#8A2B85",      // Purple (Primary Accent) 
    background: "#141414",   // True Black (Base)
    text: "#F8F4EB",        // Canvas/Off-white (Text Contrast)
    accent: "#DAD7CE",      // Support Accent (Stone Grey)
    
    // Extended palette for UI components
    surface: "#1E1E1E",     // Sidebar/card backgrounds
    textMuted: "#C7C7C7",   // Secondary text
    textPrimary: "#F0F0F0", // Primary text (slightly warmer than canvas)
    border: "rgba(138, 43, 133, 0.2)", // Purple with opacity
    error: "#BA0C2F",       // Error/destructive actions
  },
  
  spacing: {
    xs: "0.25rem",    // 4px
    sm: "0.5rem",     // 8px
    md: "1rem",       // 16px
    lg: "1.5rem",     // 24px
    xl: "2rem",       // 32px
    "2xl": "3rem",    // 48px
    "3xl": "4rem",    // 64px
  },
  
  borderRadius: {
    sm: "0.5rem",     // 8px
    md: "0.75rem",    // 12px
    lg: "1rem",       // 16px
    xl: "1.25rem",    // 20px
  },
  
  typography: {
    fontFamily: {
      body: "'Inter', 'Helvetica', 'Arial', sans-serif",
      heading: "'Helvetica', 'Arial', sans-serif",
    },
    fontSize: {
      xs: "0.75rem",    // 12px
      sm: "0.875rem",   // 14px
      base: "1rem",     // 16px
      lg: "1.125rem",   // 18px
      xl: "1.25rem",    // 20px
      "2xl": "1.5rem",  // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
    },
    lineHeight: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.75",
    }
  },
  
  animation: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    easing: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    }
  }
}

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

export default theme 