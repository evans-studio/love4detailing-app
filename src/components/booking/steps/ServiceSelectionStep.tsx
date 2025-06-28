'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { SERVICES } from '@/lib/constants'
import { content } from '@/lib/content'
import type { ServicePackage, VehicleSize, AddOnService } from '@/lib/constants'
import { FormSection } from '@/components/ui/FormSection'
import { InputGroup } from '@/components/ui/InputGroup'
import { ServiceCard } from '@/components/ui/ServiceCard'

interface ServiceSelectionStepProps {
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
    servicePackage?: ServicePackage
    addOns?: AddOnService[]
  }
}

export const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({
  watchedValues,
}) => {
  const { setValue, watch } = useFormContext()
  
  const selectedService = watch('servicePackage')
  const selectedVehicleSize = watch('vehicleSize') || 'medium'
  const selectedAddOns = watch('addOns') || []

  const handleServiceSelect = (servicePackage: ServicePackage) => {
    setValue('servicePackage', servicePackage, { shouldValidate: true })
  }

  const handleAddOnToggle = (addOnId: AddOnService) => {
    const currentAddOns = selectedAddOns || []
    const isSelected = currentAddOns.includes(addOnId)
    
    if (isSelected) {
      setValue('addOns', currentAddOns.filter((id: AddOnService) => id !== addOnId), { shouldValidate: true })
    } else {
      setValue('addOns', [...currentAddOns, addOnId], { shouldValidate: true })
    }
  }

  return (
    <div className="space-y-8">
      {/* Service Package Selection */}
      <FormSection
        title="Choose Your Service Package"
        description="Select the detailing package that best suits your needs"
        variant="card"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(SERVICES.packages).map(([packageId, packageData]) => (
            <ServiceCard
              key={packageId}
              servicePackage={packageId as ServicePackage}
              vehicleSize={selectedVehicleSize}
              isSelected={selectedService === packageId}
              isPopular={packageId === 'premium'}
              onSelect={handleServiceSelect}
              ctaText="Select"
              size="full"
            />
          ))}
        </div>
      </FormSection>

      {/* Add-on Services */}
      {selectedService && (
        <FormSection
          title={content.pages.booking.steps.serviceSelection.addOnsTitle}
          description={content.pages.booking.steps.serviceSelection.addOnsDescription}
          variant="default"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(SERVICES.addOns).map(([addOnId, addOnData]) => {
              const isSelected = selectedAddOns.includes(addOnId as AddOnService)
              
              return (
                <div
                  key={addOnId}
                  className={`
                    relative cursor-pointer rounded-lg border p-4 transition-all duration-200
                    ${isSelected 
                      ? 'border-[var(--color-primary)] bg-[var(--purple-50)] ring-1 ring-[var(--color-primary)]' 
                      : 'border-border bg-background hover:border-[var(--color-primary)]/50'
                    }
                  `}
                  onClick={() => handleAddOnToggle(addOnId as AddOnService)}
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
                    <h4 className="font-medium text-[var(--color-text)] mb-1">
                      {addOnData.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {addOnData.description}
                    </p>
                    <p className="font-semibold text-[var(--color-primary)]">
                      +£{addOnData.price}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </FormSection>
      )}

      {/* Service Details */}
      {selectedService && (
        <FormSection
          title="Service Details"
          description="What's included in your selected package"
          variant="glass"
        >
          <div className="bg-background/50 rounded-lg p-4 border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-lg text-[var(--color-text)]">
                  {SERVICES.packages[selectedService as ServicePackage]?.name}
                </h4>
                <p className="text-muted-foreground">
                  {SERVICES.packages[selectedService as ServicePackage]?.description}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Duration: {SERVICES.packages[selectedService as ServicePackage]?.duration}
                </p>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-[var(--color-text)] mb-2">
                What's included:
              </h5>
              <ul className="space-y-1">
                {SERVICES.packages[selectedService as ServicePackage]?.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <svg 
                      className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-[var(--color-success)]" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FormSection>
      )}
    </div>
  )
} 