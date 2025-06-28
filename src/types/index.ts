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
  user_id?: string
  customer_name: string
  email: string
  phone?: string
  postcode: string
  vehicle_size: 'small' | 'medium' | 'large' | 'extraLarge'
  vehicle_lookup?: string
  vehicle_info?: Record<string, unknown>
  booking_date: string
  booking_time: string
  service_type: string
  add_ons: string[]
  total_price: number
  travel_fee?: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_id?: string
  notes?: string
  vehicle_images?: string[]
  created_at: string
  updated_at: string
}

export interface VehicleData {
  make: string
  model: string
  yearOfManufacture?: number
  monthOfFirstRegistration?: string
  fuelType?: string
  engineCapacity?: number
  co2Emissions?: number
  colour?: string
  motStatus?: string
  taxStatus?: string
  registrationNumber?: string
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