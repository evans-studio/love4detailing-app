'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { SERVICES, BOOKING } from '@/lib/constants'
import { content } from '@/lib/content'
import { formatCurrency, formatDate, formatVehicleDescription } from '@/lib/utils/formatters'
import { ServiceType, VehicleSize, PaymentMethod } from '@/lib/enums'
import { FormSection } from '@/components/ui/FormSection'
import type { BookingFormData } from '@/lib/schemas'

interface ConfirmationStepProps {
  isAuthenticated?: boolean
  userId?: string
  pricing?: {
    basePrice: number
    addOnsPrice: number
    subtotal: number
    discount: number
    total: number
  }
}

// Map service IDs to service types
const serviceIdToType: Record<string, ServiceType> = {
  'essential-clean': ServiceType.BASIC,
  'premium-detail': ServiceType.PREMIUM,
  'ultimate-protection': ServiceType.ULTIMATE
}

// Map service types to package keys
const serviceTypeToPackage: Record<ServiceType, keyof typeof SERVICES.packages> = {
  [ServiceType.BASIC]: 'essential-clean',
  [ServiceType.PREMIUM]: 'premium-detail',
  [ServiceType.LUXURY]: 'ultimate-protection',
  [ServiceType.DELUXE]: 'ultimate-protection',
  [ServiceType.CUSTOM]: 'essential-clean',
  [ServiceType.ULTIMATE]: 'ultimate-protection'
}

// Map vehicle sizes to size keys
const vehicleSizeToKey: Record<VehicleSize, keyof typeof SERVICES.vehicleSizes> = {
  [VehicleSize.SMALL]: 'small',
  [VehicleSize.MEDIUM]: 'medium',
  [VehicleSize.LARGE]: 'large',
  [VehicleSize.XLARGE]: 'extraLarge',
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  isAuthenticated = false,
  userId,
  pricing,
}) => {
  const { watch } = useFormContext<BookingFormData>()
  
  // Get all form values
  const formData = watch()
  
  // Extract key data
  const vehicleSize = formData.vehicleSize
  const serviceId = formData.serviceId
  const serviceType = serviceIdToType[serviceId] || ServiceType.BASIC
  const addOns = formData.addOnIds || []
  const bookingDate = formData.date
  const bookingTime = formData.timeSlot
  const vehicleLookup = formData.vehicle_lookup
  const customerName = formData.fullName
  const email = formData.email
  const phone = formData.phone
  const postcode = formData.postcode
  const specialRequests = formData.special_requests

  // Get service and vehicle data
  const packageKey = serviceTypeToPackage[serviceType] || 'essential-clean'
  const sizeKey = vehicleSizeToKey[vehicleSize]
  const serviceData = SERVICES.packages[packageKey]
  const vehicleSizeData = SERVICES.vehicleSizes[sizeKey]
  const addOnData = addOns.map(addOnId => {
    const [category, id] = addOnId.split('.')
    return id ? SERVICES.addOns[id as keyof typeof SERVICES.addOns] : null
  }).filter(Boolean)

  return (
    <div className="space-y-8">
      {/* Booking Summary Header */}
      <FormSection
        title={content.pages.booking.steps.confirmation.title}
        description={content.pages.booking.steps.confirmation.description}
        variant="card"
      >
        <div className="bg-gradient-to-r from-[var(--purple-50)] to-[var(--purple-100)] rounded-lg p-6 border border-[var(--purple-200)]">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-2">
              {formatCurrency(pricing?.total || 0)}
            </h3>
            <p className="text-muted-foreground">
              Total for your {serviceData?.name} service
            </p>
            <div className="mt-4 p-3 bg-white/50 rounded-lg border">
              <p className="text-sm font-medium text-[var(--color-text)]">
                Card Payment
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Pay securely with your credit or debit card
              </p>
            </div>
          </div>
        </div>
      </FormSection>

      {/* Service Details */}
      <FormSection
        title={content.pages.booking.steps.confirmation.sections.service.title}
        description="Your selected service package"
        variant="default"
      >
        <div className="bg-background/50 rounded-lg p-4 border">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                {content.pages.booking.steps.confirmation.sections.service.package}
              </p>
              <p className="text-muted-foreground">{serviceData?.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{serviceData?.description}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                {content.pages.booking.steps.confirmation.sections.service.duration}
              </p>
              <p className="text-muted-foreground">{serviceData?.duration}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                {content.pages.booking.steps.confirmation.sections.vehicle.size}
              </p>
              <p className="text-muted-foreground">{vehicleSizeData?.label}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                {content.pages.booking.steps.confirmation.sections.pricing.basePrice}
              </p>
              <p className="text-muted-foreground">{formatCurrency(pricing?.basePrice || 0)}</p>
            </div>
          </div>
          
          {addOnData.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium text-[var(--color-text)] mb-2">
                {content.pages.booking.steps.confirmation.sections.service.addOns}
              </p>
              <div className="space-y-1">
                {addOnData.map((addOn) => addOn && (
                  <div key={addOn.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{addOn.name}</span>
                    <span className="text-muted-foreground">+{formatCurrency(addOn.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </FormSection>

      {/* Vehicle Information */}
      <FormSection
        title={content.pages.booking.steps.confirmation.sections.vehicle.title}
        description="Details of the vehicle to be serviced"
        variant="default"
      >
        <div className="bg-background/50 rounded-lg p-4 border">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                {content.pages.booking.steps.confirmation.sections.vehicle.make}
              </p>
              <p className="text-muted-foreground">
                {vehicleLookup ? formatVehicleDescription(vehicleLookup.make, vehicleLookup.model, vehicleLookup.year) : 'Not provided'}
              </p>
              {vehicleLookup?.color && (
                <p className="text-xs text-muted-foreground mt-1">
                  {content.pages.booking.steps.confirmation.sections.vehicle.color}: {vehicleLookup.color}
                </p>
              )}
            </div>
            {vehicleLookup?.registration && (
              <div>
                <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                  Registration
                </p>
                <p className="text-muted-foreground">{vehicleLookup.registration}</p>
              </div>
            )}
          </div>
        </div>
      </FormSection>

      {/* Appointment Details */}
      <FormSection
        title={content.pages.booking.steps.confirmation.sections.appointment.title}
        description="When and where the service will take place"
        variant="default"
      >
        <div className="bg-background/50 rounded-lg p-4 border">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                {content.pages.booking.steps.confirmation.sections.appointment.date}
              </p>
              <p className="text-muted-foreground">
                {bookingDate ? formatDate(bookingDate, 'long') : 'Not selected'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                {content.pages.booking.steps.confirmation.sections.appointment.time}
              </p>
              <p className="text-muted-foreground">{bookingTime || 'Not selected'}</p>
            </div>
            {postcode && (
              <div className="sm:col-span-2">
                <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                  {content.pages.booking.steps.contactDetails.fields.address.label}
                </p>
                <p className="text-muted-foreground">{postcode}</p>
              </div>
            )}
          </div>
        </div>
      </FormSection>

      {/* Contact Details */}
      <FormSection
        title={content.pages.booking.steps.confirmation.sections.contact.title}
        description="Your contact information"
        variant="default"
      >
        <div className="bg-background/50 rounded-lg p-4 border">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                {content.pages.booking.steps.confirmation.sections.contact.name}
              </p>
              <p className="text-muted-foreground">{customerName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                {content.pages.booking.steps.confirmation.sections.contact.email}
              </p>
              <p className="text-muted-foreground">{email}</p>
            </div>
            {phone && (
              <div>
                <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                  {content.pages.booking.steps.confirmation.sections.contact.phone}
                </p>
                <p className="text-muted-foreground">{phone}</p>
              </div>
            )}
          </div>
        </div>
      </FormSection>

      {/* Special Requirements */}
      {specialRequests && (
        <FormSection
          title="Special Requirements"
          description="Additional notes or requests"
          variant="default"
        >
          <div className="bg-background/50 rounded-lg p-4 border">
            <p className="text-muted-foreground">{specialRequests}</p>
          </div>
        </FormSection>
      )}
    </div>
  )
} 