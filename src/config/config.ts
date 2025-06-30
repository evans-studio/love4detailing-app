// This file is the single source of truth for the active client configuration.
// To switch to a different client, change the import path.

import { love4detailingConfig } from './clients/love4detailing';
import { clientConfigSchema } from './schema';
import { VehicleSize, ServiceType } from '@/lib/enums'

// Validate the configuration against the master schema to ensure consistency.
const _validatedConfig = clientConfigSchema.parse(love4detailingConfig);

// Application configuration
export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Love4Detailing',
  description: 'Professional car detailing and valeting services in Brighton & Hove',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  support: {
    email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@love4detailing.com',
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '01273 123456'
  }
}

// Service configuration
export const SERVICES = {
  [ServiceType.BASIC_WASH]: {
    id: ServiceType.BASIC_WASH,
    name: 'Basic Wash',
    description: 'Essential car cleaning service',
    features: [
      'Exterior wash & dry',
      'Interior vacuum',
      'Dashboard clean',
      'Window clean',
      'Tire shine'
    ],
    basePrice: {
      [VehicleSize.SMALL]: 49.99,
      [VehicleSize.MEDIUM]: 59.99,
      [VehicleSize.LARGE]: 69.99,
      [VehicleSize.VAN]: 79.99
    }
  },
  [ServiceType.FULL_VALET]: {
    id: ServiceType.FULL_VALET,
    name: 'Full Valet',
    description: 'Comprehensive cleaning inside and out',
    features: [
      'All Basic Wash features',
      'Interior deep clean',
      'Leather/upholstery clean',
      'Paint decontamination',
      'Wheel deep clean',
      'Wax protection'
    ],
    basePrice: {
      [VehicleSize.SMALL]: 99.99,
      [VehicleSize.MEDIUM]: 119.99,
      [VehicleSize.LARGE]: 139.99,
      [VehicleSize.VAN]: 159.99
    }
  },
  [ServiceType.PREMIUM_DETAIL]: {
    id: ServiceType.PREMIUM_DETAIL,
    name: 'Premium Detail',
    description: 'Professional detailing with ceramic coating',
    features: [
      'All Full Valet features',
      'Paint correction',
      'Ceramic coating',
      'Engine bay clean',
      'Glass coating',
      'Interior fabric protection'
    ],
    basePrice: {
      [VehicleSize.SMALL]: 199.99,
      [VehicleSize.MEDIUM]: 249.99,
      [VehicleSize.LARGE]: 299.99,
      [VehicleSize.VAN]: 349.99
    }
  }
}

// Add-on configuration
export const ADD_ONS = [
  {
    id: 'ceramic-boost',
    name: 'Ceramic Boost',
    description: 'Additional layer of ceramic protection',
    price: {
      [VehicleSize.SMALL]: 29.99,
      [VehicleSize.MEDIUM]: 34.99,
      [VehicleSize.LARGE]: 39.99,
      [VehicleSize.VAN]: 44.99
    }
  },
  {
    id: 'interior-sanitize',
    name: 'Interior Sanitization',
    description: 'Deep sanitization of all interior surfaces',
    price: {
      [VehicleSize.SMALL]: 19.99,
      [VehicleSize.MEDIUM]: 24.99,
      [VehicleSize.LARGE]: 29.99,
      [VehicleSize.VAN]: 34.99
    }
  },
  {
    id: 'paint-sealant',
    name: 'Paint Sealant',
    description: 'Long-lasting paint protection',
    price: {
      [VehicleSize.SMALL]: 39.99,
      [VehicleSize.MEDIUM]: 44.99,
      [VehicleSize.LARGE]: 49.99,
      [VehicleSize.VAN]: 54.99
    }
  }
]

// Travel zones configuration
export const TRAVEL_ZONES = [
  {
    name: 'Zone 1',
    range: ['BN1', 'BN2', 'BN3'],
    fee: 0
  },
  {
    name: 'Zone 2',
    range: ['BN41', 'BN42', 'BN43', 'BN44', 'BN45'],
    fee: 10
  },
  {
    name: 'Zone 3',
    range: ['BN5', 'BN6', 'BN7', 'BN8', 'BN9'],
    fee: 20
  }
]

// Time slot configuration
export const TIME_SLOTS = [
  '08:00',
  '09:30',
  '11:00',
  '12:30',
  '14:00',
  '15:30',
  '17:00'
]

// Loyalty program configuration
export const LOYALTY_CONFIG = {
  pointsPerPound: 1,
  tiers: {
    bronze: {
      name: 'Bronze',
      minPoints: 0,
      discount: 0
    },
    silver: {
      name: 'Silver',
      minPoints: 1000,
      discount: 5
    },
    gold: {
      name: 'Gold',
      minPoints: 2500,
      discount: 10
    },
    platinum: {
      name: 'Platinum',
      minPoints: 5000,
      discount: 15
    }
  }
}

// Feature flags
export const FEATURES = {
  rewards: process.env.NEXT_PUBLIC_ENABLE_REWARDS === 'true',
  vehicleLookup: process.env.NEXT_PUBLIC_ENABLE_VEHICLE_LOOKUP === 'true',
  distanceCalculation: process.env.NEXT_PUBLIC_ENABLE_DISTANCE_CALCULATION === 'true'
}

// Rate limiting configuration
export const RATE_LIMITS = {
  vehicleLookup: parseInt(process.env.RATE_LIMIT_VEHICLE_LOOKUP || '5', 10),
  bookingCreate: parseInt(process.env.RATE_LIMIT_BOOKING_CREATE || '3', 10),
  generalApi: parseInt(process.env.RATE_LIMIT_GENERAL_API || '100', 10)
}

// Cache configuration
export const CACHE_CONFIG = {
  vehicleLookup: parseInt(process.env.CACHE_VEHICLE_LOOKUP || '3600', 10),
  distanceCalculation: parseInt(process.env.CACHE_DISTANCE_CALCULATION || '86400', 10),
  postcodeLookup: parseInt(process.env.CACHE_POSTCODE_LOOKUP || '604800', 10)
}

const config = {
  app: APP_CONFIG,
  services: SERVICES,
  addOns: ADD_ONS,
  travelZones: TRAVEL_ZONES,
  timeSlots: TIME_SLOTS,
  loyalty: LOYALTY_CONFIG,
  features: FEATURES,
  rateLimits: RATE_LIMITS,
  cache: CACHE_CONFIG
} 

export default config