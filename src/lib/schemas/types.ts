import { BookingStatus, PaymentStatus, ServiceType, VehicleSize, PaymentMethod } from '@/lib/enums';

// Vehicle lookup type
export type VehicleLookup = {
  size: 'small' | 'medium' | 'large' | 'extraLarge';
  make: string;
  model: string;
  registration: string;
  year?: number;
  color?: string;
  notes?: string;
};

// Common booking fields
export type BaseBookingFields = {
  id?: string;
  email: string;
  phone?: string;
  postcode: string;
  address: string;
  vehicle_images: string[];
  vehicle_lookup: VehicleLookup;
  total_price: number;
  travel_fee: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  requires_manual_approval?: boolean;
  distance?: {
    miles: number;
    text: string;
  };
  booking_reference?: string;
  created_at?: string;
  updated_at?: string;
  special_requests?: string;
  notes?: string;
};

// Form data type - what the form component uses
export type BookingFormData = {
  id?: string;
  // Vehicle Details
  registration: string;
  vehicle_lookup: VehicleLookup;
  vehicle_images: string[];
  vehicleSize: VehicleSize;
  
  // Personal Details
  fullName: string;
  email: string;
  phone?: string;
  postcode: string;
  address: string;
  
  // Service Details
  serviceId: string;
  addOnIds: string[];
  
  // Date & Time
  date: string;
  timeSlot: string;
  
  // Pricing & Status
  total_price: number;
  travel_fee?: number;
  status?: BookingStatus;
  payment_status?: PaymentStatus;
  payment_method?: PaymentMethod;
  
  // Additional Info
  special_requests?: string;
  notes?: string;
  requires_manual_approval?: boolean;
  distance?: {
    miles: number;
    text: string;
  };
  booking_reference?: string;
};

// API request type - what the API expects
export type BookingRequest = {
  id?: string;
  user_id?: string;
  customer_name: string;
  email: string;
  phone?: string;
  postcode: string;
  address: string;
  vehicle_size: VehicleSize;
  service_type: ServiceType;
  booking_date: string;
  booking_time: string;
  add_ons: string[];
  vehicle_images: string[];
  vehicle_lookup: VehicleLookup;
  total_price: number;
  travel_fee: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  special_requests?: string;
  notes?: string;
  requires_manual_approval?: boolean;
  distance?: {
    miles: number;
    text: string;
  };
  booking_reference?: string;
  created_at?: string;
  updated_at?: string;
};