'use client'

import React, { useState, useCallback, useRef } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  bookingSchema,
  type BookingData,
  type BookingFormData
} from '@/lib/schemas'
import {
  BookingStatus,
  PaymentStatus,
  PaymentMethod,
  ServiceType,
  VehicleSize
} from '@/lib/enums'
import { content } from '@/lib/content'
import { SERVICES, BOOKING } from '@/lib/constants'
import { calculateBasePrice, calculateTotalPrice, generateBookingReference } from '@/lib/utils/index'
import { formatCurrency } from '@/lib/utils/formatters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { StepHeader } from '@/components/ui/StepHeader'
import { Button } from '@/components/ui/Button'
import { VehicleDetailsStep } from './steps/VehicleDetailsStep'
import { ServiceSelectionStep } from './steps/ServiceSelectionStep'
import { DateTimeStep } from './steps/DateTimeStep'
import { ContactDetailsStep } from './steps/ContactDetailsStep'
import { ConfirmationStep } from './steps/ConfirmationStep'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

interface BookingFlowProps {
  isAuthenticated?: boolean
  userId?: string
  onSubmit?: (data: BookingData) => Promise<void>
  onCancel?: () => void
  defaultValues?: Partial<BookingFormData>
}

type BookingStep = 'vehicle' | 'service' | 'datetime' | 'contact' | 'confirmation'

interface StepConfig {
  key: BookingStep
  title: string
  description: string
  component: React.ComponentType<any>
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
  const _bookingReference = useRef<string>('')
  const { toast } = useToast()
  const router = useRouter()
  const { isAuthenticated: authIsAuthenticated } = useAuth()
  
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      vehicle_size: VehicleSize.MEDIUM,
      service_type: ServiceType.PREMIUM,
      add_ons: [],
      vehicle_images: [],
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
    
    const basePrice = calculateBasePrice(
      watchedValues.service_type,
      watchedValues.vehicle_size,
      watchedValues.add_ons || []
    )
    return { 
      basePrice,
      addOnsPrice: 0, // TODO: Calculate add-ons price
      subtotal: basePrice,
      discount: 0, // TODO: Apply loyalty discount
      total: calculateTotalPrice(basePrice, 0) // 0% discount for now
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

  // Form submission
  const onFormSubmit = async (formData: BookingFormData) => {
    try {
      setIsSubmitting(true)
      
      // Generate booking reference
      const reference = generateBookingReference()
      _bookingReference.current = reference
      
      // Prepare booking data
      const bookingData: BookingData = {
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
      if (onSubmit) {
        await onSubmit(bookingData)
      }
      
      // Show success message
      toast({
        title: 'Booking Submitted',
        description: 'Your booking has been successfully submitted.',
      })
      
      // Redirect to confirmation page
      router.push(`/booking/confirmation/${reference}`)
      
    } catch (error) {
      console.error('Booking submission failed:', error)
      toast({
        title: 'Booking Failed',
        description: error instanceof Error ? error.message : 'Failed to submit booking. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
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