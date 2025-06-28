export const BRAND = {
  colors: {
    primary: '#8A2B85',
    black: '#141414',
    offWhite: '#F8F4EB',
  },
  name: 'Love4Detailing',
  description: 'Professional Car Detailing Services',
}

export const SERVICES = {
  types: ['Essential Clean', 'Premium Detail', 'Ultimate Protection'],
  sizes: ['Small', 'Medium', 'Large', 'Van/SUV'],
  pricing: {
    'Essential Clean': {
      Small: 30,
      Medium: 40,
      Large: 50,
      'Van/SUV': 60,
    },
    'Premium Detail': {
      Small: 50,
      Medium: 60,
      Large: 70,
      'Van/SUV': 80,
    },
    'Ultimate Protection': {
      Small: 70,
      Medium: 80,
      Large: 90,
      'Van/SUV': 100,
    },
  },
}

export const BOOKING = {
  timeSlots: ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30'],
  statuses: ['pending', 'confirmed', 'completed', 'cancelled'],
  maxPhotos: 5,
  maxBookingsPerDay: 8,
}

export const REWARDS = {
  points: {
    booking: 100,
    review: 50,
    referral: 200,
  },
  tiers: {
    bronze: 0,
    silver: 500,
    gold: 1000,
    platinum: 2000,
  },
}

export const ROUTES = {
  home: '/',
  booking: '/booking',
  dashboard: '/dashboard',
  profile: '/dashboard/profile',
  bookings: '/dashboard/bookings',
  rewards: '/dashboard/rewards',
  admin: '/dashboard/admin',
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    forgotPassword: '/auth/forgot-password',
  },
}

export const API = {
  endpoints: {
    bookings: '/api/bookings',
    profile: '/api/profile',
    rewards: '/api/rewards',
    gallery: '/api/gallery',
  },
  methods: {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
  },
}

// Vehicle size categories and pricing
export const vehicleSizes = {
  s: { label: 'Small', description: 'Fiesta, Polo, Mini', price: 55 },
  m: { label: 'Medium', description: 'Focus, Golf, Civic', price: 60 },
  l: { label: 'Large', description: 'BMW 5 Series, SUV, Estate', price: 65 },
  xl: { label: 'Extra Large', description: 'Van, Range Rover, 7-Seater', price: 70 },
} as const

export type VehicleSize = keyof typeof vehicleSizes 