'use client'

import React, { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useForm, FormProvider } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { BookingFormData } from '@/lib/schemas'
import { VehicleSize, ServiceType, BookingStatus, PaymentStatus, PaymentMethod } from '@/lib/enums'
import { calculateBasePrice, calculateAddOnsPrice, calculateTotalPrice } from '@/lib/utils/pricing'
import { generateBookingReference } from '@/lib/utils/index'
import { content } from '@/lib/content'
import { SERVICES, BOOKING, ROUTES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils/formatters'
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

type BookingStep = 'vehicle' | 'service' | 'datetime' | 'contact' | 'confirmation'

interface BookingFlowProps {
  isAuthenticated?: boolean
  userId?: string
  onSubmit?: (data: BookingFormData) => Promise<void>
  onCancel?: () => void
  defaultValues?: Partial<BookingFormData>
}

interface StepConfig {
  key: BookingStep
  title: string
  description: string
  component: React.ComponentType<any>
}

interface BookingSuccess {
  date: string
  time: string
  reference: string
}

export const BookingFlow: React.FC<BookingFlowProps> = ({
  isAuthenticated = false,
  userId,
  onSubmit,
  onCancel,
  defaultValues = {},
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState<BookingSuccess | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  
  const form = useForm<BookingFormData>({
    defaultValues: {
      customer_name: '',
      email: '',
      phone: '',
      postcode: '',
      vehicle_size: VehicleSize.MEDIUM,
      service_type: ServiceType.BASIC,
      booking_date: '',
      booking_time: '',
      add_ons: [],
      vehicle_images: [],
      total_price: 0,
      travel_fee: 0,
      ...defaultValues,
    },
    mode: 'onChange',
  })

  const { watch, handleSubmit, formState: { errors, isValid } } = form
  const watchedValues = watch()

  // Define booking steps based on authentication status
  const steps: StepConfig[] = [
    {
      key: 'vehicle',
      title: content.pages.booking.steps.vehicleDetails.title,
      description: content.pages.booking.steps.vehicleDetails.description,
      component: VehicleDetailsStep,
    },
    {
      key: 'service',
      title: content.pages.booking.steps.serviceSelection.title,
      description: content.pages.booking.steps.serviceSelection.description,
      component: ServiceSelectionStep,
    },
    {
      key: 'datetime',
      title: content.pages.booking.steps.dateTime.title,
      description: content.pages.booking.steps.dateTime.description,
      component: DateTimeStep,
    },
    // Only show contact details step for guest users
    ...(isAuthenticated ? [] : [{
      key: 'contact' as const,
      title: content.pages.booking.steps.contactDetails.title,
      description: content.pages.booking.steps.contactDetails.description,
      component: ContactDetailsStep,
    }]),
    {
      key: 'confirmation',
      title: content.pages.booking.steps.confirmation.title,
      description: content.pages.booking.steps.confirmation.description,
      component: ConfirmationStep,
    },
  ]

  const currentStep = steps[currentStepIndex]
  const isLastStep = currentStepIndex === steps.length - 1

  // Calculate pricing in real-time
  const pricing = React.useMemo(() => {
    if (!watchedValues.vehicle_size || !watchedValues.service_type) {
      return { basePrice: 0, addOnsPrice: 0, subtotal: 0, discount: 0, total: 0 }
    }
    
    const basePrice = calculateBasePrice(watchedValues.vehicle_size, watchedValues.service_type)
    const addOnsPrice = calculateAddOnsPrice(watchedValues.add_ons || [])
    const total = calculateTotalPrice(watchedValues.vehicle_size, watchedValues.service_type, watchedValues.add_ons || [])

    return { 
      basePrice,
      addOnsPrice,
      subtotal: basePrice + addOnsPrice,
      discount: 0, // No discounts for now
      total
    }
  }, [watchedValues.vehicle_size, watchedValues.service_type, watchedValues.add_ons])

  // Navigation handlers
  const goToNextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1)
    }
  }, [currentStepIndex, steps.length])

  const goToPreviousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }, [currentStepIndex])

  // Handle form submission
  const onFormSubmit = async (formData: BookingFormData) => {
    try {
      setIsSubmitting(true)

      // Generate booking reference
      const reference = generateBookingReference()

      // Create booking object
      const booking = {
        id: reference,
        user_id: userId,
        customer_name: formData.customer_name,
        email: formData.email,
        phone: formData.phone,
        postcode: formData.postcode,
        vehicle_size: formData.vehicle_size,
        service_type: formData.service_type,
        booking_date: formData.booking_date,
        booking_time: formData.booking_time,
        add_ons: formData.add_ons || [],
        vehicle_images: formData.vehicle_images || [],
        special_requests: formData.special_requests,
        total_price: pricing.total,
        travel_fee: 0,
        status: BookingStatus.PENDING,
        payment_status: PaymentStatus.PENDING,
        payment_method: PaymentMethod.CARD,
        vehicle_lookup: formData.vehicle_lookup,
        booking_reference: reference,
        notes: formData.notes
      }

      // Submit booking
      await onSubmit?.(booking)

      // Show success state
      setBookingSuccess({
        date: formData.booking_date,
        time: formData.booking_time,
        reference: reference
      })

      // Reset form
      form.reset()
    } catch (error) {
      console.error('Error submitting booking:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit booking. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show success screen if booking is successful
  if (bookingSuccess) {
    return (
      <BookingSuccess
        bookingDate={bookingSuccess.date}
        bookingTime={bookingSuccess.time}
        bookingReference={bookingSuccess.reference}
      />
    )
  }

  return (
    <FormProvider {...form}>
      <Card>
        <CardHeader>
          <CardTitle>{currentStep.title}</CardTitle>
          <StepHeader
            currentStep={currentStepIndex + 1}
            totalSteps={steps.length}
            title={currentStep.title}
            description={currentStep.description}
          />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
            {React.createElement(currentStep.component, {
              isAuthenticated,
              userId,
              pricing,
            })}
            
            <div className="flex justify-between space-x-4">
              {currentStepIndex > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPreviousStep}
                  disabled={isSubmitting}
                >
                  {content.pages.booking.buttons.previous}
                </Button>
              )}
              
              <Button
                type={isLastStep ? 'submit' : 'button'}
                onClick={!isLastStep ? goToNextStep : undefined}
                disabled={isSubmitting || !isValid}
                className="ml-auto"
              >
                {isSubmitting ? (
                  content.pages.booking.buttons.processing
                ) : isLastStep ? (
                  content.pages.booking.buttons.submit
                ) : (
                  content.pages.booking.buttons.next
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  )
} 