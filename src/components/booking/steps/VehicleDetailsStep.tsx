'use client'

import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { SERVICES } from '@/lib/constants'
import { content } from '@/lib/content'
import { FormSection } from '@/components/ui/FormSection'
import { InputGroup } from '@/components/ui/InputGroup'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { isValidRegistration } from '@/lib/utils/validation'

type VehicleSize = 'small' | 'medium' | 'large' | 'extraLarge'

interface VehicleDetailsStepProps {
  isAuthenticated?: boolean
  userId?: string
}

export const VehicleDetailsStep: React.FC<VehicleDetailsStepProps> = ({
  isAuthenticated = false,
  userId,
}) => {
  const { setValue, watch, formState: { errors } } = useFormContext()
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [lookupError, setLookupError] = useState<string>()
  
  const vehicleRegistration = watch('vehicleRegistration') || ''
  const vehicleMake = watch('vehicleMake') || ''
  const vehicleModel = watch('vehicleModel') || ''
  const vehicleYear = watch('vehicleYear')
  const vehicleColor = watch('vehicleColor') || ''
  const selectedVehicleSize = watch('vehicleSize') || 'medium'

  // Vehicle size selection handler
  const handleVehicleSizeSelect = (sizeId: VehicleSize) => {
    setValue('vehicleSize', sizeId, { shouldValidate: true })
  }

  // Vehicle lookup handler (placeholder for DVLA integration)
  const handleVehicleLookup = async () => {
    if (!vehicleRegistration || !isValidRegistration(vehicleRegistration)) {
      setLookupError(content.pages.booking.steps.vehicleDetails.errors.registration)
      return
    }

    setIsLookingUp(true)
    setLookupError(undefined)

    try {
      // TODO: Integrate with DVLA API or vehicle lookup service
      // For now, this is a placeholder
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      
      // Mock data - replace with actual API response
      const mockVehicleData = {
        make: 'BMW',
        model: '320i',
        year: 2020,
        color: 'Black',
      }
      
      setValue('vehicleMake', mockVehicleData.make, { shouldValidate: true })
      setValue('vehicleModel', mockVehicleData.model, { shouldValidate: true })
      setValue('vehicleYear', mockVehicleData.year, { shouldValidate: true })
      setValue('vehicleColor', mockVehicleData.color, { shouldValidate: true })
      
    } catch (error) {
      setLookupError(content.pages.booking.steps.vehicleDetails.lookup.error)
    } finally {
      setIsLookingUp(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Vehicle Size Selection */}
      <FormSection
        title={content.pages.booking.steps.vehicleDetails.fields.size.title}
        description={content.pages.booking.steps.vehicleDetails.fields.size.description}
        variant="card"
        required
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(SERVICES.vehicleSizes).map(([sizeId, sizeData]) => {
            const isSelected = selectedVehicleSize === sizeId
            
            return (
              <div
                key={sizeId}
                className={`
                  relative cursor-pointer rounded-lg border p-4 transition-all duration-200
                  ${isSelected 
                    ? 'border-[var(--color-primary)] bg-[var(--purple-50)] ring-2 ring-[var(--color-primary)]' 
                    : 'border-border bg-background hover:border-[var(--color-primary)]/50'
                  }
                `}
                onClick={() => handleVehicleSizeSelect(sizeId as VehicleSize)}
              >
                {/* Selection indicator */}
                <div className="absolute top-3 right-3">
                  <div className={`
                    w-5 h-5 rounded-full border-2 transition-all duration-200
                    ${isSelected 
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' 
                      : 'border-muted-foreground/30'
                    }
                  `}>
                    {isSelected && (
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
                    )}
                  </div>
                </div>
                
                <div className="pr-8">
                  <h4 className="font-medium text-[var(--color-text)] mb-2">
                    {sizeData.label}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {sizeData.description}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium">Examples:</p>
                    <p>{sizeData.examples.join(', ')}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </FormSection>

      {/* Vehicle Registration Lookup */}
      <FormSection
        title={content.pages.booking.steps.vehicleDetails.fields.registration}
        description="Enter your registration for automatic vehicle details lookup"
        variant="default"
      >
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                label={content.pages.booking.steps.vehicleDetails.fields.registration}
                placeholder="e.g. AB12 CDE"
                value={vehicleRegistration}
                onChange={(e) => setValue('vehicleRegistration', e.target.value.toUpperCase())}
                error={lookupError}
                helperText="UK registration format (optional)"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleVehicleLookup}
                disabled={!vehicleRegistration || isLookingUp}
                loading={isLookingUp}
                loadingText={content.pages.booking.steps.vehicleDetails.lookup.loading}
              >
                {content.pages.booking.steps.vehicleDetails.lookup.button}
              </Button>
            </div>
          </div>
        </div>
      </FormSection>

      {/* Manual Vehicle Details */}
      <FormSection
        title="Vehicle Details"
        description="Enter your vehicle details manually"
        variant="default"
        required
      >
        <InputGroup layout="responsive" columns={2}>
          <Input
            label={content.pages.booking.steps.vehicleDetails.fields.make}
            placeholder="e.g. BMW"
            value={vehicleMake}
            onChange={(e) => setValue('vehicleMake', e.target.value, { shouldValidate: true })}
            error={errors.vehicleMake?.message as string}
            required
          />
          <Input
            label={content.pages.booking.steps.vehicleDetails.fields.model}
            placeholder="e.g. 320i"
            value={vehicleModel}
            onChange={(e) => setValue('vehicleModel', e.target.value, { shouldValidate: true })}
            error={errors.vehicleModel?.message as string}
            required
          />
          <Input
            label={content.pages.booking.steps.vehicleDetails.fields.year}
            type="number"
            placeholder="e.g. 2020"
            value={vehicleYear}
            onChange={(e) => setValue('vehicleYear', parseInt(e.target.value), { shouldValidate: true })}
            error={errors.vehicleYear?.message as string}
          />
          <Input
            label={content.pages.booking.steps.vehicleDetails.fields.color}
            placeholder="e.g. Black"
            value={vehicleColor}
            onChange={(e) => setValue('vehicleColor', e.target.value, { shouldValidate: true })}
            error={errors.vehicleColor?.message as string}
          />
        </InputGroup>
      </FormSection>
    </div>
  )
} 