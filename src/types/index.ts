// Central type definitions for Love4Detailing app
export interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  full_name: string
  phone?: string
  profile_image_url?: string
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string
  service_type: string
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
  status: string
  total_price: number
  travel_fee: number
  add_ons: string[]
  vehicle_images: string[]
  created_at: string
  updated_at: string
  postcode: string
  notes?: string
  booking_reference?: string
  payment_status?: string
}

import type { VehicleSize } from '@/lib/constants'

export interface VehicleData {
  registration: string
  make: string
  model: string
  yearOfManufacture: string
}

export interface PaymentResult {
  success: boolean
  paymentId: string
  amount: number
  currency: string
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
  vehicleSize: 'small' | 'medium' | 'large' | 'extraLarge'
  date: string
  timeSlot: string
  addOns: string[]
  vehicleImages?: string[]
}

export interface DashboardBookingFormData extends BookingFormData {
  serviceType: string
  notes?: string
  customerPhone?: string
}

import { ReactNode } from 'react';

export interface ClientProviderProps {
  children: ReactNode;
}

export interface DashboardData {
  recentBookings: Booking[]
  totalBookings: number
  totalSpent: number
  rewardPoints: number
  nextRewardThreshold: number
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
  last_booking_date?: string | null
  status?: 'active' | 'inactive'
  bookings?: CustomerBooking[]
}

export interface CustomerBooking {
  id: string
  booking_date: string
  booking_time: string
  service: string
  total_price: number
  status: string
}

export interface CustomerProfile extends Customer {
  bookings: CustomerBooking[]
} 