"use client"

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { content } from '@/lib/content'
import { FormSection } from '@/components/ui/FormSection'
import { InputGroup } from '@/components/ui/InputGroup'
import { Input } from '@/components/ui/Input'

interface ContactDetailsStepProps {
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
    fullName?: string
    email?: string
    phone?: string
    address?: string
    postcode?: string
  }
}

export const ContactDetailsStep: React.FC<ContactDetailsStepProps> = ({
  isAuthenticated = false,
  watchedValues,
}) => {
  const { setValue, watch, formState: { errors } } = useFormContext()
  
  const fullName = watch('fullName') || ''
  const email = watch('email') || ''
  const phone = watch('phone') || ''
  const address = watch('address') || ''
  const postcode = watch('postcode') || ''

  // Note: For authenticated users, this step might be skipped entirely
  // or used to confirm/update existing information
  if (isAuthenticated) {
    return (
      <div className="space-y-8">
        <FormSection
          title="Confirm Contact Details"
          description="Please verify your contact information for this booking"
          variant="card"
        >
          <div className="p-4 bg-[var(--color-info)]/10 rounded-lg border border-[var(--color-info)]/20 mb-6">
            <p className="text-sm text-[var(--color-info)] font-medium mb-1">
              Using Your Account Information
            </p>
            <p className="text-xs text-muted-foreground">
              We'll use the contact details from your account. You can update them in your profile if needed.
            </p>
          </div>
          
          {/* Show current details for confirmation */}
          <div className="bg-background/50 rounded-lg p-4 border">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-[var(--color-text)] mb-1">Name</p>
                <p className="text-muted-foreground">{fullName || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)] mb-1">Email</p>
                <p className="text-muted-foreground">{email || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)] mb-1">Phone</p>
                <p className="text-muted-foreground">{phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)] mb-1">Service Address</p>
                <p className="text-muted-foreground">
                  {address && postcode ? `${address}, ${postcode}` : 'Will be collected separately'}
                </p>
              </div>
            </div>
          </div>
        </FormSection>
      </div>
    )
  }

  // Guest user form
  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <FormSection
        title={content.pages.booking.steps.contactDetails.title}
        description={content.pages.booking.steps.contactDetails.description}
        variant="card"
        required
      >
        <InputGroup layout="responsive" columns={2}>
          <Input
            label={content.pages.booking.steps.contactDetails.fields.fullName}
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setValue('fullName', e.target.value, { shouldValidate: true })}
            error={errors.fullName?.message as string}
            required
          />
          
          <Input
            type="email"
            label={content.pages.booking.steps.contactDetails.fields.email}
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setValue('email', e.target.value, { shouldValidate: true })}
            error={errors.email?.message as string}
            helperText="We'll send booking confirmation to this email"
            required
          />
        </InputGroup>

        <Input
          type="tel"
          label={content.pages.booking.steps.contactDetails.fields.phone}
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setValue('phone', e.target.value, { shouldValidate: true })}
          error={errors.phone?.message as string}
          helperText="We'll use this to contact you about your booking"
          required
        />
      </FormSection>

      {/* Service Address */}
      <FormSection
        title="Service Address"
        description="Where should we provide the detailing service?"
        variant="default"
        required
      >
        <div className="space-y-4">
          <Input
            label={content.pages.booking.steps.contactDetails.fields.postcode}
            placeholder="Enter your postcode"
            value={postcode}
            onChange={(e) => setValue('postcode', e.target.value.toUpperCase(), { shouldValidate: true })}
            error={errors.postcode?.message as string}
            helperText="We need this to calculate any travel fees"
            required
          />
          
          <Input
            label={content.pages.booking.steps.contactDetails.fields.address}
            placeholder="Enter your full address"
            value={address}
            onChange={(e) => setValue('address', e.target.value, { shouldValidate: true })}
            error={errors.address?.message as string}
            helperText="Include property number, street name, and any access instructions"
            required
          />
        </div>
      </FormSection>

      {/* Special Instructions */}
      <FormSection
        title="Special Instructions (Optional)"
        description="Any additional information we should know?"
        variant="default"
      >
        <Input
          label="Access Instructions"
          placeholder="e.g. Gate code, parking instructions, where to find the vehicle..."
          value={watch('accessInstructions') || ''}
          onChange={(e) => setValue('accessInstructions', e.target.value, { shouldValidate: true })}
          error={errors.accessInstructions?.message as string}
          helperText="Help our team find you and access your vehicle"
        />
        
        <Input
          label="Special Requests"
          placeholder="e.g. Please avoid using strong chemicals, focus on interior..."
          value={watch('specialRequests') || ''}
          onChange={(e) => setValue('specialRequests', e.target.value, { shouldValidate: true })}
          error={errors.specialRequests?.message as string}
          helperText="Any specific requirements or preferences"
        />
      </FormSection>

      {/* Contact Summary */}
      {(fullName || email || phone) && (
        <FormSection
          title="Contact Summary"
          description="Please confirm your contact details"
          variant="glass"
        >
          <div className="bg-background/50 rounded-lg p-4 border">
            <div className="grid gap-3 sm:grid-cols-2">
              {fullName && (
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Name</p>
                  <p className="text-muted-foreground">{fullName}</p>
                </div>
              )}
              {email && (
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Email</p>
                  <p className="text-muted-foreground">{email}</p>
                </div>
              )}
              {phone && (
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Phone</p>
                  <p className="text-muted-foreground">{phone}</p>
                </div>
              )}
              {(address || postcode) && (
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-[var(--color-text)]">Service Address</p>
                  <p className="text-muted-foreground">
                    {address && postcode 
                      ? `${address}, ${postcode}` 
                      : address || postcode
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </FormSection>
      )}
    </div>
  )
} 