import { VehicleSize } from '@/config/schema';

export type DVLAVehicleSize = 'small' | 'medium' | 'large' | 'extra large';

// Map DVLA vehicle sizes to app sizes
export function mapDVLAToAppSize(dvlaSize: DVLAVehicleSize | undefined | null): VehicleSize['id'] {
  if (!dvlaSize) return 'medium'
  
  const sizeMap: Record<DVLAVehicleSize, VehicleSize['id']> = {
    'small': 'small',
    'medium': 'medium',
    'large': 'large',
    'extra large': 'extra-large'
  }
  return sizeMap[dvlaSize] || 'medium'
}

// Determine vehicle size based on make and model
export const determineVehicleSize = (make: string, model: string): VehicleSize['id'] => {
  const makeLower = make.toLowerCase()
  const modelLower = model.toLowerCase()

  // Large vehicles
  const largeVehicles = [
    'range rover', 'land rover', 'discovery', 'defender', 'x5', 'x7', 'gls', 'q7', 'q8',
    'escalade', 'navigator', 'suburban', 'expedition', 'sequoia', 'tahoe', 'yukon'
  ]

  // Extra large vehicles
  const extraLargeVehicles = [
    'sprinter', 'transit', 'crafter', 'daily', 'master', 'movano', 'ducato'
  ]

  // Check for vans and large commercial vehicles
  if (extraLargeVehicles.some(v => makeLower.includes(v) || modelLower.includes(v))) {
    return 'extra-large'
  }

  // Check for large SUVs and luxury vehicles
  if (largeVehicles.some(v => makeLower.includes(v) || modelLower.includes(v))) {
    return 'large'
  }

  // Check for specific model patterns
  if (modelLower.includes('suv') || 
      modelLower.includes('estate') ||
      modelLower.includes('wagon') ||
      modelLower.includes('touring')) {
    return 'large'
  }

  // Default to medium for most vehicles
  return 'medium'
} 