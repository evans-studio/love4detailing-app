'use client'

import React, { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { BOOKING } from '@/lib/constants'
import { content } from '@/lib/content'
import { FormSection } from '@/components/ui/FormSection'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Loader2 } from 'lucide-react'
import { 
  formatDate, 
  getBookingWindow, 
  isDateAvailable, 
  getAvailableTimeSlots,
  formatTime,
} from '@/lib/date'

interface DateTimeStepProps {
  isAuthenticated?: boolean
  userId?: string
}

export const DateTimeStep: React.FC<DateTimeStepProps> = ({
  isAuthenticated = false,
  userId,
}) => {
  const { setValue, watch, formState: { errors } } = useFormContext()
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  
  const selectedDate = watch('date') || ''
  const selectedTimeSlot = watch('timeSlot') || ''

  // Get booking window constraints
  const { minDateString, maxDateString } = getBookingWindow()

  // Load booked slots when date changes
  useEffect(() => {
    if (selectedDate && isDateAvailable(selectedDate)) {
      loadBookedSlots(selectedDate)
    }
  }, [selectedDate])

  const loadBookedSlots = async (date: string) => {
    setIsLoadingSlots(true)
    try {
      // TODO: Replace with actual API call to get booked slots
      // For now, simulate some booked slots
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock booked slots - replace with real data
      const mockBookedSlots = ['10:30', '15:00'] // Example booked times
      setBookedSlots(mockBookedSlots)
      
    } catch (error) {
      console.error('Failed to load booked slots:', error)
      setBookedSlots([])
    } finally {
      setIsLoadingSlots(false)
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    
    if (!isDateAvailable(newDate)) {
      return // Don't allow invalid dates
    }
    
    setValue('date', newDate, { shouldValidate: true })
    setValue('timeSlot', '', { shouldValidate: true }) // Reset time slot when date changes
  }

  const handleTimeSlotSelect = (timeSlot: string) => {
    setValue('timeSlot', timeSlot, { shouldValidate: true })
  }

  // Get available time slots for selected date
  const availableSlots = selectedDate ? getAvailableTimeSlots(selectedDate, bookedSlots) : []

  return (
    <div className="space-y-8">
      {/* Date Selection */}
      <FormSection
        title={content.pages.booking.steps.dateTime.title}
        description={content.pages.booking.steps.dateTime.description}
        variant="card"
        required
      >
        <div className="space-y-4">
          <Input
            type="date"
            label={content.pages.booking.steps.dateTime.fields.date.label}
            value={selectedDate}
            onChange={handleDateChange}
            min={minDateString}
            max={maxDateString}
            error={errors.date?.message as string}
            helperText={content.pages.booking.steps.dateTime.advanceBookingNote}
            required
          />
          
          {selectedDate && (
            <div className="p-4 bg-[var(--purple-50)] rounded-lg border border-[var(--purple-200)]">
              <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                {content.pages.booking.steps.dateTime.messages.selectedDate}
              </p>
              <p className="text-[var(--color-primary)] font-semibold">
                {formatDate(selectedDate, 'LONG')}
              </p>
            </div>
          )}
        </div>
      </FormSection>

      {/* Time Slot Selection */}
      {selectedDate && (
        <FormSection
          title={content.pages.booking.steps.dateTime.fields.time.label}
          description={content.pages.booking.steps.dateTime.fields.time.description}
          variant="default"
          required
        >
          {isLoadingSlots ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-[var(--color-primary)]" />
                <span className="text-muted-foreground">{content.pages.booking.steps.dateTime.messages.loading}</span>
              </div>
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                {content.pages.booking.steps.dateTime.messages.unavailable}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => setValue('date', '', { shouldValidate: true })}
              >
                {content.pages.booking.steps.dateTime.messages.chooseAnother}
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {availableSlots.map((timeSlot) => {
                const isSelected = selectedTimeSlot === timeSlot
                const isBooked = bookedSlots.includes(timeSlot)
                const isAvailable = !isBooked
                
                return (
                  <button
                    key={timeSlot}
                    type="button"
                    onClick={() => isAvailable ? handleTimeSlotSelect(timeSlot) : null}
                    disabled={!isAvailable}
                    className={`
                      relative p-4 rounded-lg border text-left transition-all duration-200
                      ${isSelected
                        ? 'border-[var(--color-primary)] bg-[var(--purple-50)] ring-2 ring-[var(--color-primary)]'
                        : isAvailable
                        ? 'border-border bg-background hover:border-[var(--color-primary)]/50 hover:bg-[var(--purple-50)]/30'
                        : 'border-muted bg-muted/30 cursor-not-allowed opacity-50'
                      }
                    `}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <div className="w-5 h-5 rounded-full bg-[var(--color-primary)] border-2 border-[var(--color-primary)]">
                          <svg 
                            className="w-3 h-3 text-white m-0.5" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                          >
                            <path 
                              fillRule="evenodd" 
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                    
                    <div className="pr-8">
                      <p className="font-medium text-[var(--color-text)]">
                        {formatTime(timeSlot)}
                      </p>
                      {isBooked && (
                        <p className="text-sm text-[var(--color-error)]">
                          {content.pages.booking.steps.dateTime.errors.unavailable}
                        </p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </FormSection>
      )}
    </div>
  )
} 