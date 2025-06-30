import { ServiceType, VehicleSize } from '@/lib/enums'
import { SERVICES, ADD_ONS, TRAVEL_ZONES } from '@/lib/constants/services'

export function calculateBasePrice(serviceType: ServiceType, vehicleSize: VehicleSize): number {
  const service = SERVICES.find(s => s.id === serviceType)
  if (!service) return 0
  return service.basePrice[vehicleSize]
}

export function calculateAddOnsPrice(addOnIds: string[], vehicleSize: VehicleSize): number {
  return addOnIds.reduce((total, addOnId) => {
    const addOn = ADD_ONS.find(a => a.id === addOnId)
    if (!addOn) return total
    return total + addOn.price[vehicleSize]
  }, 0)
}

export function calculateTravelFee(postcode: string): number {
  const postcodePrefix = postcode.toUpperCase().split(' ')[0]
  const zone = TRAVEL_ZONES.find(zone => 
    zone.range.some(prefix => postcodePrefix.startsWith(prefix))
  )
  return zone?.fee ?? 0
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(price)
}

export function calculateTotalPrice(params: {
  serviceType: ServiceType
  vehicleSize: VehicleSize
  addOnIds: string[]
  postcode: string
}): {
  basePrice: number
  addOnsPrice: number
  travelFee: number
  totalPrice: number
} {
  const basePrice = calculateBasePrice(params.serviceType, params.vehicleSize)
  const addOnsPrice = calculateAddOnsPrice(params.addOnIds, params.vehicleSize)
  const travelFee = calculateTravelFee(params.postcode)
  
  return {
    basePrice,
    addOnsPrice,
    travelFee,
    totalPrice: basePrice + addOnsPrice + travelFee
  }
} 