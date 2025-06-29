import { format, parse, isValid, addDays, isBefore, isAfter, startOfDay, endOfDay, setHours, setMinutes } from 'date-fns'
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'
import { BOOKING } from '@/lib/constants'

// Default timezone for the application (UK)
export const DEFAULT_TIMEZONE = 'Europe/London'

// Date format constants
export const DATE_FORMATS = {
  API: 'yyyy-MM-dd',
  DISPLAY: {
    SHORT: 'dd/MM/yyyy',
    LONG: 'EEEE, do MMMM yyyy',
    FULL: 'EEEE, do MMMM yyyy, h:mm a',
  },
  TIME: {
    SHORT: 'HH:mm',
    DISPLAY: 'h:mm a',
  },
} as const

// Convert UTC date to local timezone
export function toLocalTime(date: Date | string): Date {
  const utcDate = typeof date === 'string' ? new Date(date) : date
  return utcToZonedTime(utcDate, DEFAULT_TIMEZONE)
}

// Convert local time to UTC
export function toUTC(date: Date | string): Date {
  const localDate = typeof date === 'string' ? new Date(date) : date
  return zonedTimeToUtc(localDate, DEFAULT_TIMEZONE)
}

// Format date for display
export function formatDate(date: Date | string, style: keyof typeof DATE_FORMATS.DISPLAY = 'SHORT'): string {
  const localDate = toLocalTime(date)
  return format(localDate, DATE_FORMATS.DISPLAY[style])
}

// Format time for display
export function formatTime(time: string | Date, style: keyof typeof DATE_FORMATS.TIME = 'DISPLAY'): string {
  const timeDate = typeof time === 'string' 
    ? parse(time, DATE_FORMATS.TIME.SHORT, new Date())
    : time
  return format(timeDate, DATE_FORMATS.TIME[style])
}

// Format date for API
export function formatDateForAPI(date: Date | string): string {
  const localDate = toLocalTime(date)
  return format(localDate, DATE_FORMATS.API)
}

// Get booking window constraints
export function getBookingWindow(): { 
  minDate: Date
  maxDate: Date 
  minDateString: string
  maxDateString: string
} {
  const today = startOfDay(new Date())
  const minDate = addDays(today, 1) // Next day minimum
  const maxDate = addDays(today, BOOKING.constraints.advanceBookingDays)

  return {
    minDate,
    maxDate,
    minDateString: formatDateForAPI(minDate),
    maxDateString: formatDateForAPI(maxDate),
  }
}

// Check if a date is within the valid booking window
export function isDateAvailable(date: string | Date): boolean {
  const { minDate, maxDate } = getBookingWindow()
  const checkDate = startOfDay(typeof date === 'string' ? new Date(date) : date)

  return (
    isValid(checkDate) &&
    !isBefore(checkDate, minDate) &&
    !isAfter(checkDate, maxDate)
  )
}

// Get available time slots for a date
export function getAvailableTimeSlots(
  date: string | Date,
  bookedSlots: string[] = []
): string[] {
  if (!isDateAvailable(date)) {
    return []
  }

  const selectedDate = typeof date === 'string' ? new Date(date) : date
  const workingHours = BOOKING.workingHours[format(selectedDate, 'EEEE').toLowerCase() as keyof typeof BOOKING.workingHours]

  if (!workingHours) {
    return []
  }

  const { start, end, interval } = workingHours
  const slots: string[] = []
  
  let currentTime = parse(start, DATE_FORMATS.TIME.SHORT, selectedDate)
  const endTime = parse(end, DATE_FORMATS.TIME.SHORT, selectedDate)

  while (isBefore(currentTime, endTime)) {
    const timeSlot = format(currentTime, DATE_FORMATS.TIME.SHORT)
    if (!bookedSlots.includes(timeSlot)) {
      slots.push(timeSlot)
    }
    currentTime = addMinutes(currentTime, interval)
  }

  return slots
}

// Add minutes to a date
export function addMinutes(date: Date, minutes: number): Date {
  return setMinutes(date, date.getMinutes() + minutes)
}

// Create a date-time from date string and time string
export function createDateTime(dateStr: string, timeStr: string): Date {
  const date = new Date(dateStr)
  const [hours, minutes] = timeStr.split(':').map(Number)
  
  return setMinutes(setHours(date, hours), minutes)
}

// Format duration in minutes to human-readable string
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours === 0) {
    return `${remainingMinutes}min`
  }
  
  return remainingMinutes === 0 
    ? `${hours}h` 
    : `${hours}h ${remainingMinutes}min`
}

// Check if a date is in the past
export function isPastDate(date: Date | string): boolean {
  const checkDate = typeof date === 'string' ? new Date(date) : date
  return isBefore(checkDate, new Date())
}

// Get the next available date (skipping weekends if needed)
export function getNextAvailableDate(skipWeekends: boolean = true): Date {
  let nextDate = addDays(new Date(), 1)
  
  if (skipWeekends) {
    const dayOfWeek = format(nextDate, 'EEEE').toLowerCase()
    if (dayOfWeek === 'saturday') {
      nextDate = addDays(nextDate, 2)
    } else if (dayOfWeek === 'sunday') {
      nextDate = addDays(nextDate, 1)
    }
  }
  
  return nextDate
} 