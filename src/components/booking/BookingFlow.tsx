'use client'

import React, { useState, useCallback } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { guestBookingSchema, userBookingSchema, type GuestBookingData, type UserBookingData } from '@/lib/schemas'
import { content } from '@/lib/content'
import { SERVICES, BOOKING } from '@/lib/constants'
import { calculateTotalPrice, generateBookingReference } from '@/lib/utils/index'
import { formatCurrency } from '@/lib/utils/formatters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { StepHeader } from '@/components/ui/StepHeader'
import { Button } from '@/components/ui/Button'
import { VehicleDetailsStep } from './steps/VehicleDetailsStep'
import { ServiceSelectionStep } from './steps/ServiceSelectionStep'
import { DateTimeStep } from './steps/DateTimeStep'
import { ContactDetailsStep } from './steps/ContactDetailsStep'
import { ConfirmationStep } from './steps/ConfirmationStep'

interface BookingFlowProps {
  isAuthenticated?: boolean
  userId?: string
  onSubmit?: (data: GuestBookingData | UserBookingData) => Promise<void>
  onCancel?: () => void
  defaultValues?: Partial<GuestBookingData | UserBookingData>
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
  const [bookingReference, setBookingReference] = useState<string>()

  // Choose schema based on authentication status
  const schema = isAuthenticated ? userBookingSchema : guestBookingSchema
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      vehicleSize: 'medium',
      servicePackage: 'premium',
      addOns: [],
      vehicleImages: [],
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
    if (!watchedValues.vehicleSize || !watchedValues.servicePackage) {
      return { basePrice: 0, addOnsPrice: 0, subtotal: 0, discount: 0, total: 0 }
    }
    
    return calculateTotalPrice(
      watchedValues.vehicleSize,
      watchedValues.servicePackage,
      watchedValues.addOns || [],
      0 // TODO: Apply loyalty discount for authenticated users
    )
  }, [watchedValues.vehicleSize, watchedValues.servicePackage, watchedValues.addOns])

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
  const onFormSubmit = async (data: GuestBookingData | UserBookingData) => {
    try {
      setIsSubmitting(true)
      
      // Generate booking reference
      const reference = generateBookingReference()
      setBookingReference(reference)
      
      // Prepare booking data
      const bookingData = {
        ...data,
        bookingReference: reference,
        totalPrice: pricing.total,
        status: 'pending' as const,
        paymentMethod: BOOKING.payment.method,
        paymentStatus: 'unpaid' as const,
        createdAt: new Date().toISOString(),
        ...(isAuthenticated && userId && { userId }),
      }
      
      // Submit booking
      if (onSubmit) {
        await onSubmit(bookingData)
      }
      
      // Move to success state (could be a separate component)
      console.log('Booking submitted successfully:', bookingData)
      
    } catch (error) {
      console.error('Booking submission failed:', error)
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false)
    }
  }

  // Step validation
  const validateCurrentStep = useCallback((): boolean => {
    const stepFields: Record<BookingStep, string[]> = {
      vehicle: ['vehicleSize', 'vehicleMake', 'vehicleModel'],
      service: ['servicePackage'],
      datetime: ['date', 'timeSlot'],
      contact: ['fullName', 'email', 'phone', 'address', 'postcode'],
      confirmation: [],
    }
    
    const fieldsToValidate = stepFields[currentStep.key] || []
    
    return fieldsToValidate.every(field => {
      const error = errors[field as keyof typeof errors]
      return !error
    })
  }, [currentStep.key, errors])

  const canProceed = validateCurrentStep()

  // Render current step component
  const StepComponent = currentStep.component
  
  return (
    <FormProvider {...form}>
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[var(--purple-50)] to-[var(--purple-100)] border-b">
            <StepHeader
              title={currentStep.title}
              description={currentStep.description}
              currentStep={currentStepIndex + 1}
              totalSteps={steps.length}
              onBack={currentStepIndex > 0 ? goToPreviousStep : undefined}
              backText={content.pages.booking.buttons.previous}
            />
            
            {/* Pricing summary - always visible */}
            <div className="mt-4 p-4 bg-white/50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {watchedValues.servicePackage && watchedValues.vehicleSize && (
                    <>
                                             {SERVICES.packages[watchedValues.servicePackage as keyof typeof SERVICES.packages]?.name} • {' '}
                       {SERVICES.vehicleSizes[watchedValues.vehicleSize as keyof typeof SERVICES.vehicleSizes]?.label}
                    </>
                  )}
                </div>
                <div className="font-bold text-lg text-[var(--color-primary)]">
                  {formatCurrency(pricing.total)}
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
              <StepComponent
                isAuthenticated={isAuthenticated}
                userId={userId}
                pricing={pricing}
                watchedValues={watchedValues}
              />
              
              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <div className="flex items-center gap-4">
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
                  
                  {onCancel && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={onCancel}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  {!isLastStep ? (
                    <Button
                      type="button"
                      onClick={goToNextStep}
                      disabled={!canProceed || isSubmitting}
                    >
                      {content.pages.booking.buttons.next}
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      loading={isSubmitting}
                      loadingText={content.pages.booking.buttons.processing}
                      disabled={!canProceed}
                    >
                      {content.pages.booking.buttons.submit}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  )
} 