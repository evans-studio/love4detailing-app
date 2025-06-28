'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { SERVICES, BOOKING } from '@/lib/constants'
import { content } from '@/lib/content'
import { formatCurrency, formatDate, formatVehicleDescription } from '@/lib/utils/formatters'
import type { ServicePackage, VehicleSize, AddOnService } from '@/lib/constants'
import { FormSection } from '@/components/ui/FormSection'
import { InputGroup } from '@/components/ui/InputGroup'
import { Input } from '@/components/ui/Input'

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
  watchedValues?: {
    [key: string]: any
  }
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  isAuthenticated = false,
  pricing,
  watchedValues,
}) => {
  const { setValue, watch, formState: { errors } } = useFormContext()
  
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
  const accessInstructions = formData.accessInstructions
  const specialRequests = formData.specialRequests
  const termsAccepted = formData.termsAccepted || false

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
        title="Service Details"
        description="Your selected service package"
        variant="default"
      >
        <div className="bg-background/50 rounded-lg p-4 border">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-1">Service Package</p>
              <p className="text-muted-foreground">{serviceData?.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{serviceData?.description}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-1">Duration</p>
              <p className="text-muted-foreground">{serviceData?.duration}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-1">Vehicle Size</p>
              <p className="text-muted-foreground">{vehicleSizeData?.label}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-1">Base Price</p>
              <p className="text-muted-foreground">{formatCurrency(pricing?.basePrice || 0)}</p>
            </div>
          </div>
          
          {addOnData.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium text-[var(--color-text)] mb-2">Add-on Services</p>
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
        title="Vehicle Information"
        description="Details of the vehicle to be serviced"
        variant="default"
      >
        <div className="bg-background/50 rounded-lg p-4 border">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-1">Vehicle</p>
              <p className="text-muted-foreground">
                {formatVehicleDescription(vehicleMake, vehicleModel, vehicleYear)}
              </p>
              {vehicleColor && (
                <p className="text-xs text-muted-foreground mt-1">Color: {vehicleColor}</p>
              )}
            </div>
            {vehicleRegistration && (
              <div>
                <p className="text-sm font-medium text-[var(--color-text)] mb-1">Registration</p>
                <p className="text-muted-foreground">{vehicleRegistration}</p>
              </div>
            )}
          </div>
        </div>
      </FormSection>

      {/* Appointment Details */}
      <FormSection
        title="Appointment Details"
        description="When and where the service will take place"
        variant="default"
      >
        <div className="bg-background/50 rounded-lg p-4 border">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-1">Date</p>
              <p className="text-muted-foreground">
                {date ? formatDate(new Date(date), 'long') : 'Not selected'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-1">Time</p>
              <p className="text-muted-foreground">{timeSlot || 'Not selected'}</p>
            </div>
            {(address || postcode) && (
              <div className="sm:col-span-2">
                <p className="text-sm font-medium text-[var(--color-text)] mb-1">Service Address</p>
                <p className="text-muted-foreground">
                  {address && postcode ? `${address}, ${postcode}` : address || postcode}
                </p>
              </div>
            )}
          </div>
          
          {(accessInstructions || specialRequests) && (
            <div className="mt-4 pt-4 border-t">
              {accessInstructions && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-[var(--color-text)] mb-1">Access Instructions</p>
                  <p className="text-xs text-muted-foreground">{accessInstructions}</p>
                </div>
              )}
              {specialRequests && (
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)] mb-1">Special Requests</p>
                  <p className="text-xs text-muted-foreground">{specialRequests}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </FormSection>

      {/* Contact Information */}
      {!isAuthenticated && (fullName || email || phone) && (
        <FormSection
          title="Contact Information"
          description="How we'll reach you about this booking"
          variant="default"
        >
          <div className="bg-background/50 rounded-lg p-4 border">
            <div className="grid gap-4 sm:grid-cols-2">
              {fullName && (
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)] mb-1">Name</p>
                  <p className="text-muted-foreground">{fullName}</p>
                </div>
              )}
              {email && (
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)] mb-1">Email</p>
                  <p className="text-muted-foreground">{email}</p>
                </div>
              )}
              {phone && (
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)] mb-1">Phone</p>
                  <p className="text-muted-foreground">{phone}</p>
                </div>
              )}
            </div>
          </div>
        </FormSection>
      )}

      {/* Pricing Breakdown */}
      <FormSection
        title="Pricing Breakdown"
        description="Detailed breakdown of your total cost"
        variant="card"
      >
        <div className="bg-background/50 rounded-lg p-4 border">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service ({serviceData?.name})</span>
              <span className="text-muted-foreground">{formatCurrency(pricing?.basePrice || 0)}</span>
            </div>
            
            {addOnData.length > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Add-ons</span>
                <span className="text-muted-foreground">{formatCurrency(pricing?.addOnsPrice || 0)}</span>
              </div>
            )}
            
            {(pricing?.discount || 0) > 0 && (
              <div className="flex justify-between text-sm text-[var(--color-success)]">
                <span>Loyalty Discount</span>
                <span>-{formatCurrency(pricing?.discount || 0)}</span>
              </div>
            )}
            
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-[var(--color-text)]">Total</span>
                <span className="text-[var(--color-primary)] text-lg">{formatCurrency(pricing?.total || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </FormSection>

      {/* Payment Information */}
      <FormSection
        title="Payment Information"
        description="Important details about your payment"
        variant="highlight"
      >
        <div className="space-y-4">
          <div className="p-4 bg-background/50 rounded-lg border">
            <div className="flex items-center gap-3 mb-3">
              <span className="p-2 bg-[var(--purple-50)] rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-primary)]">
                  <rect width="20" height="12" x="2" y="6" rx="2"/>
                  <circle cx="12" cy="12" r="2"/>
                  <path d="M6 12h.01M18 12h.01"/>
                </svg>
              </span>
              <div>
                <p className="font-medium text-[var(--color-text)]">
                  {paymentMethodInfo.label}
                </p>
                <p className="text-sm text-muted-foreground">
                  {paymentMethodInfo.description}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Total amount due: {formatCurrency(pricing?.total || 0)}</p>
              <p>• Payment will be collected on the day of service</p>
              <p>• Please have exact change if possible</p>
              <p>• A receipt will be provided upon payment</p>
            </div>
          </div>
        </div>
      </FormSection>

      {/* Terms and Conditions */}
      <FormSection
        title="Terms and Conditions"
        description="Please review and accept our terms"
        variant="highlight"
        required
      >
        <div className="space-y-4">
          <div className="p-4 bg-background/50 rounded-lg border text-sm">
            <p className="font-medium text-[var(--color-text)] mb-2">
              Please review our terms:
            </p>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>• {BOOKING.payment.refundPolicy}</li>
              <li>• Service times may vary by ±30 minutes due to traffic and previous appointments</li>
              <li>• Payment is due upon completion of service</li>
              <li>• We are fully insured for your peace of mind</li>
              <li>• Any damage discovered during service will be reported immediately</li>
            </ul>
          </div>
          
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms-checkbox"
              checked={termsAccepted}
              onChange={(e) => setValue('termsAccepted', e.target.checked, { shouldValidate: true })}
              className="mt-1 w-4 h-4 text-[var(--color-primary)] bg-background border-border rounded focus:ring-[var(--color-primary)] focus:ring-2"
            />
            <label htmlFor="terms-checkbox" className="text-sm text-muted-foreground cursor-pointer">
              {content.pages.booking.steps.confirmation.termsText}
              <br />
              <span className="text-xs">
                {content.pages.booking.steps.confirmation.cancellationPolicy}
              </span>
            </label>
          </div>
          
          {errors.termsAccepted && (
            <p className="text-sm text-[var(--color-error)] font-medium">
              {errors.termsAccepted.message as string}
            </p>
          )}
        </div>
      </FormSection>
    </div>
  )
} 