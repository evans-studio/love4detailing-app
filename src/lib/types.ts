import { SERVICES } from './constants'
import { z } from 'zod'
import { PaymentStatus } from './enums'

// Status Enums
export const BookingStatus = {
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export type PaymentStatusType = keyof typeof PaymentStatus

export type BookingStatusType = typeof BookingStatus[keyof typeof BookingStatus]

// Booking Interface
export interface Booking {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  service: keyof typeof SERVICES.packages
  vehicleSize: keyof typeof SERVICES.vehicleSizes
  addOns: (keyof typeof SERVICES.addOns)[]
  time: string
  price: number
  status: BookingStatusType
  paymentStatus: PaymentStatusType
  notes: string
  vehicleInfo?: {
    make?: string
    model?: string
    color?: string
    year?: string
  }
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
}

// Form Schemas
export const bookingFilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['all', ...Object.values(BookingStatus)]).default('all'),
  paymentStatus: z.enum(['all', ...Object.values(PaymentStatus)]).default('all'),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  service: z.enum(['all', ...Object.keys(SERVICES.packages)] as const).default('all'),
  vehicleSize: z.enum(['all', ...Object.keys(SERVICES.vehicleSizes)] as const).default('all'),
})

export const bookingEditSchema = z.object({
  time: z.date(),
  status: z.enum(['confirmed', 'completed', 'cancelled'] as const),
  notes: z.string().optional(),
})

export type FilterValues = z.infer<typeof bookingFilterSchema>
export type EditValues = z.infer<typeof bookingEditSchema>

// Sort Types
export type SortField = 'date' | 'price' | 'customerName' | 'status'
export type SortOrder = 'asc' | 'desc'

// Admin Types
export type AdminRole = 'admin' | 'staff' | 'manager' 