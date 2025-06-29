/**
 * Validates a UK vehicle registration number
 * @param registration The registration number to validate
 * @returns boolean indicating if the registration is valid
 */
export function isValidRegistration(registration: string): boolean {
  // UK registration format: AB12 CDE or AB12CDE
  const regexPattern = /^[A-Z]{2}[0-9]{2}[A-Z]{3}$|^[A-Z]{2}[0-9]{2}\s[A-Z]{3}$/
  return regexPattern.test(registration.toUpperCase())
}

/**
 * Validates a UK postcode
 * @param postcode The postcode to validate
 * @returns boolean indicating if the postcode is valid
 */
export function isValidPostcode(postcode: string): boolean {
  // UK postcode format: AA9A 9AA, A9A 9AA, A9 9AA, A99 9AA, AA9 9AA, AA99 9AA
  const regexPattern = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i
  return regexPattern.test(postcode)
}

/**
 * Validates a UK phone number
 * @param phone The phone number to validate
 * @returns boolean indicating if the phone number is valid
 */
export function isValidPhone(phone: string): boolean {
  // UK phone number format: +44 1234 567890, 01234 567890, etc.
  const regexPattern = /^(?:(?:\+44)|(?:0))(?:\d\s?){9,10}$/
  return regexPattern.test(phone)
}

/**
 * Validates an email address
 * @param email The email address to validate
 * @returns boolean indicating if the email is valid
 */
export function isValidEmail(email: string): boolean {
  // Basic email format validation
  const regexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regexPattern.test(email)
}

/**
 * Validates a name (no special characters except hyphens and apostrophes)
 * @param name The name to validate
 * @returns boolean indicating if the name is valid
 */
export function isValidName(name: string): boolean {
  // Allow letters, spaces, hyphens, and apostrophes
  const regexPattern = /^[A-Za-z\s'-]+$/
  return regexPattern.test(name)
}

/**
 * Validates a password meets minimum requirements
 * @param password The password to validate
 * @returns boolean indicating if the password is valid
 */
export function isValidPassword(password: string): boolean {
  // Minimum 8 characters, at least one uppercase, one lowercase, and one number
  const regexPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/
  return regexPattern.test(password)
}

/**
 * Validates a date is in the future
 * @param date The date to validate
 * @returns boolean indicating if the date is valid and in the future
 */
export function isValidFutureDate(date: Date): boolean {
  const now = new Date()
  return date instanceof Date && !isNaN(date.getTime()) && date > now
}

/**
 * Validates a date is in the past
 * @param date The date to validate
 * @returns boolean indicating if the date is valid and in the past
 */
export function isValidPastDate(date: Date): boolean {
  const now = new Date()
  return date instanceof Date && !isNaN(date.getTime()) && date < now
}

/**
 * Validates a year is within a reasonable range
 * @param year The year to validate
 * @returns boolean indicating if the year is valid
 */
export function isValidYear(year: number): boolean {
  const currentYear = new Date().getFullYear()
  return year >= 1900 && year <= currentYear + 1
}

/**
 * Validates a URL
 * @param url The URL to validate
 * @returns boolean indicating if the URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function isValidBookingReference(reference: string): boolean {
  const referenceRegex = /^[A-Z0-9]{8}$/i
  return referenceRegex.test(reference.replace(/\s/g, ''))
}

export function isValidLoyaltyPoints(points: number): boolean {
  return Number.isInteger(points) && points >= 0
}

export function isValidPercentage(value: number): boolean {
  return value >= 0 && value <= 100
}

export function isValidFileSize(bytes: number): boolean {
  return Number.isInteger(bytes) && bytes >= 0
}

export function isValidCurrency(amount: number): boolean {
  return !isNaN(amount) && amount >= 0
}

export function isValidDate(date: string | Date): boolean {
  const dateObj = new Date(date)
  return dateObj instanceof Date && !isNaN(dateObj.getTime())
}

export function isValidTime(time: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(time)
}

export function isValidDuration(minutes: number): boolean {
  return Number.isInteger(minutes) && minutes > 0
} 