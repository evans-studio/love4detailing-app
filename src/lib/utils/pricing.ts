export const vehicleSizes = {
  s: { label: 'Small', description: 'Fiesta, Polo, Mini', price: 55 },
  m: { label: 'Medium', description: 'Focus, Golf, Civic', price: 60 },
  l: { label: 'Large', description: 'BMW 5 Series, SUV, Estate', price: 65 },
  xl: { label: 'Extra Large', description: 'Van, Range Rover, 7-Seater', price: 70 },
} as const

export const serviceTypes = [
  { 
    id: 'basic', 
    name: 'Car Detailing Service', 
    description: 'Professional exterior and interior car detailing',
    duration: '45min - 1hr',
    included: ['Exterior wash & dry', 'Interior vacuum', 'Dashboard clean', 'Wheel clean', 'Windows', 'Basic wax'],
    multiplier: 1
  },
] as const

export const addOns = [
  { id: 'interiorShampoo', label: 'Interior Deep Clean', price: 15, description: 'Deep carpet and upholstery cleaning' },
  { id: 'wheelShine', label: 'Alloy Wheel Polish', price: 10, description: 'Professional wheel polish and protection' },
  { id: 'paintProtection', label: 'Paint Protection', price: 25, description: 'Wax coating for long-lasting shine' },
  { id: 'engineBay', label: 'Engine Bay Clean', price: 20, description: 'Professional engine bay cleaning' },
  { id: 'headlightRestoration', label: 'Headlight Restoration', price: 18, description: 'Restore cloudy headlights' },
] as const

export function calculateBasePrice(vehicleSize: keyof typeof vehicleSizes, serviceType: string) {
  const basePrice = vehicleSizes[vehicleSize].price
  const service = serviceTypes.find(s => s.id === serviceType)
  return basePrice * (service?.multiplier || 1)
}

export function calculateAddOnsPrice(selectedAddOns: string[]) {
  return selectedAddOns.reduce((total, addonId) => {
    const addon = addOns.find(a => a.id === addonId)
    return total + (addon?.price || 0)
  }, 0)
}

export function calculateTotalPrice(vehicleSize: keyof typeof vehicleSizes, serviceType: string, selectedAddOns: string[]) {
  const basePrice = calculateBasePrice(vehicleSize, serviceType)
  const addOnsPrice = calculateAddOnsPrice(selectedAddOns)
  return basePrice + addOnsPrice
} 