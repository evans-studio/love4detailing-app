"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useBookingStore } from '@/lib/stores/booking'
import { content } from '@/lib/content'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/Input'

const contactSchema = z.object({
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string()
    .email('Invalid email address'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^[0-9+\-\s()]*$/, 'Invalid phone number format'),
  postcode: z.string()
    .min(5, 'Postcode is required')
    .max(10, 'Invalid postcode format')
    .regex(/^[A-Z0-9\s]*$/i, 'Invalid postcode format'),
  address: z.string()
    .min(5, 'Address is required')
    .max(200, 'Address must be less than 200 characters')
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactDetailsStep() {
  const store = useBookingStore()
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: store.fullName,
      email: store.email,
      phone: store.phone,
      postcode: store.postcode,
      address: store.address
    }
  })
  
  const onSubmit = (data: ContactFormData) => {
    store.setContactDetails(data)
  }
  
  // Update store on field change
  const handleFieldChange = (field: keyof ContactFormData, value: string) => {
    store.setContactDetails({ [field]: value })
  }
  
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        onChange={(e) => {
          const target = e.target as HTMLInputElement
          if (target.name) {
            handleFieldChange(
              target.name as keyof ContactFormData,
              target.value
            )
          }
        }}
      >
        {/* Full Name */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="07123456789"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Postcode */}
        <FormField
          control={form.control}
          name="postcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postcode</FormLabel>
              <FormControl>
                <Input
                  placeholder="SW1A 1AA"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase()
                    field.onChange(value)
                    handleFieldChange('postcode', value)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="10 Downing Street"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
} 