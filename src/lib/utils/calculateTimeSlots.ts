import { supabase } from '@/lib/supabase/client'

export interface TimeSlot {
  time: string
  label: string
  isAvailable: boolean
  bookingCount: number
}

export async function calculateTimeSlots(selectedDate: Date): Promise<TimeSlot[]> {
  try {
    const dayOfWeek = selectedDate.getDay()
    const dateString = selectedDate.toISOString().split('T')[0]
    
    console.log('🕐 calculateTimeSlots called with:', {
      date: dateString,
      dayOfWeek,
      dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
      originalDate: selectedDate
    })
    
    // TEMPORARY: Always return default slots for debugging
    console.log('🔧 TEMPORARY: Bypassing all checks, returning default slots')
    const slots = await getDefaultTimeSlots(selectedDate)
    console.log('🎯 Final slots returned:', slots)
    return slots
    
  } catch (error) {
    console.error('❌ Error calculating time slots:', error)
    // Fallback to default slots if anything fails
    const fallbackSlots = await getDefaultTimeSlots(selectedDate)
    console.log('🔄 Fallback slots returned:', fallbackSlots)
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

// Fallback function for default time slots (your original slots)
async function getDefaultTimeSlots(selectedDate: Date): Promise<TimeSlot[]> {
  const defaultSlots = [
    { time: '10:00', label: '10:00 AM' },
    { time: '11:30', label: '11:30 AM' },
    { time: '13:00', label: '1:00 PM' },
    { time: '14:30', label: '2:30 PM' },
    { time: '16:00', label: '4:00 PM' }
  ]

  console.log('📋 Default slots to check:', defaultSlots)

  // TEMPORARY: Skip database check and return all slots as available
  console.log('🔧 TEMPORARY: Skipping database check, returning all slots as available')
  const slotsWithAvailability = defaultSlots.map(slot => ({
    ...slot,
    isAvailable: true,
    bookingCount: 0
  }))

  console.log('✅ Final slots with availability:', slotsWithAvailability)
  return slotsWithAvailability
}

export async function getWorkingDays(): Promise<number[]> {
  // Return Monday-Saturday (1-6)
  return [1, 2, 3, 4, 5, 6]
}

export function isWorkingDay(date: Date, workingDays: number[]): boolean {
  return workingDays.includes(date.getDay())
} 