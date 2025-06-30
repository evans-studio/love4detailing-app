import { z } from 'zod';
import { ServiceType, VehicleSize } from '@/lib/enums';
import { TIME_SLOTS } from '@/lib/constants/services';

// =================================================================
// Base Schema - Core fields shared across all booking forms
// =================================================================
export const baseBookingSchema = z.object({
  // We will get these from the main config later
  vehicleSize: z.nativeEnum(VehicleSize, { required_error: 'Please select a vehicle size.' }),
  serviceId: z.string({ required_error: 'Please select a service.' }),
  addOnIds: z.array(z.string()).optional(),
  
  date: z.string({ required_error: 'Please select a date.' }),
  timeSlot: z.string({ required_error: 'Please select a time slot.' }),
});

// =================================================================
// Full Booking Form Schema (for public-facing form)
// =================================================================
export const fullBookingSchema = baseBookingSchema.extend({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  
  postcode: z.string().regex(/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i, 'Invalid UK postcode'),
  address: z.string().min(5, 'Please enter a valid address.'),

  vehicleLookup: z.string().min(1, 'Please enter your registration or vehicle details.'),
  vehicleImages: z.array(z.string()).max(3, 'You can upload a maximum of 3 images.').optional(),

  // Internal fields
  requiresManualApproval: z.boolean().optional(),
  distance: z.object({
    miles: z.number(),
    text: z.string(),
  }).optional(),
  
  // Additional fields
  special_requests: z.string().optional(),
  notes: z.string().optional()
});
export type FullBookingFormData = z.infer<typeof fullBookingSchema>;

// =================================================================
// Dashboard Booking Form Schema (for logged-in users)
// =================================================================
export const dashboardBookingSchema = baseBookingSchema.extend({
  // Logged-in users don't need to provide contact details
  // but might select a vehicle from their saved list
  vehicleId: z.string().optional(), 
  specialRequests: z.string().max(500, 'Special requests cannot exceed 500 characters.').optional(),
  accessInstructions: z.string().max(500, 'Access instructions cannot exceed 500 characters.').optional(),
});
export type DashboardBookingFormData = z.infer<typeof dashboardBookingSchema>;

// =================================================================
// Minimal Booking Form Schema (for quick/admin booking)
// =================================================================
export const minimalBookingSchema = z.object({
  vehicleDescription: z.string().min(3, 'Please provide a vehicle description.'),
  serviceId: z.string(),
  vehicleSize: z.nativeEnum(VehicleSize),
});
export type MinimalBookingFormData = z.infer<typeof minimalBookingSchema>;

// Vehicle details schema
export const vehicleSchema = z.object({
  registration: z.string()
    .min(1, 'Registration is required')
    .regex(/^[A-Z0-9 ]{4,8}$/, 'Invalid registration format'),
  size: z.nativeEnum(VehicleSize, {
    errorMap: () => ({ message: 'Please select a vehicle size' })
  }),
  images: z.array(z.string().url())
    .min(1, 'At least one vehicle photo is required')
    .max(3, 'Maximum 3 photos allowed')
})

// Service selection schema
export const serviceSchema = z.object({
  serviceType: z.nativeEnum(ServiceType, {
    errorMap: () => ({ message: 'Please select a service' })
  }),
  addOnIds: z.array(z.string())
})

// Date and time schema
export const dateTimeSchema = z.object({
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .refine(date => new Date(date) > new Date(), 'Date must be in the future'),
  timeSlot: z.enum(TIME_SLOTS, {
    errorMap: () => ({ message: 'Please select a valid time slot' })
  })
})

// Contact details schema
export const contactSchema = z.object({
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

// Complete booking schema
export const bookingSchema = z.object({
  vehicle: vehicleSchema,
  service: serviceSchema,
  dateTime: dateTimeSchema,
  contact: contactSchema
})

export type VehicleFormData = z.infer<typeof vehicleSchema>
export type ServiceFormData = z.infer<typeof serviceSchema>
export type DateTimeFormData = z.infer<typeof dateTimeSchema>
export type ContactFormData = z.infer<typeof contactSchema>
export type BookingFormData = z.infer<typeof bookingSchema>

// API request schema
export const bookingRequestSchema = z.object({
  // Vehicle details
  vehicle_lookup: z.object({
    registration: z.string(),
    make: z.string(),
    model: z.string(),
    year: z.string().optional(),
    color: z.string().optional(),
    size: z.nativeEnum(VehicleSize),
    notes: z.string().optional()
  }),
  vehicle_images: z.array(z.string().url()).optional(),
  vehicle_size: z.nativeEnum(VehicleSize),
  
  // Service details
  service_type: z.nativeEnum(ServiceType),
  add_ons: z.array(z.string()).optional(),
  
  // Appointment details
  booking_date: z.string(),
  booking_time: z.enum(TIME_SLOTS),
  
  // Customer details
  customer_name: z.string(),
  email: z.string().email(),
  phone: z.string(),
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