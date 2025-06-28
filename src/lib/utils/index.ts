// =================================================================
// UTILITY FUNCTIONS - Business logic separated from UI components
// Following system-guide.md principles for clean architecture
// =================================================================

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SERVICES, BOOKING, REWARDS, BRAND } from '@/lib/constants'
import type { 
  VehicleSize, 
  ServicePackage, 
  AddOnService, 
  BookingStatus,
  RewardTier 
} from '@/lib/constants'
import { format } from 'date-fns'

// =================================================================
// STYLING UTILITIES
// =================================================================

/**
 * Combines class names with Tailwind merge for conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency values according to brand settings
 */
export function formatCurrency(amount: number, currency: string = BOOKING.payment.currency): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format phone numbers for display and links
 */
export function formatPhone(phone: string, forLink: boolean = false): string {
  if (forLink) {
    return phone.replace(/\s/g, '')
  }
  // Format for display (UK format)
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`
  }
  return phone
}

/**
 * Format dates for consistent display
 */
export function formatDate(date: string | Date, format: 'short' | 'long' | 'time' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  switch (format) {
    case 'long':
      return dateObj.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    case 'time':
      return dateObj.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      })
    default:
      return dateObj.toLocaleDateString('en-GB')
  }
}

// =================================================================
// PRICING CALCULATIONS
// =================================================================

/**
 * Calculate base price for service and vehicle size combination
 */
export function calculateBasePrice(vehicleSize: VehicleSize, servicePackage: ServicePackage): number {
  const sizeData = SERVICES.vehicleSizes[vehicleSize]
  if (!sizeData) throw new Error(`Invalid vehicle size: ${vehicleSize}`)
  
  const price = sizeData.pricing[servicePackage]
  if (price === undefined) throw new Error(`No pricing for ${servicePackage} on ${vehicleSize}`)
  
  return price
}

/**
 * Calculate total price including add-ons
 */
export function calculateTotalPrice(
  vehicleSize: VehicleSize,
  servicePackage: ServicePackage,
  addOns: AddOnService[] = [],
  loyaltyDiscount: number = 0
): {
  basePrice: number
  addOnsPrice: number
  subtotal: number
  discount: number
  total: number
} {
  const basePrice = calculateBasePrice(vehicleSize, servicePackage)
  
  const addOnsPrice = addOns.reduce((total, addOnId) => {
    const addOn = SERVICES.addOns[addOnId]
    return total + (addOn?.price || 0)
  }, 0)
  
  const subtotal = basePrice + addOnsPrice
  const discount = Math.round(subtotal * (loyaltyDiscount / 100))
  const total = subtotal - discount
  
  return {
    basePrice,
    addOnsPrice,
    subtotal,
    discount,
    total,
  }
}

/**
 * Calculate deposit amount based on total price
 */
export function calculateDeposit(totalPrice: number): number {
  return Math.round(totalPrice * (BOOKING.payment.depositPercentage / 100))
}

// =================================================================
// LOYALTY & REWARDS SYSTEM
// =================================================================

/**
 * Determine user's loyalty tier based on points
 */
export function getUserTier(points: number): {
  current: RewardTier
  next: RewardTier | null
  pointsToNext: number
  progress: number
} {
  const tiers = Object.entries(REWARDS.tiers) as [RewardTier, typeof REWARDS.tiers[RewardTier]][]
  const sortedTiers = tiers.sort(([, a], [, b]) => a.threshold - b.threshold)
  
  let current: RewardTier = 'bronze'
  let next: RewardTier | null = null
  let pointsToNext = 0
  let progress = 0
  
  for (let i = 0; i < sortedTiers.length; i++) {
    const [tierId, tier] = sortedTiers[i]
    
    if (points >= tier.threshold) {
      current = tierId
      if (i < sortedTiers.length - 1) {
        const [nextTierId, nextTier] = sortedTiers[i + 1]
        next = nextTierId
        pointsToNext = nextTier.threshold - points
        progress = ((points - tier.threshold) / (nextTier.threshold - tier.threshold)) * 100
      } else {
        // Highest tier reached
        next = null
        pointsToNext = 0
        progress = 100
      }
    }
  }
  
  return { current, next, pointsToNext, progress: Math.min(100, Math.max(0, progress)) }
}

/**
 * Calculate points earned for an action
 */
export function calculatePointsEarned(action: keyof typeof REWARDS.pointsEarning, metadata?: any): number {
  const basePoints = REWARDS.pointsEarning[action] || 0
  
  // Add bonus logic here if needed (e.g., first booking bonus)
  if (action === 'booking' && metadata?.isFirstBooking) {
    return basePoints + REWARDS.pointsEarning.firstBooking
  }
  
  return basePoints
}

/**
 * Get loyalty discount percentage for a tier
 */
export function getLoyaltyDiscount(tier: RewardTier): number {
  return REWARDS.tiers[tier]?.discountPercentage || 0
}

// =================================================================
// BOOKING UTILITIES
// =================================================================

/**
 * Check if a booking can be cancelled
 */
export function canCancelBooking(bookingDate: string, bookingTime: string): boolean {
  const bookingDateTime = new Date(`${bookingDate}T${bookingTime}`)
  const now = new Date()
  const hoursUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
  
  return hoursUntilBooking >= BOOKING.constraints.cancellationHours
}

/**
 * Generate booking reference
 */
export function generateBookingReference(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  
  return `L4D${year}${month}${day}${random}`
}

/**
 * Get status color for booking status
 */
export function getStatusColor(status: BookingStatus): string {
  const statusConfig = BOOKING.statuses[status]
  if (!statusConfig) return 'gray'
  
  const colorMap = {
    primary: 'blue',
    success: 'green',
    warning: 'yellow',
    error: 'red',
    info: 'blue',
  }
  
  return colorMap[statusConfig.color] || 'gray'
}

/**
 * Check if a date is available for booking
 */
export function isDateAvailable(date: string): boolean {
  const bookingDate = new Date(date)
  const today = new Date()
  const maxDate = new Date()
  maxDate.setDate(today.getDate() + BOOKING.constraints.advanceBookingDays)
  
  // Reset time to compare dates only
  today.setHours(0, 0, 0, 0)
  bookingDate.setHours(0, 0, 0, 0)
  maxDate.setHours(0, 0, 0, 0)
  
  return bookingDate >= today && bookingDate <= maxDate
}

/**
 * Get available time slots for a date
 */
export function getAvailableTimeSlots(date: string, bookedSlots: string[] = []): string[] {
  if (!isDateAvailable(date)) return []
  
  return BOOKING.timeSlots.filter(slot => !bookedSlots.includes(slot))
}

// =================================================================
// VALIDATION UTILITIES
// =================================================================

/**
 * Validate UK postcode format
 */
export function isValidPostcode(postcode: string): boolean {
  const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i
  return ukPostcodeRegex.test(postcode)
}

/**
 * Validate UK phone number
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 10 && cleaned.length <= 15
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate vehicle registration
 */
export function isValidRegistration(registration: string): boolean {
  const cleaned = registration.replace(/\s/g, '').toUpperCase()
  // UK registration patterns
  const patterns = [
    /^[A-Z]{2}[0-9]{2}[A-Z]{3}$/, // Current format
    /^[A-Z][0-9]{1,3}[A-Z]{3}$/, // Prefix format
    /^[A-Z]{3}[0-9]{1,3}[A-Z]$/, // Suffix format
  ]
  
  return patterns.some(pattern => pattern.test(cleaned))
}

// =================================================================
// TEXT UTILITIES
// =================================================================

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Convert string to slug format
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, char => char.toUpperCase())
}

/**
 * Format vehicle description
 */
export function formatVehicleDescription(make?: string, model?: string, year?: number): string {
  const parts = [
    year && year.toString(),
    make && capitalizeWords(make),
    model && capitalizeWords(model),
  ].filter(Boolean)
  
  return parts.join(' ') || 'Vehicle'
}

// =================================================================
// TIME UTILITIES
// =================================================================

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime(date: string | Date): string {
  const now = new Date()
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const diffMs = now.getTime() - targetDate.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`
  } else {
    return 'Just now'
  }
}

/**
 * Check if time is in business hours
 */
export function isBusinessHours(date: Date = new Date()): boolean {
  const day = date.getDay() // 0 = Sunday
  const hour = date.getHours()
  
  // Monday to Friday: 8:00 - 18:00
  if (day >= 1 && day <= 5) {
    return hour >= 8 && hour < 18
  }
  
  // Saturday: 9:00 - 17:00
  if (day === 6) {
    return hour >= 9 && hour < 17
  }
  
  // Sunday: 10:00 - 16:00
  if (day === 0) {
    return hour >= 10 && hour < 16
  }
  
  return false
}

// =================================================================
// ERROR HANDLING UTILITIES
// =================================================================

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  
  return 'An unexpected error occurred'
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.toLowerCase().includes('network') ||
           error.message.toLowerCase().includes('fetch') ||
           error.name === 'NetworkError'
  }
  return false
}

// =================================================================
// EXPORT ALL UTILITIES
// =================================================================

export const utils = {
  // Styling
  cn,
  formatCurrency,
  formatPhone,
  formatDate,
  
  // Pricing
  calculateBasePrice,
  calculateTotalPrice,
  calculateDeposit,
  
  // Loyalty
  getUserTier,
  calculatePointsEarned,
  getLoyaltyDiscount,
  
  // Booking
  canCancelBooking,
  generateBookingReference,
  getStatusColor,
  isDateAvailable,
  getAvailableTimeSlots,
  
  // Validation
  isValidPostcode,
  isValidPhone,
  isValidEmail,
  isValidRegistration,
  
  // Text
  truncateText,
  slugify,
  capitalizeWords,
  formatVehicleDescription,
  
  // Time
  getRelativeTime,
  isBusinessHours,
  
  // Error handling
  getErrorMessage,
  isNetworkError,
} 