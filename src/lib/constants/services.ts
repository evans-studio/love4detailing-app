import { ServiceType, VehicleSize } from '@/lib/enums'

export interface Service {
  id: ServiceType
  name: string
  description: string
  features: string[]
  basePrice: Record<VehicleSize, number>
}

export interface AddOn {
  id: string
  name: string
  description: string
  price: Record<VehicleSize, number>
}

export const SERVICES: Service[] = [
  {
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
  {
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
  {
    id: ServiceType.PREMIUM_DETAIL,
    name: 'Premium Detail',
    description: 'Professional detailing service',
    features: [
      'All Full Valet features',
      'Paint correction',
      'Ceramic coating',
      'Engine bay clean',
      'Glass polish',
      'Paint sealant'
    ],
    basePrice: {
      [VehicleSize.SMALL]: 199.99,
      [VehicleSize.MEDIUM]: 249.99,
      [VehicleSize.LARGE]: 299.99,
      [VehicleSize.VAN]: 349.99
    }
  }
]

export const ADD_ONS: AddOn[] = [
  {
    id: 'paint-protection',
    name: 'Paint Protection',
    description: 'Long-lasting paint protection coating',
    price: {
      [VehicleSize.SMALL]: 49.99,
      [VehicleSize.MEDIUM]: 59.99,
      [VehicleSize.LARGE]: 69.99,
      [VehicleSize.VAN]: 79.99
    }
  },
  {
    id: 'interior-protection',
    name: 'Interior Protection',
    description: 'Fabric and leather protection treatment',
    price: {
      [VehicleSize.SMALL]: 39.99,
      [VehicleSize.MEDIUM]: 49.99,
      [VehicleSize.LARGE]: 59.99,
      [VehicleSize.VAN]: 69.99
    }
  },
  {
    id: 'wheel-protection',
    name: 'Wheel Protection',
    description: 'Ceramic wheel coating for lasting shine',
    price: {
      [VehicleSize.SMALL]: 29.99,
      [VehicleSize.MEDIUM]: 34.99,
      [VehicleSize.LARGE]: 39.99,
      [VehicleSize.VAN]: 44.99
    }
  }
]

// Time slots configuration
export const TIME_SLOTS = [
  '08:00',
  '10:00',
  '12:00',
  '14:00',
  '16:00'
] as const

// Service duration in minutes
export const SERVICE_DURATION: Record<ServiceType, number> = {
  [ServiceType.BASIC_WASH]: 90,
  [ServiceType.FULL_VALET]: 180,
  [ServiceType.PREMIUM_DETAIL]: 300
}

// Travel fee zones based on postcode
export interface TravelZone {
  range: string[] // postcode prefixes
  fee: number
}

export const TRAVEL_ZONES: TravelZone[] = [
  { range: ['BN1', 'BN2', 'BN3'], fee: 0 }, // Local
  { range: ['BN4', 'BN5', 'BN6'], fee: 10 }, // Near
  { range: ['BN7', 'BN8', 'BN9'], fee: 20 }, // Far
] 