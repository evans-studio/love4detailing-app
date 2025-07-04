import { z } from 'zod'
import {
  BookingStatus,
  PaymentStatus,
  ServiceType,
  VehicleSize,
  PaymentMethod as PaymentMethodEnum
} from '@/lib/enums'

// =================================================================
// CORE SCHEMA DEFINITIONS - Following system-guide.md principles
// =================================================================

// Vehicle size validation based on constants
export const vehicleSizeSchema = z.enum([
  'small', 'medium', 'large', 'extraLarge'
] as const, {
  errorMap: () => ({ message: 'Please select a valid vehicle size.' })
})

// Service package validation based on constants
export const servicePackageSchema = z.enum([
  'essential', 'premium', 'ultimate'
] as const, {
  errorMap: () => ({ message: 'Please select a valid service package.' })
})

// Add-on services validation based on constants
export const addOnServiceSchema = z.enum([
  'interiorProtection', 'engineClean', 'headlightRestoration'
] as const, {
  errorMap: () => ({ message: 'Invalid add-on service selected.' })
})

// Booking status validation based on constants
export const bookingStatusSchema = z.enum([
  'pending', 'confirmed', 'inProgress', 'completed', 'cancelled'
] as const, {
  errorMap: () => ({ message: 'Invalid booking status.' })
})

// Time slot validation based on constants
export const timeSlotSchema = z.enum([
  '09:00', '10:30', '12:00', '13:30', '15:00', '16:30'
] as const, {
  errorMap: () => ({ message: 'Please select a valid time slot.' })
})

// =================================================================
// COMMON FIELD SCHEMAS - Reusable validation patterns
// =================================================================

export const emailSchema = z.string()
  .min(1, 'Email is required.')
  .email('Please enter a valid email address.')
  .max(255, 'Email is too long.')

export const phoneSchema = z.string()
  .min(10, 'Phone number must be at least 10 digits.')
  .max(15, 'Phone number is too long.')
  .regex(/^[+\d\s().-]+$/, 'Please enter a valid phone number.')

export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters.')
  .max(100, 'Name is too long.')
  .regex(/^[A-Za-z\s'.-]+$/, 'Name contains invalid characters.')

export const postcodeSchema = z.string()
  .min(5, 'Postcode is required.')
  .max(10, 'Postcode is too long.')
  .regex(/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i, 'Please enter a valid UK postcode.')

export const addressSchema = z.string()
  .min(5, 'Please enter a complete address.')
  .max(200, 'Address is too long.')

export const registrationSchema = z.string()
  .min(1, 'Vehicle registration is required.')
  .max(10, 'Registration is too long.')
  .regex(/^[A-Z0-9 ]{1,10}$/i, 'Please enter a valid registration number.')

export const dateSchema = z.string()
  .min(1, 'Date is required.')
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date (YYYY-MM-DD).')

// =================================================================
// VEHICLE SCHEMA
// =================================================================

export const vehicleSchema = z.object({
  id: z.string().uuid().optional(),
  make: z.string().min(1, 'Vehicle make is required.').max(50, 'Make is too long.'),
  model: z.string().min(1, 'Vehicle model is required.').max(50, 'Model is too long.'),
  year: z.number()
    .min(1900, 'Year must be after 1900.')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future.')
    .optional(),
  registration: registrationSchema.optional(),
  color: z.string().max(30, 'Color is too long.').optional(),
  size: vehicleSizeSchema,
  notes: z.string().max(500, 'Notes are too long.').optional(),
})

export type Vehicle = z.infer<typeof vehicleSchema>

// =================================================================
// USER & AUTHENTICATION SCHEMAS
// =================================================================

export const signUpSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: z.string()
    .min(8, 'Password must be at least 8 characters.')
    .max(128, 'Password is too long.')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
})

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required.'),
})

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters.')
    .max(128, 'Password is too long.')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
})

export const profileUpdateSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  address: addressSchema.optional(),
  postcode: postcodeSchema.optional(),
})

export type SignUpData = z.infer<typeof signUpSchema>
export type SignInData = z.infer<typeof signInSchema>
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>

// =================================================================
// BOOKING SCHEMAS
// =================================================================

// Convert enums to Zod enums
const bookingStatusEnum = z.nativeEnum(BookingStatus)
const paymentStatusEnum = z.nativeEnum(PaymentStatus)
const serviceTypeEnum = z.nativeEnum(ServiceType)
const vehicleSizeEnum = z.nativeEnum(VehicleSize)
const paymentMethodEnum = z.nativeEnum(PaymentMethodEnum)

// Base booking schema
export const bookingFormSchema = z.object({
  id: z.string().uuid().optional(),
  fullName: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  postcode: z.string().min(1, 'Postcode is required'),
  address: z.string().min(1, 'Address is required'),
  vehicleSize: vehicleSizeEnum,
  serviceId: z.string().min(1, 'Service is required'),
  date: z.string().min(1, 'Booking date is required'),
  timeSlot: z.string().min(1, 'Booking time is required'),
  addOnIds: z.array(z.string()).default([]),
  vehicle_images: z.array(z.string().url('Invalid image URL format')).default([]),
  special_requests: z.string().optional(),
  total_price: z.number().min(0),
  travel_fee: z.number().min(0).default(0),
  status: bookingStatusEnum.default(BookingStatus.PENDING),
  payment_status: paymentStatusEnum.default(PaymentStatus.PENDING),
  payment_method: paymentMethodEnum.optional(),
  vehicle_lookup: vehicleSchema.optional(),
  booking_reference: z.string().optional(),
  notes: z.string().optional()
})

// API booking schema
export const bookingSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  customer_name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  postcode: z.string().min(1, 'Postcode is required'),
  address: z.string().min(1, 'Address is required'),
  vehicle_size: vehicleSizeEnum,
  service_type: serviceTypeEnum,
  booking_date: z.string().min(1, 'Booking date is required'),
  booking_time: z.string().min(1, 'Booking time is required'),
  add_ons: z.array(z.string()).default([]),
  vehicle_images: z.array(z.string().url('Invalid image URL format')).default([]),
  special_requests: z.string().optional(),
  total_price: z.number().min(0),
  travel_fee: z.number().min(0).default(0),
  status: bookingStatusEnum.default(BookingStatus.PENDING),
  payment_status: paymentStatusEnum.default(PaymentStatus.PENDING),
  payment_method: paymentMethodEnum.optional(),
  vehicle_lookup: vehicleSchema.optional(),
  booking_reference: z.string().optional(),
  notes: z.string().optional()
})

// Export types using the schema
export type BookingData = z.infer<typeof bookingSchema>
export type BookingFormData = z.infer<typeof bookingFormSchema>

// Re-export enums for convenience
export {
  BookingStatus,
  PaymentStatus,
  ServiceType,
  VehicleSize,
  PaymentMethodEnum as PaymentMethod
}

// =================================================================
// REWARDS & LOYALTY SCHEMAS
// =================================================================

export const rewardRedemptionSchema = z.object({
  rewardType: z.enum(['discount10', 'discount20', 'freeAddOn', 'freeDetail'] as const),
  bookingId: z.string().uuid().optional(),
})

export const loyaltyActionSchema = z.object({
  userId: z.string().uuid('Invalid user ID.'),
  action: z.enum(['booking', 'review', 'referral', 'socialShare', 'firstBooking'] as const),
  points: z.number().min(0, 'Points must be positive.'),
  metadata: z.record(z.unknown()).optional(),
})

export type RewardRedemptionData = z.infer<typeof rewardRedemptionSchema>
export type LoyaltyActionData = z.infer<typeof loyaltyActionSchema>

// =================================================================
// API REQUEST/RESPONSE SCHEMAS
// =================================================================

export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
})

export const paginationSchema = z.object({
  page: z.number().min(1, 'Page must be at least 1.').default(1),
  limit: z.number().min(1, 'Limit must be at least 1.').max(100, 'Limit cannot exceed 100.').default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export const searchQuerySchema = z.object({
  query: z.string().min(1, 'Search query is required.').max(100, 'Query is too long.'),
  filters: z.record(z.string()).optional(),
})

export type ApiResponse<T = unknown> = z.infer<typeof apiResponseSchema> & { data?: T }
export type PaginationParams = z.infer<typeof paginationSchema>
export type SearchQuery = z.infer<typeof searchQuerySchema>

// =================================================================
// GALLERY & FILE UPLOAD SCHEMAS
// =================================================================

export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'Please select a valid file.' }),
  category: z.enum(['vehicle', 'before', 'after', 'profile'] as const),
})

export const galleryImageSchema = z.object({
  id: z.string().uuid().optional(),
  url: z.string().url('Invalid image URL.'),
  title: z.string().max(100, 'Title is too long.').optional(),
  description: z.string().max(500, 'Description is too long.').optional(),
  category: z.enum(['before', 'after', 'process', 'featured'] as const),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed.').default([]),
  bookingId: z.string().uuid().optional(),
})

export type FileUploadData = z.infer<typeof fileUploadSchema>
export type GalleryImageData = z.infer<typeof galleryImageSchema>

// =================================================================
// CONTACT & FEEDBACK SCHEMAS
// =================================================================

export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters.').max(100, 'Subject is too long.'),
  message: z.string().min(10, 'Message must be at least 10 characters.').max(1000, 'Message is too long.'),
})

export const reviewSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID.'),
  rating: z.number().min(1, 'Rating must be at least 1.').max(5, 'Rating cannot exceed 5.'),
  comment: z.string().min(10, 'Comment must be at least 10 characters.').max(500, 'Comment is too long.'),
  photos: z.array(z.string().url()).max(3, 'Maximum 3 photos allowed.').default([]),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
export type ReviewData = z.infer<typeof reviewSchema>

// =================================================================
// EXPORT ALL SCHEMAS FOR EASY IMPORTING
// =================================================================

export const schemas = {
  // Authentication
  signUp: signUpSchema,
  signIn: signInSchema,
  forgotPassword: forgotPasswordSchema,
  resetPassword: resetPasswordSchema,
  profileUpdate: profileUpdateSchema,
  
  // Booking
  booking: bookingSchema,
  
  // Rewards
  rewardRedemption: rewardRedemptionSchema,
  loyaltyAction: loyaltyActionSchema,
  
  // Common
  vehicle: vehicleSchema,
  contact: contactFormSchema,
  review: reviewSchema,
  fileUpload: fileUploadSchema,
  galleryImage: galleryImageSchema,
  
  // API
  apiResponse: apiResponseSchema,
  pagination: paginationSchema,
  searchQuery: searchQuerySchema,
} 