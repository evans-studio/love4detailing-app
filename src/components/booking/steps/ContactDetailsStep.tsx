"use client"

import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { slideVariants } from '@/lib/animations/motion-variants'
import { Input } from '@/components/ui/Input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import type { BookingFormData } from '@/types'

interface ContactDetailsStepProps {
  form: UseFormReturn<BookingFormData>
  direction: number
  isLoggedIn?: boolean
}

export function ContactDetailsStep({ form, direction, isLoggedIn = false }: ContactDetailsStepProps) {
  return (
    <motion.div
      key="details"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <User className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Details</h2>
        <p className="text-muted-foreground">Let's start with your contact information</p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Full Name</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className="h-12 border-2 focus:border-primary transition-colors"
                  placeholder="Enter your full name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isLoggedIn && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    {...field} 
                    className="h-12 border-2 focus:border-primary transition-colors"
                    placeholder="Enter your email address"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="postcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Postcode</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className="h-12 border-2 focus:border-primary transition-colors"
                  placeholder="Enter your postcode (e.g., SW1A 1AA)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </motion.div>
  )
} 