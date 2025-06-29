'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useForm, FormProvider } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { BookingFormData, BookingRequest } from '@/lib/schemas/types'
import { VehicleSize, ServiceType, BookingStatus, PaymentStatus, PaymentMethod } from '@/lib/enums'
import { calculateBasePrice, calculateAddOnsPrice, calculateTotalPrice } from '@/lib/utils/pricing'
import { generateBookingReference } from '@/lib/utils/index'
import { content } from '@/lib/content'
import { SERVICES, BOOKING, ROUTES } from '@/lib/constants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { StepHeader } from '@/components/ui/StepHeader'
import { Button } from '@/components/ui/Button'
import { VehicleDetailsStep } from './steps/VehicleDetailsStep'
import { ServiceSelectionStep } from './steps/ServiceSelectionStep'
import { DateTimeStep } from './steps/DateTimeStep'
import { ContactDetailsStep } from './steps/ContactDetailsStep'
import { ConfirmationStep } from './steps/ConfirmationStep'
import { BookingSuccess } from './BookingSuccess'
import { useBookingForm } from '@/hooks/useBookingForm'

type BookingStep = 'vehicle' | 'contact' | 'datetime' | 'confirmation'

interface StepConfig {
  key: BookingStep
  title: string
  description: string
  component: React.ComponentType<any>
}

interface BookingFlowProps {
  isAuthenticated?: boolean
  userId?: string
}

export const BookingFlow: React.FC<BookingFlowProps> = ({
  isAuthenticated = false,
  userId,
}) => {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [bookingDetails, setBookingDetails] = useState<{
    date: string
    time: string
    reference: string
  } | null>(null)

  // Initialize form with default values
  const form = useForm<BookingFormData>({
    defaultValues: {
      vehicleSize: VehicleSize.MEDIUM,
      addOnIds: [],
      vehicle_images: [],
      total_price: 0,
      status: BookingStatus.PENDING,
      payment_status: PaymentStatus.PENDING,
      payment_method: PaymentMethod.CARD,
      requires_manual_approval: false
    }
  })

  // Handle form submission
  const onSubmit = async (data: BookingFormData) => {
    try {
      setIsSubmitting(true)

      // Transform form data to API format
      const bookingRequest: BookingRequest = {
        user_id: userId,
        customer_name: data.fullName,
        email: data.email,
        phone: data.phone,
        postcode: data.postcode,
        address: data.address,
        vehicle_size: data.vehicleSize,
        service_type: data.serviceId as ServiceType,
        booking_date: data.date,
        booking_time: data.timeSlot,
        add_ons: data.addOnIds,
        vehicle_images: data.vehicle_images,
        vehicle_lookup: data.vehicle_lookup,
        total_price: data.total_price,
        travel_fee: data.travel_fee || 0,
        status: BookingStatus.PENDING,
        payment_status: PaymentStatus.PENDING,
        payment_method: PaymentMethod.CARD,
        special_requests: data.special_requests,
        notes: data.notes,
        requires_manual_approval: false,
        distance: data.distance,
        booking_reference: generateBookingReference()
      }

      // Submit booking
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingRequest)
      })

      if (!response.ok) {
        throw new Error('Failed to create booking')
      }

      // Create user account if not authenticated
      if (!isAuthenticated) {
        const authResponse = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            name: data.fullName
          })
        })

        if (!authResponse.ok) {
          console.error('Failed to create user account')
        }
      }

      setBookingDetails({
        date: data.date,
        time: data.timeSlot,
        reference: bookingRequest.booking_reference || generateBookingReference()
      })
      setIsSuccess(true)
      toast({
        title: 'Booking Confirmed!',
        description: 'Your booking has been successfully created.',
        variant: 'default'
      })

    } catch (error) {
      console.error('Booking submission error:', error)
      toast({
        title: 'Booking Failed',
        description: 'There was an error creating your booking. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Define booking steps based on authentication status
  const steps: StepConfig[] = [
    {
      key: 'vehicle',
      title: content.pages.booking.steps.vehicleDetails.title,
      description: content.pages.booking.steps.vehicleDetails.description,
      component: VehicleDetailsStep,
    },
    // Only show contact details step for guest users
    ...(isAuthenticated ? [] : [{
      key: 'contact' as const,
      title: content.pages.booking.steps.contactDetails.title,
      description: content.pages.booking.steps.contactDetails.description,
      component: ContactDetailsStep,
    }]),
    {
      key: 'datetime',
      title: content.pages.booking.steps.dateTime.title,
      description: content.pages.booking.steps.dateTime.description,
      component: DateTimeStep,
    },
    {
      key: 'confirmation',
      title: content.pages.booking.steps.confirmation.title,
      description: content.pages.booking.steps.confirmation.description,
      component: ConfirmationStep,
    },
  ]

  const currentStep = steps[currentStepIndex]
  const isLastStep = currentStepIndex === steps.length - 1

  // Navigation handlers
  const handleNext = async () => {
    const fields = form.getValues()
    const isValid = await form.trigger()
    
    if (!isValid) {
      return
    }

    if (isLastStep) {
      form.handleSubmit(onSubmit)()
    } else {
      setCurrentStepIndex(i => i + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStepIndex(i => i - 1)
  }

  if (isSuccess && bookingDetails) {
    return (
      <BookingSuccess
        bookingDate={bookingDetails.date}
        bookingTime={bookingDetails.time}
        bookingReference={bookingDetails.reference}
      />
    )
  }

  return (
    <FormProvider {...form}>
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div
                key={step.key}
                className={`flex items-center ${
                  index < currentStepIndex
                    ? 'text-[var(--color-primary)]'
                    : index === currentStepIndex
                    ? 'text-[var(--color-text)]'
                    : 'text-muted-foreground'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center border-2
                      ${
                        index < currentStepIndex
                          ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                          : index === currentStepIndex
                          ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                          : 'border-muted-foreground'
                      }
                    `}
                  >
                    {index + 1}
                  </div>
                  <span className="text-sm mt-2">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`
                      flex-1 h-0.5 mx-4 mt-4
                      ${
                        index < currentStepIndex
                          ? 'bg-[var(--color-primary)]'
                          : 'bg-muted-foreground/30'
                      }
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{currentStep.title}</CardTitle>
            <p className="text-muted-foreground">{currentStep.description}</p>
          </CardHeader>
          <CardContent>
            <currentStep.component
              isAuthenticated={isAuthenticated}
              userId={userId}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0 || isSubmitting}
          >
            {content.pages.booking.buttons.previous}
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            loading={isSubmitting}
            loadingText={content.pages.booking.buttons.processing}
          >
            {isLastStep
              ? content.pages.booking.buttons.submit
              : content.pages.booking.buttons.next}
          </Button>
        </div>
      </div>
    </FormProvider>
  )
} 