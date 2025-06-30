export interface PaymentConfirmationData {
  customer_name: string
  email: string
  amount: number
  currency: string
  booking_reference: string
  payment_id: string
}

export interface BookingConfirmationData {
  customer_name: string
  email: string
  postcode: string
  address: string
  vehicle_size: string
  service_type: string
  booking_date: string
  booking_time: string
  add_ons: string[]
  vehicle_images: string[]
  vehicle_lookup: {
    size: string
    make: string
    model: string
    registration: string
    year?: number
    color?: string
    notes?: string
  }
  total_price: number
  travel_fee: number
  add_ons_price: number
  status: string
  payment_status: string
  payment_method: string
  booking_reference: string
  special_requests?: string
  notes?: string
}

export interface EmailServiceImpl {
  sendBookingConfirmation: (data: BookingConfirmationData) => Promise<void>
  sendPaymentConfirmation: (data: PaymentConfirmationData) => Promise<void>
} 