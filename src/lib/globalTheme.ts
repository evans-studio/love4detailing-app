// Global Theme System - Love4Detailing
// Centralized styling configuration following dev-guidelines.md specifications

export const globalTheme = {
  // Brand Colors (Dev Guidelines Compliant)
  colors: {
    // Primary brand colors
    primary: '#9747FF',           // Brand purple
    secondary: '#141414',         // True Black (Base)
    accent: '#F8F4EB',           // Canvas/Off-white (Text Contrast)  
    muted: '#DAD7CE',            // Stone Grey (Support Accent)
    
    // Extended palette
    background: '#141414',
    surface: '#1E1E1E',
    surfaceLight: '#262626',
    text: '#F0F0F0',
    textMuted: '#C7C7C7',
    textContrast: '#F8F4EB',
    
    // State colors
    error: '#BA0C2F',
    success: '#28C76F',
    warning: '#FFA726',
    info: '#29B6F6',
    
    // Purple variations
    purple: {
      50: 'rgba(138, 43, 133, 0.05)',
      100: 'rgba(138, 43, 133, 0.1)',
      200: 'rgba(138, 43, 133, 0.2)',
      300: 'rgba(138, 43, 133, 0.3)',
      400: 'rgba(138, 43, 133, 0.4)',
      500: '#8A2B85',
      600: '#7A2676',
      700: '#6A2167',
      800: '#5A1C58',
      900: '#4A1749'
    }
  },

  // Typography System
  typography: {
    fontFamily: {
      heading: "'Helvetica', 'Arial', sans-serif",
      body: "'Inter', 'Helvetica', 'Arial', sans-serif"
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
      '5xl': '3rem',
      '6xl': '3.75rem'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.6'
    },
    letterSpacing: {
      normal: '0',
      wide: '0.02em',
      wider: '0.05em'
    }
  },

  // Spacing System
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

  // Border Radius - Standardized to lg (1rem)
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

  // Shadows
  shadows: {
    card: '0 4px 16px rgba(20, 20, 20, 0.4)',
    button: '0 2px 8px rgba(138, 43, 133, 0.3)',
    buttonHover: '0 4px 16px rgba(138, 43, 133, 0.5)',
    purpleGlow: '0 0 20px rgba(138, 43, 133, 0.4)',
    glass: '0 8px 32px rgba(20, 20, 20, 0.6)',
    modal: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
  },

  // Animation System
  animations: {
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

  // Component Styles
  components: {
    // Button variants
    button: {
      primary: {
        background: 'linear-gradient(135deg, #8A2B85 0%, #7A2676 100%)',
        color: '#F8F4EB',
        border: 'none',
        boxShadow: '0 2px 8px rgba(138, 43, 133, 0.3)',
        hover: {
          boxShadow: '0 4px 16px rgba(138, 43, 133, 0.5)',
          transform: 'translateY(-1px)'
        }
      },
      secondary: {
        background: 'transparent',
        color: '#8A2B85',
        border: '2px solid #8A2B85',
        hover: {
          background: '#8A2B85',
          color: '#F8F4EB'
        }
      },
      ghost: {
        background: 'transparent',
        color: '#F8F4EB',
        border: '2px solid rgba(138, 43, 133, 0.3)',
        hover: {
          background: 'rgba(138, 43, 133, 0.1)',
          borderColor: '#8A2B85'
        }
      }
    },

    // Card styles
    card: {
      default: {
        background: 'rgba(30, 30, 30, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(138, 43, 133, 0.2)',
        borderRadius: '1rem',
        boxShadow: '0 4px 16px rgba(20, 20, 20, 0.4)'
      },
      glass: {
        background: 'rgba(20, 20, 20, 0.85)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(138, 43, 133, 0.2)',
        borderRadius: '1rem',
        boxShadow: '0 8px 32px rgba(20, 20, 20, 0.6)'
      }
    },

    // Input styles
    input: {
      default: {
        background: '#141414',
        color: '#F8F4EB',
        border: '2px solid rgba(138, 43, 133, 0.3)',
        borderRadius: '1rem',
        padding: '0.75rem 1rem',
        focus: {
          borderColor: '#8A2B85',
          boxShadow: '0 0 0 3px rgba(138, 43, 133, 0.1)'
        }
      }
    },

    // Navigation styles
    navigation: {
      sidebar: {
        background: 'linear-gradient(135deg, #141414 0%, #1E1E1E 100%)',
        border: '1px solid rgba(138, 43, 133, 0.2)',
        item: {
          default: {
            color: '#C7C7C7',
            hover: {
              background: 'rgba(138, 43, 133, 0.1)',
              color: '#F8F4EB'
            }
          },
          active: {
            background: 'rgba(138, 43, 133, 0.2)',
            color: '#8A2B85',
            border: '1px solid rgba(138, 43, 133, 0.3)'
          }
        }
      },
      topBar: {
        background: 'rgba(20, 20, 20, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(138, 43, 133, 0.2)'
      }
    },

    // Modal styles
    modal: {
      overlay: {
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)'
      },
      content: {
        background: 'linear-gradient(135deg, #141414 0%, #1E1E1E 100%)',
        border: '1px solid rgba(138, 43, 133, 0.2)',
        borderRadius: '1.25rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
      }
    }
  },

  // Breakpoints
  breakpoints: {
    mobile: '640px',
    tablet: '768px', 
    desktop: '1024px',
    wide: '1280px',
    ultrawide: '1536px'
  }
} as const

// CSS Custom Properties Generator
export const generateCSSCustomProperties = () => {
  return `
    :root {
      /* Colors */
      --color-primary: ${globalTheme.colors.primary};
      --color-secondary: ${globalTheme.colors.secondary};
      --color-accent: ${globalTheme.colors.accent};
      --color-muted: ${globalTheme.colors.muted};
      --color-background: ${globalTheme.colors.background};
      --color-surface: ${globalTheme.colors.surface};
      --color-text: ${globalTheme.colors.text};
      --color-text-muted: ${globalTheme.colors.textMuted};
      
      /* Typography */
      --font-heading: ${globalTheme.typography.fontFamily.heading};
      --font-body: ${globalTheme.typography.fontFamily.body};
      
      /* Spacing */
      --spacing-xs: ${globalTheme.spacing.xs};
      --spacing-sm: ${globalTheme.spacing.sm};
      --spacing-md: ${globalTheme.spacing.md};
      --spacing-lg: ${globalTheme.spacing.lg};
      --spacing-xl: ${globalTheme.spacing.xl};
      
      /* Border Radius */
      --radius-sm: ${globalTheme.borderRadius.sm};
      --radius-base: ${globalTheme.borderRadius.base};
      --radius-md: ${globalTheme.borderRadius.md};
      --radius-lg: ${globalTheme.borderRadius.lg};
      --radius-xl: ${globalTheme.borderRadius.xl};
      
      /* Shadows */
      --shadow-card: ${globalTheme.shadows.card};
      --shadow-button: ${globalTheme.shadows.button};
      --shadow-button-hover: ${globalTheme.shadows.buttonHover};
      --shadow-purple-glow: ${globalTheme.shadows.purpleGlow};
      --shadow-glass: ${globalTheme.shadows.glass};
      
      /* Animation */
      --duration-fast: ${globalTheme.animations.duration.fast};
      --duration-normal: ${globalTheme.animations.duration.normal};
      --duration-slow: ${globalTheme.animations.duration.slow};
      --easing-default: ${globalTheme.animations.easing.default};
    }
  `
}

// Component class generators
export const getButtonClasses = (variant: 'primary' | 'secondary' | 'ghost' = 'primary') => {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:pointer-events-none disabled:opacity-50'
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 to-purple-600 text-canvas-white shadow-button hover:shadow-button-hover hover:-translate-y-0.5',
    secondary: 'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-canvas-white',
    ghost: 'bg-transparent text-canvas-white border-2 border-purple-300 hover:bg-purple-100 hover:border-primary'
  }
  
  return `${base} ${variants[variant]}`
}

export const getCardClasses = (variant: 'default' | 'glass' = 'default') => {
  const base = 'rounded-lg border transition-all duration-300'
  
  const variants = {
    default: 'bg-surface/80 backdrop-blur-sm border-purple-200 shadow-card hover:border-purple-300',
    glass: 'bg-background/85 backdrop-blur-md border-purple-200 shadow-glass hover:shadow-purple-glow'
  }
  
  return `${base} ${variants[variant]}`
}

export const getInputClasses = () => {
  return 'w-full bg-background text-canvas-white border-2 border-muted rounded-base px-4 py-3 placeholder-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-purple-100 transition-all duration-300'
}

export const getNavItemClasses = (isActive: boolean = false) => {
  const base = 'flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-300'
  
  if (isActive) {
    return `${base} bg-purple-100 text-primary border-l-4 border-primary`
  }
  
  return `${base} text-text-muted hover:bg-purple-100 hover:text-primary`
} 