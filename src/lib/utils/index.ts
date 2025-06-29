// =================================================================
// UTILITY FUNCTIONS - Business logic separated from UI components
// Following system-guide.md principles for clean architecture
// =================================================================

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SERVICES, BOOKING, REWARDS } from '@/lib/constants'
import { VehicleSize, ServiceType, BookingStatus, LoyaltyTier } from '@/lib/enums'

// Service type mapping
const serviceTypeToPackageKey: Record<ServiceType, keyof typeof SERVICES.vehicleSizes['small']['pricing']> = {
  [ServiceType.BASIC]: 'essential-clean',
  [ServiceType.PREMIUM]: 'premium-detail',
  [ServiceType.LUXURY]: 'ultimate-protection',
  [ServiceType.DELUXE]: 'ultimate-protection',
  [ServiceType.CUSTOM]: 'essential-clean',
  [ServiceType.ULTIMATE]: 'ultimate-protection',
}

// Vehicle size mapping
const vehicleSizeToKey: Record<VehicleSize, keyof typeof SERVICES.vehicleSizes> = {
  [VehicleSize.SMALL]: 'small',
  [VehicleSize.MEDIUM]: 'medium',
  [VehicleSize.LARGE]: 'large',
  [VehicleSize.XLARGE]: 'extraLarge',
}

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
 * Calculates the base price for a service package based on vehicle size and add-ons
 * @param packageType - The type of service package
 * @param vehicleSize - The size of the vehicle
 * @param addOns - Optional array of add-on services
 * @returns The calculated base price
 */
export function calculateBasePrice(
  packageType: ServiceType,
  vehicleSize: VehicleSize,
  addOns: string[] = []
): number {
  // Get base price from vehicle size pricing
  const sizeKey = vehicleSizeToKey[vehicleSize]
  const serviceKey = serviceTypeToPackageKey[packageType]

  const basePrice = sizeKey && serviceKey ? SERVICES.vehicleSizes[sizeKey].pricing[serviceKey] : 0

  // Calculate add-ons total
  const addOnsTotal = addOns.reduce((total, addOnId) => {
    const addOnKey = Object.keys(SERVICES.addOns).find(
      key => SERVICES.addOns[key as keyof typeof SERVICES.addOns].id === addOnId
    ) as keyof typeof SERVICES.addOns | undefined

    return total + (addOnKey ? SERVICES.addOns[addOnKey].price : 0)
  }, 0)

  return basePrice + addOnsTotal
}

/**
 * Calculate total price including discounts
 */
export function calculateTotalPrice(basePrice: number, discountPercentage: number = 0): number {
  const discount = basePrice * (discountPercentage / 100)
  return basePrice - discount
}

/**
 * Calculates the deposit amount required for a booking
 * @param totalAmount - The total booking amount
 * @returns The calculated deposit amount
 */
export function calculateDeposit(totalAmount: number): number {
  return totalAmount * 0.2 // 20% deposit
}

/**
 * Calculates the loyalty points earned for a booking
 * @param amount - The booking amount
 * @returns The calculated loyalty points
 */
export function calculateLoyaltyPoints(amount: number): number {
  return Math.floor(amount * REWARDS.pointsEarning.booking / 100)
}

/**
 * Gets the discount percentage for a loyalty tier
 * @param tier - The loyalty tier
 * @returns The discount percentage
 */
export function getLoyaltyDiscount(tier: LoyaltyTier): number {
  const tierKey = tier.toLowerCase() as keyof typeof REWARDS.tiers
  return REWARDS.tiers[tierKey]?.discountPercentage || 0
}

/**
 * Gets the user's loyalty tier based on points
 * @param points - The user's loyalty points
 * @returns The loyalty tier
 */
export function getUserTier(points: number): LoyaltyTier {
  const tiers = Object.entries(REWARDS.tiers)
  for (let i = tiers.length - 1; i >= 0; i--) {
    const [tier, { threshold }] = tiers[i]
    if (points >= threshold) {
      return tier as LoyaltyTier
    }
  }
  return LoyaltyTier.BRONZE
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
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `BK-${timestamp}-${randomStr}`;
}

/**
 * Gets the status color for UI
 * @param status - The booking status
 * @returns The color class name
 */
export function getStatusColor(status: BookingStatus): string {
  const colors: Record<BookingStatus, string> = {
    [BookingStatus.PENDING]: 'yellow',
    [BookingStatus.CONFIRMED]: 'green',
    [BookingStatus.IN_PROGRESS]: 'blue',
    [BookingStatus.COMPLETED]: 'blue',
    [BookingStatus.CANCELLED]: 'red',
  }
  return colors[status]
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

// Booking status mapping
export const bookingStatusLabels: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: 'Pending',
  [BookingStatus.CONFIRMED]: 'Confirmed',
  [BookingStatus.IN_PROGRESS]: 'In Progress',
  [BookingStatus.COMPLETED]: 'Completed',
  [BookingStatus.CANCELLED]: 'Cancelled',
} 