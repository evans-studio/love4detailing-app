/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        xs: '375px',
        sm: '600px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
      },
    },
    extend: {
      screens: {
        xs: '375px',
        sm: '600px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
      },
      colors: {
        // Final Color Palette Specification (Dev Guidelines Compliant)
        'true-black': '#141414',        // Primary Background (app shell) - Dev Guidelines
        'deep-purple': '#8A2B85',       // Primary Accent (buttons, icons, highlights) - Dev Guidelines
        'canvas-white': '#F8F4EB',      // Canvas/Off-white (Text Contrast) - Dev Guidelines
        'stone-grey': '#DAD7CE',        // Support Accent (Subtle) - Dev Guidelines
        'rich-crimson': '#BA0C2F',      // Secondary Accent (hover states, subtle highlights)
        'platinum-silver': '#E8E8EA',   // Supporting Accent (ratings, status, secondary elements)
        'primary-text': '#F0F0F0',      // Primary Text (on dark background)
        'secondary-text': '#C7C7C7',    // Secondary Text and Subtle Labels
        'sidebar-bg': '#1E1E1E',        // Sidebar background
        
        // Legacy aliases for compatibility
        'deep-black': '#141414',
        'accent-purple': '#8A2B85',
        'mid-purple': '#3B1040',
        'overlay-purple-black': '#1E0A1F',
        'soft-silver': '#8A8D8F',
        'midnight-black': '#141414',
        'primary-purple': '#8A2B85',
        'crimson-alert': '#BA0C2F',
        
        // UI Colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#8A2B85",
          foreground: "#F8F4EB",
        },
        secondary: {
          DEFAULT: "#141414",
          foreground: "#F8F4EB",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        // Approved Gradient (for section backgrounds only)
        'approved-gradient': 'linear-gradient(135deg, #141414 0%, #1C0F1C 100%)',
        'sidebar-gradient': 'linear-gradient(135deg, #141414 0%, #1E1E1E 100%)',
        
        // Legacy gradients for compatibility
        'brand-gradient': 'linear-gradient(135deg, #141414 0%, #3B1040 50%, #8A2B85 100%)',
        'brand-gradient-reverse': 'linear-gradient(135deg, #8A2B85 0%, #3B1040 50%, #141414 100%)',
        'brand-gradient-vertical': 'linear-gradient(180deg, #141414 0%, #3B1040 50%, #8A2B85 100%)',
        'brand-gradient-radial': 'radial-gradient(circle at center, #8A2B85 0%, #3B1040 40%, #141414 100%)',
        'brand-gradient-subtle': 'linear-gradient(135deg, #141414 0%, #1E0A1F 30%, #3B1040 70%, #8A2B85 100%)',
        'brand-gradient-overlay': 'linear-gradient(135deg, #1E0A1F 0%, #3B1040 50%, #141414 100%)',
        
        // Utility Gradients
        'card-gradient': 'linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(59, 16, 64, 0.3) 50%, rgba(138, 43, 133, 0.1) 100%)',
        'modal-gradient': 'linear-gradient(135deg, rgba(20, 20, 20, 0.98) 0%, rgba(30, 10, 31, 0.95) 100%)',
        
        // Legacy gradients for compatibility
        'gradient-primary': 'linear-gradient(135deg, #8A2B85 0%, #6B1F66 100%)',
        'gradient-dark': 'linear-gradient(135deg, #141414 0%, #1A1A1A 50%, #202020 100%)',
        'gradient-surface': 'linear-gradient(135deg, #1A1A1A 0%, #202020 100%)',
        'gradient-purple-fade': 'linear-gradient(135deg, #141414 0%, rgba(138, 43, 133, 0.1) 100%)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // Legacy
        'card': 'calc(var(--radius) + 0.25rem)',
      },
      boxShadow: {
        // Legacy shadows for compatibility
        card: "0 4px 16px rgba(20, 20, 20, 0.4)",
        button: "0 2px 8px rgba(138, 43, 133, 0.3)",
        'button-hover': "0 4px 16px rgba(138, 43, 133, 0.5)",
        'purple-glow': "0 0 20px rgba(138, 43, 133, 0.4)",
        'crimson-glow': "0 0 16px rgba(186, 12, 47, 0.4)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "purple-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 20px rgba(138, 43, 133, 0.3)",
            transform: "translateZ(0)"
          },
          "50%": { 
            boxShadow: "0 0 30px rgba(138, 43, 133, 0.5)",
            transform: "translateZ(0)"
          },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "purple-glow": "purple-glow 2s ease-in-out infinite",
        "gradient-shift": "gradient-shift 6s ease-in-out infinite",
        "shimmer": "shimmer 2s infinite",
      },
      transitionProperty: {
        'smooth': 'all',
      },
      transitionDuration: {
        'smooth': '300ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      fontFamily: {
        'heading': ['Helvetica', 'Arial', 'sans-serif'],
        'sans': ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
      },
      spacing: {
        'touch': '44px', // Minimum touch target size
      },
      minHeight: {
        'touch': '44px', // Minimum touch target size
      },
      minWidth: {
        'touch': '44px', // Minimum touch target size
      },
      zIndex: {
        'base': '0',
        'above': '1',
        'dropdown': '10',
        'sticky': '20',
        'fixed': '30',
        'drawer': '40',
        'modal': '50',
        'popover': '60',
        'toast': '70',
        'tooltip': '80',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 