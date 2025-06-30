import { BookingStatus, PaymentStatus, ServiceType, VehicleSize, PaymentMethod } from '@/lib/enums';

// Vehicle lookup type
export type VehicleLookup = {
  size: VehicleSize;
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
  phone: string;
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
  id: string;
  registration: string;
  vehicle_lookup: VehicleLookup;
  vehicle_images: string[];
  vehicleSize: VehicleSize;
  fullName: string;
  email: string;
  phone: string;
  postcode: string;
  address: string;
  serviceId: ServiceType;
  addOnIds: string[];
  date: string;
  timeSlot: string;
  total_price: number;
  travel_fee: number;
  add_ons_price: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  special_requests?: string;
  notes?: string;
  requires_manual_approval: boolean;
  distance?: number;
  booking_reference: string;
};

// API request type - what the API expects
export type BookingRequest = {
  user_id?: string;
  vehicle_lookup: VehicleLookup;
  vehicle_images?: string[];
  vehicle_size: VehicleSize;
  customer_name: string;
  email: string;
  phone?: string;
  postcode: string;
  address: string;
  service_type: ServiceType;
  add_ons?: string[];
  booking_date: string;
  booking_time: string;
  total_price: number;
  travel_fee?: number;
  add_ons_price: number;
  status?: BookingStatus;
  payment_status?: PaymentStatus;
  payment_method?: PaymentMethod;
  special_requests?: string;
  notes?: string;
  requires_manual_approval?: boolean;
  distance?: number;
  booking_reference?: string;
  created_at?: string;
  updated_at?: string;
};