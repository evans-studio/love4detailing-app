import type { Customer as GlobalCustomer } from '@/types'
import { ServiceType, BookingStatus, PaymentStatus } from '@/lib/enums'

export type Customer = GlobalCustomer

export interface CustomerStats {
  totalCustomers: number
  activeCustomers: number
  totalRevenue: number
  averageSpent: number
  loyalCustomers: number
  recentBookings: number
}

export interface CustomerProfile extends Customer {
  vehicle_reg?: string
  vehicle_make?: string
  vehicle_model?: string
  vehicle_color?: string
  bookings: {
    id: string
    booking_date: string
    booking_time: string
    service: ServiceType
    total_price: number
    status: BookingStatus
    payment_status: PaymentStatus
  }[]
}

export interface Booking {
  id: string
  booking_date: string
  booking_time: string
  service_id: string
  total_price: number
  status: string
  notes?: string
} 