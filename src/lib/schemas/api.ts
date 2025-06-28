import { z } from 'zod'

// Common schemas
export const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().optional(),
  registration: z.string().optional()
})

export const addressSchema = z.object({
  postcode: z.string().min(1, 'Postcode is required'),
  address: z.string().optional()
})

// Vehicle lookup API
export const vehicleLookupSchema = z.object({
  registration: z.string()
    .min(1, 'Registration is required')
    .regex(/^[A-Z0-9 ]{1,8}$/, 'Invalid registration format')
})

export type VehicleLookupRequest = z.infer<typeof vehicleLookupSchema>

// Bookings API
export const bookingSchema = z.object({
  user_id: z.string().uuid().optional(),
  customer_name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  postcode: z.string().min(1, 'Postcode is required'),
  vehicle_size: z.enum(['small', 'medium', 'large']),
  service_type: z.string().min(1, 'Service type is required'),
  booking_date: z.string().min(1, 'Booking date is required'),
  booking_time: z.string().min(1, 'Booking time is required'),
  add_ons: z.array(z.string()).default([]),
  vehicle_images: z.array(z.string()).default([]),
  special_requests: z.string().optional(),
  total_price: z.number().min(0),
  travel_fee: z.number().min(0).default(0),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).default('pending'),
  payment_status: z.enum(['pending', 'completed', 'failed']).default('pending'),
  vehicle_lookup: vehicleSchema.optional(),
  booking_reference: z.string().optional()
})

export type BookingRequest = z.infer<typeof bookingSchema>

// Rewards API
export const rewardsSchema = z.object({
  user_id: z.string().uuid(),
  points: z.number().min(0),
  total_saved: z.number().min(0)
})

export type RewardsRequest = z.infer<typeof rewardsSchema>

// Distance calculation API
export const distanceCalculationSchema = z.object({
  postcode: z.string().min(1, 'Postcode is required')
})

export type DistanceCalculationRequest = z.infer<typeof distanceCalculationSchema>

// Email confirmation API
export const emailConfirmationSchema = z.object({
  to: z.string().email('Invalid email format'),
  cc: z.string().email('Invalid email format').optional(),
  booking: z.object({
    date: z.string(),
    timeSlot: z.string(),
    vehicleSize: z.string(),
    addOns: z.array(z.string()),
    travelFee: z.number(),
    totalPrice: z.number(),
    fullName: z.string(),
    postcode: z.string()
  })
})

export type EmailConfirmationRequest = z.infer<typeof emailConfirmationSchema> 