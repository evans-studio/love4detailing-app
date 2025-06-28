'use client'

import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { SERVICES, BRAND } from '@/lib/constants'
import { content } from '@/lib/content'
import type { VehicleSize } from '@/lib/constants'
import { FormSection } from '@/components/ui/FormSection'
import { InputGroup } from '@/components/ui/InputGroup'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { isValidRegistration } from '@/lib/utils/index'

interface VehicleDetailsStepProps {
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
    vehicleSize?: VehicleSize
    vehicleMake?: string
    vehicleModel?: string
    vehicleYear?: number
  }
}

export const VehicleDetailsStep: React.FC<VehicleDetailsStepProps> = ({
  isAuthenticated,
  watchedValues,
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
      setLookupError('Please enter a valid UK registration number')
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
      setLookupError('Vehicle lookup failed. Please enter details manually.')
    } finally {
      setIsLookingUp(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Vehicle Size Selection */}
      <FormSection
        title="Select Vehicle Size"
        description="Choose your vehicle size category for accurate pricing"
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
        title="Vehicle Registration (Optional)"
        description="Enter your registration for automatic vehicle details lookup"
        variant="default"
      >
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                label="Registration Number"
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
                loadingText="Looking up..."
              >
                Lookup
              </Button>
            </div>
          </div>
        </div>
      </FormSection>

      {/* Manual Vehicle Details */}
      <FormSection
        title={content.pages.booking.steps.vehicleDetails.fields.make}
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
        </InputGroup>

        <InputGroup layout="responsive" columns={2}>
          <Input
            type="number"
            label={content.pages.booking.steps.vehicleDetails.fields.year}
            placeholder="e.g. 2020"
            value={vehicleYear || ''}
            onChange={(e) => setValue('vehicleYear', e.target.value ? parseInt(e.target.value) : undefined, { shouldValidate: true })}
            error={errors.vehicleYear?.message as string}
            helperText="Optional"
          />
          
          <Input
            label={content.pages.booking.steps.vehicleDetails.fields.color}
            placeholder="e.g. Black"
            value={vehicleColor}
            onChange={(e) => setValue('vehicleColor', e.target.value, { shouldValidate: true })}
            error={errors.vehicleColor?.message as string}
            helperText="Optional"
          />
        </InputGroup>
      </FormSection>

      {/* Vehicle Summary */}
      {(vehicleMake || vehicleModel) && (
        <FormSection
          title="Vehicle Summary"
          description="Please confirm your vehicle details"
          variant="glass"
        >
          <div className="bg-background/50 rounded-lg p-4 border">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">Vehicle</p>
                <p className="text-muted-foreground">
                  {vehicleYear && `${vehicleYear} `}
                  {vehicleMake} {vehicleModel}
                  {vehicleColor && ` (${vehicleColor})`}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">Size Category</p>
                <p className="text-muted-foreground">
                  {SERVICES.vehicleSizes[selectedVehicleSize as VehicleSize]?.label}
                </p>
              </div>
              {vehicleRegistration && (
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Registration</p>
                  <p className="text-muted-foreground">{vehicleRegistration}</p>
                </div>
              )}
            </div>
          </div>
        </FormSection>
      )}
    </div>
  )
} 