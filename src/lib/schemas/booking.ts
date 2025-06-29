import { z } from 'zod';
import { BookingStatus, PaymentStatus, ServiceType, VehicleSize } from '@/lib/enums';

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