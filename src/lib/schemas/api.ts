import { z } from 'zod'
import { BookingStatus, PaymentStatus, ServiceType, VehicleSize } from '@/lib/enums'
import { TIME_SLOTS } from '@/lib/constants/services'

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

// Vehicle lookup schema
export const vehicleLookupSchema = z.object({
  size: z.nativeEnum(VehicleSize),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  registration: z.string().min(1, 'Registration is required'),
  year: z.number().optional(),
  color: z.string().optional(),
  notes: z.string().optional()
})

export type VehicleLookupRequest = z.infer<typeof vehicleLookupSchema>

// Form data schema
export const bookingFormSchema = z.object({
  id: z.string().uuid().optional(),
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number is required').optional(),
  postcode: z.string().regex(/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i, 'Invalid UK postcode'),
  address: z.string().min(5, 'Address is required'),
  vehicleSize: z.nativeEnum(VehicleSize),
  serviceId: z.string().min(1, 'Service is required'),
  date: z.string().min(1, 'Booking date is required'),
  timeSlot: z.string().min(1, 'Booking time is required'),
  addOnIds: z.array(z.string()).default([]),
  vehicle_images: z.array(z.string()).max(3, 'Maximum 3 images allowed').default([]),
  vehicle_lookup: vehicleLookupSchema,
  total_price: z.number().min(0),
  travel_fee: z.number().min(0).default(0),
  add_ons_price: z.number().min(0).default(0),
  status: z.nativeEnum(BookingStatus).default(BookingStatus.PENDING),
  payment_status: z.nativeEnum(PaymentStatus).default(PaymentStatus.PENDING),
  requires_manual_approval: z.boolean().optional(),
  distance: z.object({
    miles: z.number(),
    text: z.string()
  }).optional(),
  booking_reference: z.string().optional(),
  special_requests: z.string().optional(),
  notes: z.string().optional()
})

// API request schema
export const bookingRequestSchema = z.object({
  // Vehicle details
  vehicle_lookup: z.object({
    registration: z.string(),
    make: z.string(),
    model: z.string(),
    year: z.number().optional(),
    color: z.string().optional(),
    size: z.nativeEnum(VehicleSize),
    notes: z.string().optional()
  }),
  vehicle_images: z.array(z.string().url()).optional(),
  vehicle_size: z.nativeEnum(VehicleSize),
  
  // Service details
  service_type: z.nativeEnum(ServiceType),
  add_ons: z.array(z.string()).default([]),
  
  // Appointment details
  booking_date: z.string(),
  booking_time: z.enum(TIME_SLOTS),
  
  // Customer details
  customer_name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  postcode: z.string(),
  address: z.string(),
  
  // Optional fields
  special_requests: z.string().optional(),
  notes: z.string().optional(),
  
  // Pricing
  total_price: z.number(),
  travel_fee: z.number().optional(),
  add_ons_price: z.number(),
  
  // Metadata
  user_id: z.string().optional(),
  booking_reference: z.string(),
  requires_manual_approval: z.boolean().optional(),
  distance: z.number().optional()
})

export type BookingFormData = z.infer<typeof bookingFormSchema>
export type BookingRequest = z.infer<typeof bookingRequestSchema>

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
    addOnIds: z.array(z.string()),
    travelFee: z.number(),
    totalPrice: z.number(),
    fullName: z.string(),
    postcode: z.string()
  })
})

export type EmailConfirmationRequest = z.infer<typeof emailConfirmationSchema> 