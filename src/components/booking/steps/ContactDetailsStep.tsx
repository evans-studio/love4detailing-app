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
}

export const ContactDetailsStep: React.FC<ContactDetailsStepProps> = ({
  isAuthenticated = false,
  userId,
}) => {
  const { setValue, watch, formState: { errors } } = useFormContext()
  
  const fullName = watch('fullName') || ''
  const email = watch('email') || ''
  const phone = watch('phone') || ''
  const address = watch('address') || ''
  const postcode = watch('postcode') || ''
  const notes = watch('notes') || ''

  // Note: For authenticated users, this step might be skipped entirely
  // or used to confirm/update existing information
  if (isAuthenticated) {
    return (
      <div className="space-y-8">
        <FormSection
          title={content.pages.booking.steps.contactDetails.title}
          description={content.pages.booking.steps.contactDetails.description}
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
                <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                  {content.pages.booking.steps.contactDetails.fields.name.label}
                </p>
                <p className="text-muted-foreground">{fullName || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                  {content.pages.booking.steps.contactDetails.fields.email.label}
                </p>
                <p className="text-muted-foreground">{email || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                  {content.pages.booking.steps.contactDetails.fields.phone.label}
                </p>
                <p className="text-muted-foreground">{phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                  {content.pages.booking.steps.contactDetails.fields.address.label}
                </p>
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
        title={content.pages.booking.steps.contactDetails.sections.personal.title}
        description={content.pages.booking.steps.contactDetails.sections.personal.description}
        variant="card"
        required
      >
        <InputGroup layout="responsive" columns={2}>
          <Input
            label={content.pages.booking.steps.contactDetails.fields.name.label}
            placeholder={content.pages.booking.steps.contactDetails.fields.name.placeholder}
            value={fullName}
            onChange={(e) => setValue('fullName', e.target.value, { shouldValidate: true })}
            error={errors.fullName?.message as string}
            required
          />
          
          <Input
            type="email"
            label={content.pages.booking.steps.contactDetails.fields.email.label}
            placeholder={content.pages.booking.steps.contactDetails.fields.email.placeholder}
            value={email}
            onChange={(e) => setValue('email', e.target.value, { shouldValidate: true })}
            error={errors.email?.message as string}
            required
          />
        </InputGroup>

        <Input
          type="tel"
          label={content.pages.booking.steps.contactDetails.fields.phone.label}
          placeholder={content.pages.booking.steps.contactDetails.fields.phone.placeholder}
          value={phone}
          onChange={(e) => setValue('phone', e.target.value, { shouldValidate: true })}
          error={errors.phone?.message as string}
          required
        />
      </FormSection>

      {/* Service Address */}
      <FormSection
        title={content.pages.booking.steps.contactDetails.sections.address.title}
        description={content.pages.booking.steps.contactDetails.sections.address.description}
        variant="default"
        required
      >
        <div className="space-y-4">
          <Input
            label={content.pages.booking.steps.contactDetails.fields.postcode.label}
            placeholder={content.pages.booking.steps.contactDetails.fields.postcode.placeholder}
            value={postcode}
            onChange={(e) => setValue('postcode', e.target.value.toUpperCase(), { shouldValidate: true })}
            error={errors.postcode?.message as string}
            required
          />
          
          <Input
            label={content.pages.booking.steps.contactDetails.fields.address.label}
            placeholder={content.pages.booking.steps.contactDetails.fields.address.placeholder}
            value={address}
            onChange={(e) => setValue('address', e.target.value, { shouldValidate: true })}
            error={errors.address?.message as string}
            required
          />
        </div>
      </FormSection>

      {/* Special Instructions */}
      <FormSection
        title={content.pages.booking.steps.contactDetails.sections.notes.title}
        description={content.pages.booking.steps.contactDetails.sections.notes.description}
        variant="default"
      >
        <Input
          label={content.pages.booking.steps.contactDetails.fields.notes.label}
          placeholder={content.pages.booking.steps.contactDetails.fields.notes.placeholder}
          value={notes}
          onChange={(e) => setValue('notes', e.target.value, { shouldValidate: true })}
          error={errors.notes?.message as string}
        />
      </FormSection>
    </div>
  )
} 