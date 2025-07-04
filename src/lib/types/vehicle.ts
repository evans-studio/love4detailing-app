import { VehicleSize } from '@/lib/enums'

// Re-export VehicleSize for components that import from here
export { VehicleSize }

// Vehicle image types
export type VehicleImage = {
  id: string
  url: string
  fileName: string
  fileSize: number
  uploadedAt: string
  type: 'before' | 'after' | 'gallery'
}

// Upload states
export type UploadState = {
  progress: number
  status: 'idle' | 'uploading' | 'success' | 'error'
  error?: string
}

// Upload progress event
export type UploadProgressEvent = {
  loaded: number
  total: number
}

// Gallery configuration
export const GALLERY_CONFIG = {
  maxFiles: 5,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'] as const,
  errorMessages: {
    tooLarge: 'Image must be smaller than 5MB',
    invalidType: 'Only JPEG, PNG and WebP images are allowed',
    tooMany: 'Maximum 5 images allowed',
    uploadFailed: 'Failed to upload image. Please try again.',
  },
} as const

// Allowed mime types
export type AllowedMimeType = typeof GALLERY_CONFIG.allowedTypes[number]

export interface Vehicle {
  registration: string
  make: string
  model: string
  year: number
  color?: string
  size: VehicleSize
  dvlaLookup?: {
    make: string
    model: string
    year: number
    color?: string
    fuelType?: string
    engineSize?: string
  }
} 