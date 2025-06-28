'use client'

import React, { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { BOOKING } from '@/lib/constants'
import { content } from '@/lib/content'
import { isDateAvailable, getAvailableTimeSlots, formatDate } from '@/lib/utils/index'
import { FormSection } from '@/components/ui/FormSection'
import { InputGroup } from '@/components/ui/InputGroup'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface DateTimeStepProps {
  isAuthenticated?: boolean
  userId?: string
  pricing?: {
    basePrice: number
    addOnsPrice: number
    subtotal: number
    discount: number
    total: number
  }
  watchedValues?: {
    date?: string
    timeSlot?: string
  }
}

export const DateTimeStep: React.FC<DateTimeStepProps> = ({
  watchedValues,
}) => {
  const { setValue, watch, formState: { errors } } = useFormContext()
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  
  const selectedDate = watch('date') || ''
  const selectedTimeSlot = watch('timeSlot') || ''

  // Calculate date constraints
  const today = new Date()
  const minDate = new Date(today)
  minDate.setDate(today.getDate() + 1) // Next day minimum
  
  const maxDate = new Date(today)
  maxDate.setDate(today.getDate() + BOOKING.constraints.advanceBookingDays)

  const minDateString = minDate.toISOString().split('T')[0]
  const maxDateString = maxDate.toISOString().split('T')[0]

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
            label="Select Date"
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
                Selected Date
              </p>
              <p className="text-[var(--color-primary)] font-semibold">
                {formatDate(new Date(selectedDate), 'long')}
              </p>
            </div>
          )}
        </div>
      </FormSection>

      {/* Time Slot Selection */}
      {selectedDate && (
        <FormSection
          title="Choose Time Slot"
          description="Select your preferred appointment time"
          variant="default"
          required
        >
          {isLoadingSlots ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <div className="animate-spin w-5 h-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full"></div>
                <span className="text-muted-foreground">Checking availability...</span>
              </div>
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                {content.pages.booking.steps.dateTime.unavailableMessage}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => setValue('date', '', { shouldValidate: true })}
              >
                Choose Different Date
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {BOOKING.timeSlots.map((timeSlot) => {
                const isAvailable = availableSlots.includes(timeSlot)
                const isSelected = selectedTimeSlot === timeSlot
                const isBooked = bookedSlots.includes(timeSlot)
                
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
                    
                    <div className={isSelected ? 'pr-8' : ''}>
                      <p className={`font-medium ${
                        isSelected 
                          ? 'text-[var(--color-primary)]' 
                          : isAvailable 
                          ? 'text-[var(--color-text)]' 
                          : 'text-muted-foreground'
                      }`}>
                        {timeSlot}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {isBooked 
                          ? 'Unavailable' 
                          : isAvailable 
                          ? 'Available' 
                          : 'Booked'
                        }
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </FormSection>
      )}

      {/* Booking Summary */}
      {selectedDate && selectedTimeSlot && (
        <FormSection
          title="Appointment Summary"
          description="Please confirm your selected date and time"
          variant="glass"
        >
          <div className="bg-background/50 rounded-lg p-4 border">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                  Date
                </p>
                <p className="text-muted-foreground">
                  {formatDate(new Date(selectedDate), 'long')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                  Time
                </p>
                <p className="text-muted-foreground">
                  {selectedTimeSlot}
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-[var(--color-info)]/10 rounded-lg border border-[var(--color-info)]/20">
              <p className="text-sm text-[var(--color-info)] font-medium mb-1">
                Important Information
              </p>
              <p className="text-xs text-muted-foreground">
                • Please ensure someone is available at the service address
              </p>
              <p className="text-xs text-muted-foreground">
                • {BOOKING.payment.refundPolicy}
              </p>
              <p className="text-xs text-muted-foreground">
                • Our team will arrive within a 30-minute window of your selected time
              </p>
            </div>
          </div>
        </FormSection>
      )}
    </div>
  )
} 