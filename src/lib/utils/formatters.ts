import { BOOKING } from '@/lib/constants'

/**
 * Format currency values according to brand settings
 */
export function formatCurrency(amount: number, currency: string = BOOKING.payment.currency): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
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

/**
 * Format a time string to 12-hour format
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':')
  const date = new Date()
  date.setHours(parseInt(hours))
  date.setMinutes(parseInt(minutes))

  return date.toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
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
  // Remove all whitespace and convert to uppercase
  const cleaned = postcode.replace(/\s+/g, '').toUpperCase()
  
  // Add space in the correct position
  if (cleaned.length > 3) {
    return `${cleaned.slice(0, -3)} ${cleaned.slice(-3)}`
  }
  
  return cleaned
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