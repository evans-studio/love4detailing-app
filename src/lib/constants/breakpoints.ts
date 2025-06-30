// Breakpoint values in pixels
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

// Media query strings for use with CSS-in-JS
export const mediaQueries = {
  sm: `@media (min-width: ${breakpoints.sm}px)`,
  md: `@media (min-width: ${breakpoints.md}px)`,
  lg: `@media (min-width: ${breakpoints.lg}px)`,
  xl: `@media (min-width: ${breakpoints.xl}px)`,
  '2xl': `@media (min-width: ${breakpoints.xl}px)`,
} as const

// Tailwind class helpers for common responsive patterns
export const responsiveClasses = {
  // Container widths
  container: 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
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
  section: 'py-12 sm:py-16 lg:py-20',
  sectionInner: 'space-y-8 sm:space-y-10 md:space-y-12',
  gap: 'gap-4 sm:gap-6 md:gap-8',
  
  // Grid layouts - Mobile first
  grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8',
  gridWide: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8',
  gridNarrow: 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6',
  
  // Flex layouts - Mobile first
  flexCenter: 'flex items-center justify-center',
  flexStart: 'flex items-center',
  flexEnd: 'flex flex-col items-end space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4',
  flexBetween: 'flex items-center justify-between',
  
  // Touch targets - Consistent across breakpoints
  touchTarget: 'flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#9747FF]/10 transition-colors',
  
  // Form elements - Mobile first
  input: 'w-full min-h-[44px] px-4 py-2 rounded-lg text-base sm:text-lg',
  button: 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors',
  buttonPrimary: 'bg-[#9747FF] text-white hover:bg-[#8532FF]',
  buttonSecondary: 'bg-[#262626] text-white/80 hover:bg-[#9747FF]/10 hover:text-white',
  
  // Cards - Mobile first
  card: 'bg-[#262626] border border-[#9747FF]/20 rounded-lg overflow-hidden',
  cardBody: 'p-6',
  cardHover: 'p-4 sm:p-6 md:p-8 rounded-lg border border-[#8A2B85]/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-200',
  
  // Images - Mobile first
  responsiveImage: 'w-full h-auto object-cover rounded-lg',
  avatar: 'w-10 h-10 border-2 border-[#9747FF]/20',
  
  // Sidebar - Mobile first
  sidebar: 'fixed inset-y-0 left-0 z-50 w-64 bg-[#141414] border-r border-[#9747FF]/20 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0',
  sidebarCollapsed: '-translate-x-full lg:w-20',
  
  // Navigation - Mobile first
  nav: 'fixed top-0 left-0 right-0 h-16 z-40 bg-[#141414]/80 backdrop-blur-md border-b border-[#8A2B85]/20',
  navItem: 'flex items-center px-3 py-2 text-sm font-medium text-white/80 rounded-lg hover:bg-[#9747FF]/10 hover:text-white transition-colors',
  navItemActive: 'bg-[#9747FF]/20 text-white',
  
  // Modals - Mobile first
  modal: 'w-[calc(100vw-2rem)] sm:w-[500px] p-4 sm:p-6 md:p-8 rounded-lg bg-[#141414] border border-[#8A2B85]/20',
  modalOverlay: 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
  
  // Lists - Mobile first
  list: 'space-y-1',
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
  
  // Forms
  formGroup: 'space-y-2',
  formLabel: 'block text-sm font-medium text-white/80',
  formInput: 'w-full px-3 py-2 bg-[#262626] border border-[#9747FF]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9747FF]/50',
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