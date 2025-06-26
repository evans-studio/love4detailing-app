// Breakpoint values in pixels
export const breakpoints = {
  xs: 375,
  sm: 600,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1440,
} as const

// Media query strings for use with CSS-in-JS
export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs}px)`,
  sm: `@media (min-width: ${breakpoints.sm}px)`,
  md: `@media (min-width: ${breakpoints.md}px)`,
  lg: `@media (min-width: ${breakpoints.lg}px)`,
  xl: `@media (min-width: ${breakpoints.xl}px)`,
  xxl: `@media (min-width: ${breakpoints.xxl}px)`,
} as const

// Tailwind class helpers for common responsive patterns
export const responsiveClasses = {
  // Container widths
  container: 'w-full max-w-[100vw] px-4 mx-auto sm:px-6 lg:px-8',
  
  // Text sizes
  heading1: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
  heading2: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
  heading3: 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
  body: 'text-sm sm:text-base',
  small: 'text-xs sm:text-sm',
  
  // Spacing
  section: 'py-8 sm:py-12 md:py-16 lg:py-20',
  sectionInner: 'space-y-6 sm:space-y-8 md:space-y-10',
  
  // Grid layouts
  grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8',
  
  // Flex layouts
  flexCenter: 'flex flex-col items-center sm:flex-row sm:justify-between',
  
  // Touch targets
  touchTarget: 'min-h-[44px] min-w-[44px]',
  
  // Form elements
  input: 'w-full min-h-[44px] px-4 rounded-lg',
  button: 'min-h-[44px] px-6 rounded-lg',
  
  // Cards
  card: 'p-4 sm:p-6 rounded-lg border border-[#8A2B85]/20',
  
  // Images
  responsiveImage: 'w-full h-auto object-cover',
  
  // Sidebar
  sidebar: 'w-full sm:max-w-[320px] lg:max-w-[360px]',
  
  // Navigation
  nav: 'fixed top-0 left-0 right-0 h-16 z-40',
  
  // Modals
  modal: 'w-[90vw] max-w-[500px] p-4 sm:p-6',
} as const

// Z-index scale
export const zIndex = {
  base: 0,
  above: 1,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  drawer: 40,
  modal: 50,
  popover: 60,
  toast: 70,
  tooltip: 80,
} as const 