'use client'

import { useState } from 'react'
import { useBookingStore } from '@/lib/stores/booking'
import { VehicleDetailsStep } from './steps/VehicleDetailsStep'
import { ServiceSelectionStep } from './steps/ServiceSelectionStep'
import { DateTimeStep } from './steps/DateTimeStep'
import { ContactDetailsStep } from './steps/ContactDetailsStep'
import { ConfirmationStep } from './steps/ConfirmationStep'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Progress } from '@/components/ui/progress'

const STEPS = [
  {
    id: 'vehicle',
    title: 'Vehicle Details',
    component: VehicleDetailsStep,
    validate: (state: ReturnType<typeof useBookingStore.getState>) => 
      !!state.vehicle && !!state.vehicleSize
  },
  {
    id: 'service',
    title: 'Service Selection',
    component: ServiceSelectionStep,
    validate: (state: ReturnType<typeof useBookingStore.getState>) => 
      !!state.serviceType
  },
  {
    id: 'datetime',
    title: 'Date & Time',
    component: DateTimeStep,
    validate: (state: ReturnType<typeof useBookingStore.getState>) => 
      !!state.date && !!state.timeSlot
  },
  {
    id: 'contact',
    title: 'Contact Details',
    component: ContactDetailsStep,
    validate: (state: ReturnType<typeof useBookingStore.getState>) => 
      !!state.fullName && 
      !!state.email && 
      !!state.phone && 
      !!state.postcode && 
      !!state.address
  },
  {
    id: 'confirmation',
    title: 'Confirmation',
    component: ConfirmationStep,
    validate: () => true
  }
]

export function BookingFlow() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const store = useBookingStore()
  
  const currentStep = STEPS[currentStepIndex]
  const StepComponent = currentStep.component
  
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === STEPS.length - 1
  
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100
  
  const canGoNext = currentStep.validate(store)
  
  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }
  
  const goToNextStep = () => {
    if (!isLastStep && canGoNext) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <h2 className="text-lg font-semibold">
            {currentStep.title}
          </h2>
          <span className="text-sm text-muted-foreground">
            Step {currentStepIndex + 1} of {STEPS.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {/* Step Content */}
      <Card className="p-6">
        <StepComponent />
      </Card>
      
      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={isFirstStep}
        >
          Previous
        </Button>
        
        {!isLastStep && (
          <Button
            onClick={goToNextStep}
            disabled={!canGoNext}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  )
} 