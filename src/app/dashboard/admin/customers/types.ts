export interface Customer {
  id: string
  full_name: string
  email: string
  phone: string
  postcode: string
  total_spent: number
  total_bookings: number
  loyalty_points: number
  last_booking_date?: string
  created_at: string
  status: 'active' | 'inactive'
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
    service: string
    total_price: number
    status: string
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