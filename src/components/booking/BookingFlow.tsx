'use client'

import React, { useState, useCallback, useRef } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  guestBookingSchema, 
  userBookingSchema, 
  type GuestBookingData, 
  type UserBookingData,
  type BookingStatus,
  type PaymentStatus,
  type PaymentMethod,
  type BookingData
} from '@/lib/schemas'
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
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

interface BookingFlowProps {
  isAuthenticated?: boolean
  userId?: string
  onSubmit?: (data: BookingData) => Promise<void>
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
  const _bookingReference = useRef<string>('')
  const { toast } = useToast()
  const router = useRouter()
  const { isAuthenticated: authIsAuthenticated } = useAuth()

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
  const onFormSubmit = async (formData: GuestBookingData | UserBookingData) => {
    try {
      setIsSubmitting(true)
      
      // Generate booking reference
      const reference = generateBookingReference()
      _bookingReference.current = reference
      
      // Prepare booking data
      const bookingData: BookingData = {
        id: reference,
        customerName: isAuthenticated ? watchedValues.fullName : formData.fullName,
        email: isAuthenticated ? watchedValues.email : formData.email,
        phone: isAuthenticated ? watchedValues.phone : formData.phone,
        serviceName: formData.servicePackage,
        date: formData.date,
        timeSlot: formData.timeSlot,
        vehicleInfo: isAuthenticated 
          ? `${formData.newVehicle?.make} ${formData.newVehicle?.model}`
          : `${formData.vehicleMake} ${formData.vehicleModel}`,
        address: isAuthenticated ? watchedValues.address : formData.address,
        postcode: isAuthenticated ? watchedValues.postcode : formData.postcode,
        totalAmount: pricing.total,
        status: 'pending' as BookingStatus,
        paymentMethod: BOOKING.payment.method as PaymentMethod,
        paymentStatus: 'unpaid' as PaymentStatus,
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

  // Step validation
  const validateCurrentStep = useCallback((): boolean => {
    const stepFields: Record<BookingStep, Array<keyof (GuestBookingData & UserBookingData)>> = {
      vehicle: ['vehicleSize', 'vehicleMake', 'vehicleModel'],
      service: ['servicePackage'],
      datetime: ['date', 'timeSlot'],
      contact: ['fullName', 'email', 'phone', 'address', 'postcode'],
      confirmation: [],
    }
    
    const fieldsToValidate = stepFields[currentStep.key] || []
    
    return fieldsToValidate.every(field => {
      const error = errors[field]
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
            <StepComponent />
            
            <div className="mt-6 flex justify-between">
              {currentStepIndex > 0 && (
                <Button
                  onClick={goToPreviousStep}
                  variant="outline"
                  disabled={isSubmitting}
                >
                  Previous
                </Button>
              )}
              
              {isLastStep ? (
                <Button
                  onClick={handleSubmit(onFormSubmit)}
                  disabled={!isValid || isSubmitting}
                  loading={isSubmitting}
                >
                  Submit Booking
                </Button>
              ) : (
                <Button
                  onClick={goToNextStep}
                  disabled={!canProceed || isSubmitting}
                >
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  )
} 