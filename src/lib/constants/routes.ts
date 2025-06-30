export const ROUTES = {
  // Public routes
  home: '/',
  book: '/book',
  confirmation: '/confirmation',
  
  // Auth routes
  signIn: '/auth/signin',
  signUp: '/auth/signup',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  
  // Dashboard routes
  dashboard: '/dashboard',
  dashboardBook: '/dashboard/book',
  dashboardBookings: '/dashboard/bookings',
  dashboardProfile: '/dashboard/profile',
  dashboardVehicles: '/dashboard/vehicles',
  dashboardRewards: '/dashboard/rewards',
  
  // Admin routes
  admin: '/dashboard/admin',
  adminBookings: '/dashboard/admin/bookings',
  adminCustomers: '/dashboard/admin/customers',
  adminServices: '/dashboard/admin/services',
  adminSettings: '/dashboard/admin/settings',
  
  // API routes
  api: {
    bookings: '/api/bookings',
    vehicleLookup: '/api/vehicle/lookup',
    availableSlots: '/api/available-slots',
    upload: '/api/upload',
    rewards: '/api/rewards'
  }
} as const

export type AppRoute = typeof ROUTES[keyof typeof ROUTES]

// Route metadata for SEO and navigation
export const ROUTE_METADATA = {
  [ROUTES.home]: {
    title: 'Love4Detailing - Professional Car Valeting Services',
    description: 'Premium car detailing and valeting services in Brighton & Hove'
  },
  [ROUTES.book]: {
    title: 'Book a Service | Love4Detailing',
    description: 'Book your professional car valeting service online'
  },
  [ROUTES.confirmation]: {
    title: 'Booking Confirmed | Love4Detailing',
    description: 'Your car valeting service booking has been confirmed'
  },
  [ROUTES.dashboard]: {
    title: 'Dashboard | Love4Detailing',
    description: 'Manage your bookings and account'
  },
  [ROUTES.dashboardBookings]: {
    title: 'My Bookings | Love4Detailing',
    description: 'View and manage your car valeting bookings'
  }
} as const

// Route access control
export const PROTECTED_ROUTES = [
  ROUTES.dashboard,
  ROUTES.dashboardBook,
  ROUTES.dashboardBookings,
  ROUTES.dashboardProfile,
  ROUTES.dashboardVehicles,
  ROUTES.dashboardRewards
]

export const ADMIN_ROUTES = [
  ROUTES.admin,
  ROUTES.adminBookings,
  ROUTES.adminCustomers,
  ROUTES.adminServices,
  ROUTES.adminSettings
] 