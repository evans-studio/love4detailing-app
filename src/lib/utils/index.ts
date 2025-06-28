// =================================================================
// UTILITY FUNCTIONS - Business logic separated from UI components
// Following system-guide.md principles for clean architecture
// =================================================================

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SERVICES, BOOKING, REWARDS } from '@/lib/constants'
import type { 
  VehicleSize, 
  ServicePackage, 
  AddOnService, 
  BookingStatus,
  RewardTier 
} from '@/lib/constants'

// =================================================================
// STYLING UTILITIES
// =================================================================

/**
 * Combines class names with Tailwind merge for conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// =================================================================
// BUSINESS LOGIC UTILITIES
// =================================================================

/**
 * Calculate base price for a service
 */
export function calculateBasePrice(
  packageType: ServicePackage,
  vehicleSize: VehicleSize,
  addOns: AddOnService[] = []
): number {
  const basePrice = SERVICES.vehicleSizes[vehicleSize].pricing[packageType]
  const addOnTotal = addOns.reduce((total, addon) => total + SERVICES.addOns[addon].price, 0)
  return basePrice + addOnTotal
}

/**
 * Calculate total price including discounts
 */
export function calculateTotalPrice(basePrice: number, discountPercentage: number = 0): number {
  const discount = basePrice * (discountPercentage / 100)
  return basePrice - discount
}

/**
 * Calculate deposit amount
 */
export function calculateDeposit(totalPrice: number): number {
  return Math.round(totalPrice * (BOOKING.payment.depositPercentage / 100))
}

/**
 * Get user's reward tier
 */
export function getUserTier(points: number): RewardTier {
  const tiers = Object.entries(REWARDS.tiers)
  for (let i = tiers.length - 1; i >= 0; i--) {
    const [tier, { threshold }] = tiers[i]
    if (points >= threshold) {
      return tier as RewardTier
    }
  }
  return 'bronze'
}

/**
 * Calculate points earned from booking
 */
export function calculatePointsEarned(totalSpent: number): number {
  return Math.floor(totalSpent * REWARDS.pointsEarning.booking / 100)
}

/**
 * Get loyalty discount percentage
 */
export function getLoyaltyDiscount(tier: RewardTier): number {
  return REWARDS.tiers[tier].discountPercentage
}

/**
 * Check if booking can be cancelled
 */
export function canCancelBooking(bookingDate: Date): boolean {
  const now = new Date()
  const hoursUntilBooking = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60)
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
 * Get status color for UI
 */
export function getStatusColor(status: BookingStatus): string {
  const colors: Record<BookingStatus, string> = {
    pending: 'yellow',
    confirmed: 'green',
    completed: 'blue',
    cancelled: 'red',
    inProgress: 'blue'
  }
  return colors[status] || 'gray'
}

/**
 * Check if date is available
 */
export function isDateAvailable(date: Date): boolean {
  const day = date.getDay()
  return day >= 1 && day <= 6 // Monday to Saturday
}

/**
 * Get available time slots
 */
export function getAvailableTimeSlots(date: Date): string[] {
  const day = date.getDay()
  const slots = []
  
  // Monday to Friday: 9:00 - 17:00
  if (day >= 1 && day <= 5) {
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${hour}:00`)
    }
  }
  
  // Saturday: 10:00 - 16:00
  if (day === 6) {
    for (let hour = 10; hour < 16; hour++) {
      slots.push(`${hour}:00`)
    }
  }
  
  return slots
}

// =================================================================
// VALIDATION UTILITIES
// =================================================================

/**
 * Validate UK postcode
 */
export function isValidPostcode(postcode: string): boolean {
  const regex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i
  return regex.test(postcode.trim())
}

/**
 * Validate UK phone number
 */
export function isValidPhone(phone: string): boolean {
  const regex = /^(?:(?:\+44)|(?:0))(?:(?:(?:\d{10})|(?:\d{3}[\s-]\d{3}[\s-]\d{4})))$/
  return regex.test(phone.trim())
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  return regex.test(email.trim())
}

/**
 * Validate UK vehicle registration
 */
export function isValidRegistration(reg: string): boolean {
  const regex = /^[A-Z]{2}[0-9]{2}[A-Z]{3}$/i
  return regex.test(reg.replace(/\s/g, ''))
}

// =================================================================
// ERROR HANDLING UTILITIES
// =================================================================

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}

/**
 * Check if error is network related
 */
export function isNetworkError(error: unknown): boolean {
  return error instanceof Error && 
    ['NetworkError', 'Failed to fetch'].some(msg => 
      error.message.includes(msg)
    )
} 