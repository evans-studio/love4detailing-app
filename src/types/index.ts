import {
  VehicleSize,
  BookingStatus,
  PaymentStatus,
  PaymentMethod,
  LoyaltyTier,
  CustomerStatus,
  ServiceType,
  NotificationType,
  NotificationChannel,
  RoleType,
  ImageType,
} from '@/lib/enums'

// Central type definitions for Love4Detailing app
export interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
  created_at: string
  updated_at: string
  role: RoleType
  loyalty_tier: LoyaltyTier
  loyalty_points: number
  status: CustomerStatus
}

export interface UserProfile {
  id: string
  user_id: string
  full_name: string
  phone?: string
  profile_image_url?: string
  image_type: ImageType
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string
  service_type: ServiceType
  vehicle_size: VehicleSize
  vehicle: string
  vehicle_lookup?: string
  vehicle_info?: {
    make: string
    model: string
    year?: number
    registration?: string
    fuelType?: string
    colour?: string
  }
  date: string
  time: string
  status: BookingStatus
  total_price: number
  travel_fee: number
  add_ons: string[]
  vehicle_images: string[]
  created_at: string
  updated_at: string
  postcode: string
  notes?: string
  booking_reference?: string
  payment_status: PaymentStatus
  payment_method?: PaymentMethod
}

export interface VehicleData {
  registration: string
  make: string
  model: string
  yearOfManufacture: string
  size: VehicleSize
}

export interface PaymentResult {
  success: boolean
  paymentId: string
  amount: number
  currency: string
  status: PaymentStatus
  method: PaymentMethod
  metadata?: Record<string, unknown>
}

export interface PaymentError {
  code: string
  message: string
  details?: string
}

export interface TimeSlot {
  time: string
  label: string
  isAvailable: boolean
  bookingCount?: number
}

export interface AdminSetting {
  id: string
  setting_key: string
  setting_value: unknown
  updated_at: string
}

export interface WorkingHour {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_working_day: boolean
  slot_duration: number
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  success: boolean
}

// Form data types
export interface BookingFormData {
  fullName: string
  email: string
  postcode: string
  vehicleLookup: string
  vehicleSize: VehicleSize
  date: string
  timeSlot: string
  addOns: string[]
  vehicleImages?: string[]
  serviceType: ServiceType
  paymentMethod: PaymentMethod
}

export interface DashboardBookingFormData extends BookingFormData {
  notes?: string
  customerPhone?: string
}

import { ReactNode } from 'react'

export interface ClientProviderProps {
  children: ReactNode
}

export interface DashboardData {
  recentBookings: Booking[]
  totalBookings: number
  totalSpent: number
  rewardPoints: number
  nextRewardThreshold: number
  loyaltyTier: LoyaltyTier
}

export interface Customer {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  postcode: string | null
  phone?: string
  created_at: string
  total_spent?: number
  total_bookings?: number
  loyalty_points?: number
  loyalty_tier: LoyaltyTier
  last_booking_date?: string | null
  status: CustomerStatus
  bookings?: CustomerBooking[]
}

export interface CustomerBooking {
  id: string
  booking_date: string
  booking_time: string
  service: ServiceType
  total_price: number
  status: BookingStatus
  payment_status: PaymentStatus
}

export interface CustomerProfile extends Customer {
  bookings: CustomerBooking[]
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  channel: NotificationChannel
  title: string
  message: string
  read: boolean
  created_at: string
} 