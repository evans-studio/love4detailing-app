/**
 * Format a number as GBP currency
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Format a date string to a human-readable format
 * @param date - The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

/**
 * Format a time string to 12-hour format
 * @param time - The time to format (HH:mm)
 * @returns Formatted time string
 */
export const formatTime = (time: string): string => {
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
 * @param phone - The phone number to format
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Format as UK number
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{5})(\d{6})/, '$1 $2')
  }
  
  return phone
}

/**
 * Format a postcode to standard UK format
 * @param postcode - The postcode to format
 * @returns Formatted postcode
 */
export const formatPostcode = (postcode: string): string => {
  // Remove all whitespace and convert to uppercase
  const cleaned = postcode.replace(/\s+/g, '').toUpperCase()
  
  // Add space in the correct position
  if (cleaned.length > 3) {
    return `${cleaned.slice(0, -3)} ${cleaned.slice(-3)}`
  }
  
  return cleaned
} 