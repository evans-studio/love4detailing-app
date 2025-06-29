import { formatDate as formatDateUtil, formatTime as formatTimeUtil, formatDuration as formatDurationUtil } from '@/lib/date'

/**
 * Format currency values according to brand settings
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount)
}

/**
 * Format dates for consistent display
 * @deprecated Use formatDate from @/lib/date instead
 */
export function formatDate(date: string | Date, style: 'short' | 'long' | 'full' = 'short'): string {
  return formatDateUtil(date, style.toUpperCase() as 'SHORT' | 'LONG' | 'FULL')
}

/**
 * Format a time string to 12-hour format
 * @deprecated Use formatTime from @/lib/date instead
 */
export function formatTime(time: string): string {
  return formatTimeUtil(time)
}

/**
 * Format a phone number to UK format
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
 * Format a postcode to standard UK format
 */
export function formatPostcode(postcode: string): string {
  return postcode.toUpperCase().replace(/^(.+?)(\d\w{2})$/, '$1 $2')
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

/**
 * Capitalize each word in text
 */
export function capitalizeWords(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Format date and time together
 * @deprecated Use formatDate from @/lib/date with 'FULL' style instead
 */
export function formatDateTime(date: string | Date): string {
  return formatDateUtil(date, 'FULL')
}

/**
 * Format duration in minutes to human-readable string
 * @deprecated Use formatDuration from @/lib/date instead
 */
export function formatDuration(minutes: number): string {
  return formatDurationUtil(minutes)
}

export function formatVehicleRegistration(registration: string): string {
  return registration.toUpperCase().replace(/\s/g, '')
}

export function formatBookingReference(reference: string): string {
  return reference.toUpperCase().replace(/(\w{4})(\w{4})/, '$1-$2')
}

export function formatLoyaltyPoints(points: number): string {
  return points.toLocaleString()
}

export function formatPercentage(value: number): string {
  return `${value}%`
}

export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${Math.round(size)} ${units[unitIndex]}`
} 