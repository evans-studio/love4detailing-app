import { BookingStatus, PaymentStatus, ServiceType, VehicleSize } from '@/lib/enums';

// Vehicle lookup type
export type VehicleLookup = {
  size: 'small' | 'medium' | 'large' | 'extraLarge';
  make: string;
  model: string;
  id?: string;
  year?: number;
  registration?: string;
  color?: string;
  notes?: string;
};

// Types
export type BookingFormData = {
  id?: string;
  customer_name: string;
  email: string;
  phone?: string;
  postcode: string;
  address: string;
  service_type: ServiceType;
  vehicle_size: VehicleSize;
  booking_date: string;
  booking_time: string;
  add_ons: string[];
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
}; 