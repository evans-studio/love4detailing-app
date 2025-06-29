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
import { ImageUpload } from '@/components/ui/ImageUpload'
import { VehicleSize } from '@/lib/enums'
import type { BookingFormData } from '@/lib/schemas/types'

interface VehicleDetailsStepProps {
  isAuthenticated?: boolean
  userId?: string
}

export const VehicleDetailsStep: React.FC<VehicleDetailsStepProps> = ({
  isAuthenticated = false,
  userId,
}) => {
  const { setValue, watch, formState: { errors } } = useFormContext<BookingFormData>()
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [lookupError, setLookupError] = useState<string>()
  
  const registration = watch('registration') || ''
  const vehicleLookup = watch('vehicle_lookup')
  const vehicleImages = watch('vehicle_images') || []
  const selectedVehicleSize = watch('vehicleSize') || VehicleSize.MEDIUM

  // Vehicle size selection handler
  const handleVehicleSizeSelect = (size: VehicleSize) => {
    setValue('vehicleSize', size, { shouldValidate: true })
    setValue('vehicle_lookup', {
      ...vehicleLookup,
      size: vehicleSizeToLookupSize[size]
    }, { shouldValidate: true })
  }

  // Vehicle lookup handler (DVLA API integration)
  const handleVehicleLookup = async () => {
    if (!registration || !isValidRegistration(registration)) {
      setLookupError(content.pages.booking.steps.vehicleDetails.errors.registration)
      return
    }

    setIsLookingUp(true)
    setLookupError(undefined)

    try {
      // Call DVLA API
      const response = await fetch(`/api/vehicle-lookup?registration=${registration}`)
      if (!response.ok) {
        throw new Error('Vehicle lookup failed')
      }
      
      const vehicleData = await response.json()
      
      // Update form with vehicle data
      setValue('vehicle_lookup', {
        make: vehicleData.make,
        model: vehicleData.model,
        registration: registration,
        year: vehicleData.year,
        color: vehicleData.color,
        size: vehicleSizeToLookupSize[selectedVehicleSize],
        notes: ''
      }, { shouldValidate: true })
      
      // Auto-select vehicle size based on model data
      const suggestedSize = getSuggestedVehicleSize(vehicleData)
      if (suggestedSize) {
        handleVehicleSizeSelect(suggestedSize)
      }
      
    } catch (error) {
      setLookupError(content.pages.booking.steps.vehicleDetails.lookup.error)
    } finally {
      setIsLookingUp(false)
    }
  }

  // Handle image upload
  const handleImageUpload = async (files: File[]) => {
    try {
      // Upload images to Supabase storage
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/upload-vehicle-image', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          throw new Error('Image upload failed')
        }
        
        const { url } = await response.json()
        return url
      })
      
      const uploadedUrls = await Promise.all(uploadPromises)
      
      // Update form with new image URLs
      setValue('vehicle_images', [...vehicleImages, ...uploadedUrls], { shouldValidate: true })
      
    } catch (error) {
      console.error('Image upload error:', error)
      // Show error toast
    }
  }

  // Map vehicle size to lookup size
  const vehicleSizeToLookupSize: Record<VehicleSize, "small" | "medium" | "large" | "extraLarge"> = {
    [VehicleSize.SMALL]: "small",
    [VehicleSize.MEDIUM]: "medium",
    [VehicleSize.LARGE]: "large",
    [VehicleSize.XLARGE]: "extraLarge"
  }

  // Suggest vehicle size based on model data
  const getSuggestedVehicleSize = (vehicleData: any): VehicleSize | null => {
    // Add logic to determine vehicle size based on make/model
    // This would be based on a database of vehicle dimensions
    return null
  }

  return (
    <div className="space-y-8">
      {/* Vehicle Registration Lookup */}
      <FormSection
        title={content.pages.booking.steps.vehicleDetails.fields.registration}
        description="Enter your registration for automatic vehicle details lookup"
        variant="default"
        required
      >
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                label={content.pages.booking.steps.vehicleDetails.fields.registration}
                placeholder="e.g. AB12 CDE"
                value={registration}
                onChange={(e) => setValue('registration', e.target.value.toUpperCase())}
                error={lookupError}
                helperText="UK registration format"
                required
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleVehicleLookup}
                disabled={!registration || isLookingUp}
                loading={isLookingUp}
                loadingText={content.pages.booking.steps.vehicleDetails.lookup.loading}
              >
                {content.pages.booking.steps.vehicleDetails.lookup.button}
              </Button>
            </div>
          </div>
        </div>
      </FormSection>

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

      {/* Vehicle Photos */}
      <FormSection
        title="Vehicle Photos"
        description="Upload photos of your vehicle (optional, max 3 photos)"
        variant="default"
      >
        <ImageUpload
          value={vehicleImages}
          onChange={handleImageUpload}
          maxFiles={3}
          accept="image/*"
          maxSize={5 * 1024 * 1024} // 5MB
        />
      </FormSection>

      {/* Vehicle Details Display */}
      {vehicleLookup && (
        <FormSection
          title="Vehicle Details"
          description="Details found from registration lookup"
          variant="default"
        >
          <div className="bg-background/50 rounded-lg p-4 border">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-[var(--color-text)] mb-1">Make & Model</p>
                <p className="text-muted-foreground">
                  {vehicleLookup.make} {vehicleLookup.model}
                </p>
              </div>
              {vehicleLookup.year && (
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)] mb-1">Year</p>
                  <p className="text-muted-foreground">{vehicleLookup.year}</p>
                </div>
              )}
              {vehicleLookup.color && (
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)] mb-1">Color</p>
                  <p className="text-muted-foreground">{vehicleLookup.color}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-[var(--color-text)] mb-1">Registration</p>
                <p className="text-muted-foreground">{vehicleLookup.registration}</p>
              </div>
            </div>
          </div>
        </FormSection>
      )}
    </div>
  )
} 