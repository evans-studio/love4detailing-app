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
  container: 'w-full max-w-[100vw] px-4 mx-auto sm:px-6 lg:px-8 xl:max-w-7xl',
  containerNarrow: 'w-full max-w-[100vw] px-4 mx-auto sm:px-6 lg:px-8 xl:max-w-5xl',
  
  // Text sizes - Mobile first
  heading1: 'text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl',
  heading2: 'text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl',
  heading3: 'text-xl font-bold tracking-tight sm:text-2xl md:text-3xl lg:text-4xl',
  heading4: 'text-lg font-semibold sm:text-xl md:text-2xl',
  body: 'text-base sm:text-lg',
  small: 'text-sm sm:text-base',
  tiny: 'text-xs sm:text-sm',
  
  // Spacing - Mobile first
  section: 'py-10 sm:py-12 md:py-16 lg:py-20',
  sectionInner: 'space-y-8 sm:space-y-10 md:space-y-12',
  gap: 'gap-4 sm:gap-6 md:gap-8',
  
  // Grid layouts - Mobile first
  grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8',
  gridWide: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8',
  gridNarrow: 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6',
  
  // Flex layouts - Mobile first
  flexCenter: 'flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-between',
  flexStart: 'flex flex-col items-start space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4',
  flexEnd: 'flex flex-col items-end space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4',
  
  // Touch targets - Consistent across breakpoints
  touchTarget: 'min-h-[44px] min-w-[44px] flex items-center justify-center',
  
  // Form elements - Mobile first
  input: 'w-full min-h-[44px] px-4 py-2 rounded-lg text-base sm:text-lg',
  button: 'min-h-[44px] px-4 sm:px-6 py-2 rounded-lg text-base sm:text-lg flex items-center justify-center',
  
  // Cards - Mobile first
  card: 'p-4 sm:p-6 md:p-8 rounded-lg border border-[#8A2B85]/20 bg-white/5 backdrop-blur-sm',
  cardHover: 'p-4 sm:p-6 md:p-8 rounded-lg border border-[#8A2B85]/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-200',
  
  // Images - Mobile first
  responsiveImage: 'w-full h-auto object-cover rounded-lg',
  avatar: 'w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover',
  
  // Sidebar - Mobile first
  sidebar: 'fixed inset-y-0 left-0 z-40 w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[360px] bg-[#141414] border-r border-[#8A2B85]/20',
  sidebarCollapsed: 'fixed inset-y-0 left-0 z-40 w-16 bg-[#141414] border-r border-[#8A2B85]/20',
  
  // Navigation - Mobile first
  nav: 'fixed top-0 left-0 right-0 h-16 z-40 bg-[#141414]/80 backdrop-blur-md border-b border-[#8A2B85]/20',
  navItem: 'min-h-[44px] px-4 flex items-center gap-2 rounded-lg hover:bg-[#8A2B85]/10 transition-colors duration-200',
  navItemActive: 'min-h-[44px] px-4 flex items-center gap-2 rounded-lg bg-[#8A2B85]/20 text-[#8A2B85]',
  
  // Modals - Mobile first
  modal: 'w-[calc(100vw-2rem)] sm:w-[500px] p-4 sm:p-6 md:p-8 rounded-lg bg-[#141414] border border-[#8A2B85]/20',
  modalOverlay: 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
  
  // Lists - Mobile first
  list: 'space-y-2 sm:space-y-3',
  listItem: 'flex items-center gap-2',
  
  // Tables - Mobile first
  table: 'w-full border-collapse',
  tableCell: 'p-2 sm:p-3 border-b border-[#8A2B85]/20',
  tableHeader: 'p-2 sm:p-3 text-left font-semibold border-b border-[#8A2B85]/20',
  
  // Animations
  fadeIn: 'animate-fadeIn',
  slideIn: 'animate-slideIn',
  
  // Glassmorphism
  glass: 'bg-white/5 backdrop-blur-md border border-white/10',
  glassHover: 'bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-200',
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