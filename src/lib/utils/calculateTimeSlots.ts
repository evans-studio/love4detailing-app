import { supabase } from '@/lib/supabase/client'
import { bookingLogger } from '@/lib/utils/logger'
import { WORKING_HOURS, WORKING_DAYS } from '@/lib/constants/booking'
import type { TimeSlot } from '@/types'

export async function calculateTimeSlots(selectedDate: Date): Promise<TimeSlot[]> {
  try {
    const dayOfWeek = selectedDate.getDay()
    const dateString = selectedDate.toISOString().split('T')[0]
    
    bookingLogger.debug('Calculating time slots', {
      date: dateString,
      dayOfWeek,
      dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]
    })
    
    // Check if it's a working day
    if (!WORKING_DAYS.includes(dayOfWeek as 1 | 2 | 3 | 4 | 5 | 6)) {
      bookingLogger.warn('Non-working day selected', { date: dateString, dayOfWeek })
      return []
    }
    
    const slots = await getDefaultTimeSlots(selectedDate)
    bookingLogger.debug('Time slots calculated', { count: slots.length, date: dateString })
    return slots
    
  } catch (error) {
    bookingLogger.error('Error calculating time slots', error)
    // Fallback to default slots if anything fails
    const fallbackSlots = await getDefaultTimeSlots(selectedDate)
    return fallbackSlots
  }
}

function parseTime(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number)
  return hours * 60 + minutes
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

function formatTimeLabel(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  
  if (mins === 0) {
    return `${displayHours}:00 ${period}`
  } else {
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`
  }
}

// Get default time slots with availability check
async function getDefaultTimeSlots(selectedDate: Date): Promise<TimeSlot[]> {
  const defaultSlots = [
    { time: '10:00', label: '10:00 AM' },
    { time: '11:30', label: '11:30 AM' },
    { time: '13:00', label: '1:00 PM' },
    { time: '14:30', label: '2:30 PM' },
    { time: '16:00', label: '4:00 PM' }
  ]

  const dateString = selectedDate.toISOString().split('T')[0]
  
  try {
    // Check existing bookings for this date
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('booking_time')
      .eq('booking_date', dateString)
      .eq('status', 'confirmed')

    if (error) {
      bookingLogger.warn('Could not check booking availability, returning all slots as available', error)
      // If we can't check availability, return all slots as available
      return defaultSlots.map(slot => ({
        ...slot,
        isAvailable: true
      }))
    }

    const bookedTimes = bookings?.map(b => b.booking_time) || []
    
    const slotsWithAvailability = defaultSlots.map(slot => ({
      ...slot,
      isAvailable: !bookedTimes.includes(slot.time)
    }))

    return slotsWithAvailability
  } catch (error) {
    bookingLogger.error('Error checking slot availability', error)
    // If there's an error, return all slots as available
    return defaultSlots.map(slot => ({
      ...slot,
      isAvailable: true
    }))
  }
}

export async function getWorkingDays(): Promise<number[]> {
  // Return Monday-Saturday (1-6)
  return [1, 2, 3, 4, 5, 6]
}

export function isWorkingDay(date: Date, workingDays: number[]): boolean {
  return workingDays.includes(date.getDay())
} 