// Navigation and UI Types
export type NavItem = {
  href: string
  label: string
  icon: string
  external?: boolean
}

export type ContactItem = {
  icon: string
  label: string
  href: string | null
  value: string
}

// Service Types
export type ServicePackage = 'essential' | 'premium' | 'ultimate'
export type VehicleSize = 'small' | 'medium' | 'large' | 'extraLarge'
export type AddOnService = 'interiorProtection' | 'engineClean' | 'headlightRestoration'
export type ServiceType = 'essential' | 'premium' | 'ultimate'

// Booking Types
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed'
export type PaymentMethod = 'card' | 'cash' | 'transfer'

// Reward Types
export type RewardTier = 'bronze' | 'silver' | 'gold' | 'platinum'
export type RewardAction = 'booking' | 'review' | 'referral'

// Content Types
export type FAQItem = {
  id: string
  category: string
  question: string
  answer: string
}

export type ServiceCard = {
  id: string
  title: string
  description: string
  duration: number
  features: string[]
  popular?: boolean
}

export type FeatureItem = {
  icon: string
  title: string
  description: string
}

export type TestimonialItem = {
  id: string
  name: string
  location: string
  rating: number
  service: string
  date: string
  comment: string
}

export type LegalSection = {
  title: string
  content: string
}

export type LegalDocument = {
  title: string
  lastUpdated: string
  sections: LegalSection[]
}

// User Types
export type UserRole = 'admin' | 'staff' | 'manager' | 'customer'
export type UserStatus = 'active' | 'inactive' | 'suspended'

// Form Types
export type FormMode = 'create' | 'edit' | 'view'
export type ValidationResult = {
  isValid: boolean
  errors: Record<string, string>
}

// API Response Types
export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Utility Types
export type DateRange = {
  start: Date
  end: Date
}

export type TimeSlot = {
  start: string
  end: string
  available: boolean
}

export type PaginationParams = {
  page: number
  limit: number
  total: number
}

export type SortOrder = 'asc' | 'desc'
export type FilterOption = string | number | boolean | null

export interface Booking {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  time: string
  duration: number
  serviceId: string
  serviceName: string
  vehicleId: string
  vehicleSize: VehicleSize
  addOns: string[]
  status: BookingStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  totalAmount: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface VehicleLookupData {
  make?: string
  model?: string
  size?: VehicleSize
  id?: string
  year?: number
  registration?: string
  color?: string
  notes?: string
}

export interface Vehicle {
  id?: string
  make: string
  model: string
  year?: number
  registration?: string
  color?: string
  size: VehicleSize
  notes?: string
}

export type BookingFormData = {
  id?: string
  user_id?: string
  customer_name: string
  email: string
  phone?: string
  postcode: string
  vehicle_size: VehicleSize
  service_type: ServiceType
  booking_date: string
  booking_time: string
  add_ons: string[]
  vehicle_images: string[]
  special_requests?: string
  total_price: number
  travel_fee?: number
  status?: BookingStatus
  payment_status?: PaymentStatus
  payment_method?: PaymentMethod
  vehicle_lookup?: Vehicle
  booking_reference?: string
  notes?: string
}

export type BookingStep = 'vehicle' | 'service' | 'datetime' | 'contact' | 'confirmation' 