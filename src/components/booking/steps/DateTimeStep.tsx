'use client'

import { useState, useEffect } from 'react'
import { useBookingStore } from '@/lib/stores/booking'
import { format, addDays, startOfDay } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Loader2 } from 'lucide-react'

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00'
]

export function DateTimeStep() {
  const store = useBookingStore()
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    store.date ? new Date(store.date) : undefined
  )
  
  // Fetch available slots for the selected date
  useEffect(() => {
    if (!selectedDate) return
    
    const fetchAvailableSlots = async () => {
      setIsLoading(true)
      
      try {
        const response = await fetch(
          `/api/availability?date=${format(selectedDate, 'yyyy-MM-dd')}`
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch availability')
        }
        
        const { slots } = await response.json()
        setAvailableSlots(slots)
        
      } catch (error) {
        console.error('Error fetching availability:', error)
        setAvailableSlots(TIME_SLOTS) // Fallback to all slots
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchAvailableSlots()
  }, [selectedDate])
  
  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    store.setDateTime(date ? format(date, 'yyyy-MM-dd') : null, null)
  }
  
  // Handle time slot selection
  const handleTimeSelect = (slot: string) => {
    store.setDateTime(store.date, slot)
  }
  
  // Calculate disabled dates (past dates and beyond 14 days)
  const disabledDates = {
    before: startOfDay(new Date()),
    after: addDays(new Date(), 14)
  }
  
  return (
    <div className="space-y-8">
      {/* Date Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Date</h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={disabledDates}
          className="rounded-md border"
        />
      </div>
      
      {/* Time Slots */}
      {selectedDate && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Select Time</h3>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {TIME_SLOTS.map((slot) => {
                const isAvailable = availableSlots.includes(slot)
                const isSelected = store.timeSlot === slot
                
                return (
                  <Button
                    key={slot}
                    variant={isSelected ? 'default' : 'outline'}
                    className={`
                      w-full justify-center
                      ${!isAvailable && 'opacity-50 cursor-not-allowed'}
                    `}
                    disabled={!isAvailable}
                    onClick={() => handleTimeSelect(slot)}
                  >
                    {slot}
                  </Button>
                )
              })}
            </div>
          )}
        </div>
      )}
      
      {/* Selected DateTime Summary */}
      {store.date && store.timeSlot && (
        <Card className="p-4">
          <h4 className="font-medium mb-2">Selected Date & Time</h4>
          <p className="text-sm text-muted-foreground">
            {format(new Date(store.date), 'EEEE, MMMM d, yyyy')} at {store.timeSlot}
          </p>
        </Card>
      )}
    </div>
  )
} 