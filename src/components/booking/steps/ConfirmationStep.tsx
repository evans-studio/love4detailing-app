'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { SERVICES, BOOKING } from '@/lib/constants'
import { content } from '@/lib/content'
import { formatCurrency, formatDate, formatVehicleDescription } from '@/lib/utils/formatters'
import type { ServicePackage, VehicleSize, AddOnService } from '@/lib/constants'
import { FormSection } from '@/components/ui/FormSection'

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

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  isAuthenticated = false,
  userId,
  pricing,
}) => {
  const { watch } = useFormContext()
  
  // Get all form values
  const formData = watch()
  
  // Extract key data
  const vehicleSize = formData.vehicleSize as VehicleSize
  const servicePackage = formData.servicePackage as ServicePackage
  const addOns = (formData.addOns || []) as AddOnService[]
  const date = formData.date
  const timeSlot = formData.timeSlot
  const vehicleMake = formData.vehicleMake
  const vehicleModel = formData.vehicleModel
  const vehicleYear = formData.vehicleYear
  const vehicleColor = formData.vehicleColor
  const vehicleRegistration = formData.vehicleRegistration
  const fullName = formData.fullName
  const email = formData.email
  const phone = formData.phone
  const address = formData.address
  const postcode = formData.postcode
  const notes = formData.notes

  // Get service and vehicle data
  const serviceData = SERVICES.packages[servicePackage]
  const vehicleSizeData = SERVICES.vehicleSizes[vehicleSize]
  const addOnData = addOns.map(addOnId => SERVICES.addOns[addOnId]).filter(Boolean)

  // Get payment method info
  const paymentMethod = BOOKING.payment.method
  const paymentMethodInfo = BOOKING.payment.methods[paymentMethod]

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
                {paymentMethodInfo.label}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {paymentMethodInfo.description}
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
                {addOnData.map((addOn) => (
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
                {formatVehicleDescription(vehicleMake, vehicleModel, vehicleYear)}
              </p>
              {vehicleColor && (
                <p className="text-xs text-muted-foreground mt-1">
                  {content.pages.booking.steps.confirmation.sections.vehicle.color}: {vehicleColor}
                </p>
              )}
            </div>
            {vehicleRegistration && (
              <div>
                <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                  {content.pages.booking.steps.confirmation.sections.vehicle.registration}
                </p>
                <p className="text-muted-foreground">{vehicleRegistration}</p>
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
                {date ? formatDate(date, 'long') : 'Not selected'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                {content.pages.booking.steps.confirmation.sections.appointment.time}
              </p>
              <p className="text-muted-foreground">{timeSlot || 'Not selected'}</p>
            </div>
            {(address || postcode) && (
              <div className="sm:col-span-2">
                <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                  {content.pages.booking.steps.contactDetails.fields.address.label}
                </p>
                <p className="text-muted-foreground">
                  {address && postcode ? `${address}, ${postcode}` : address || postcode}
                </p>
              </div>
            )}
          </div>
          
          {notes && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                {content.pages.booking.steps.contactDetails.fields.notes.label}
              </p>
              <p className="text-xs text-muted-foreground">{notes}</p>
            </div>
          )}
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
              <p className="text-muted-foreground">{fullName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                {content.pages.booking.steps.confirmation.sections.contact.email}
              </p>
              <p className="text-muted-foreground">{email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                {content.pages.booking.steps.confirmation.sections.contact.phone}
              </p>
              <p className="text-muted-foreground">{phone}</p>
            </div>
          </div>
        </div>
      </FormSection>

      {/* Pricing Summary */}
      <FormSection
        title={content.pages.booking.steps.confirmation.sections.pricing.title}
        description="Breakdown of your booking costs"
        variant="glass"
      >
        <div className="bg-background/50 rounded-lg p-4 border">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {content.pages.booking.steps.confirmation.sections.pricing.basePrice}
              </span>
              <span className="text-muted-foreground">{formatCurrency(pricing?.basePrice || 0)}</span>
            </div>
            {pricing?.addOnsPrice ? (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {content.pages.booking.steps.confirmation.sections.pricing.addOns}
                </span>
                <span className="text-muted-foreground">{formatCurrency(pricing.addOnsPrice)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-sm font-medium pt-2 border-t">
              <span className="text-[var(--color-text)]">
                {content.pages.booking.steps.confirmation.sections.pricing.subtotal}
              </span>
              <span className="text-[var(--color-text)]">{formatCurrency(pricing?.subtotal || 0)}</span>
            </div>
            {pricing?.discount ? (
              <div className="flex justify-between text-sm text-[var(--color-success)]">
                <span>
                  {content.pages.booking.steps.confirmation.sections.pricing.discount}
                </span>
                <span>-{formatCurrency(pricing.discount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-base font-semibold pt-2 border-t">
              <span className="text-[var(--color-text)]">
                {content.pages.booking.steps.confirmation.sections.pricing.total}
              </span>
              <span className="text-[var(--color-primary)]">{formatCurrency(pricing?.total || 0)}</span>
            </div>
          </div>
        </div>
      </FormSection>
    </div>
  )
} 