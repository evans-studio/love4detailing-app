// Centralized booking constants for Love4Detailing app

export const VEHICLE_SIZES = {
  small: { 
    label: 'Small Vehicle', 
    description: 'Fiesta, Polo, Mini, Corsa', 
    price: 55 
  },
  medium: { 
    label: 'Medium Vehicle', 
    description: 'Focus, Golf, Civic, Astra', 
    price: 60 
  },
  large: { 
    label: 'Large Vehicle', 
    description: 'BMW 5 Series, SUVs, Estates', 
    price: 65 
  },
  extraLarge: { 
    label: 'Extra Large Vehicle', 
    description: 'Vans, Range Rover, 7-Seaters', 
    price: 70 
  },
} as const

export const ADD_ONS = [
  { 
    id: 'interiorShampoo', 
    label: 'Interior Shampoo', 
    description: 'Deep clean fabric seats & carpets', 
    price: 5 
  },
  { 
    id: 'wheelShine', 
    label: 'Premium Wheel Shine', 
    description: 'Professional wheel treatment', 
    price: 5 
  },
] as const

export const SERVICE_TYPES = [
  {
    id: 'standard',
    name: 'Standard Exterior Clean',
    description: 'Complete exterior wash, dry and basic interior vacuum',
    multiplier: 1,
    duration: 60,
    included: [
      'Exterior wash & rinse',
      'Wheel cleaning',
      'Basic interior vacuum',
      'Window cleaning (interior & exterior)',
      'Dashboard wipe down'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Clean',
    description: 'Deep exterior clean with enhanced interior service',
    multiplier: 1.5,
    duration: 90,
    included: [
      'Pre-wash snow foam treatment',
      'Two-stage exterior wash',
      'Deep wheel & arch cleaning',
      'Thorough interior vacuum & wipe',
      'Leather conditioning (if applicable)',
      'Air freshener application'
    ]
  },
  {
    id: 'deluxe',
    name: 'Deluxe Detail',
    description: 'Professional-grade detailing service',
    multiplier: 2,
    duration: 120,
    included: [
      'Complete premium clean service',
      'Paint decontamination',
      'Wax protection application',
      'Engine bay cleaning',
      'Tyre shine application',
      'Interior protection treatment'
    ]
  }
] as const

export const WORKING_HOURS = {
  start: '08:00',
  end: '18:00',
  slotDuration: 90, // minutes
  breakBetweenSlots: 30 // minutes
} as const

export const WORKING_DAYS = [1, 2, 3, 4, 5, 6] as const // Monday=1, Sunday=0

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
} as const

export const MAX_VEHICLE_IMAGES = 3
export const VALID_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

// UK Postcode validation regex
export const UK_POSTCODE_REGEX = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i

// Vehicle registration patterns
export const UK_REGISTRATION_PATTERNS = [
  /^[A-Z]{2}[0-9]{2}[A-Z]{3}$/, // Current format: AB12 CDE
  /^[A-Z][0-9]{1,3}[A-Z]{3}$/, // Prefix format: A123 BCD
  /^[A-Z]{3}[0-9]{1,3}[A-Z]$/, // Suffix format: ABC 123D
  /^[0-9]{1,4}[A-Z]{1,3}$/, // Dateless format: 1234 AB
  /^[A-Z]{1,3}[0-9]{1,4}$/ // Reversed dateless: AB 1234
] as const

export type VehicleSize = keyof typeof VEHICLE_SIZES
export type ServiceType = typeof SERVICE_TYPES[number]['id']
export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS]
export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS] 