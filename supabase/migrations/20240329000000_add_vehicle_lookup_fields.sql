-- Add vehicle lookup fields to bookings table
-- These fields store the DVLA integration data

-- Add vehicle_lookup column to store the registration number or search query
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS vehicle_lookup TEXT;

-- Add vehicle_info column to store detailed vehicle information from DVLA
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS vehicle_info JSONB DEFAULT '{}'::jsonb;

-- Add travel_fee column if it doesn't exist
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS travel_fee DECIMAL(10,2) DEFAULT 0.00;

-- Add add_ons column if it doesn't exist
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS add_ons JSONB DEFAULT '[]'::jsonb;

-- Add vehicle_images column if it doesn't exist
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS vehicle_images TEXT[] DEFAULT '{}';

-- Add customer_name column if it doesn't exist
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS customer_name TEXT;

-- Add vehicle_size column if it doesn't exist
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS vehicle_size TEXT;

-- Add payment_status column if it doesn't exist
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Add payment_id column if it doesn't exist
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS payment_id TEXT;

-- Add booking_reference column if it doesn't exist
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS booking_reference TEXT;

-- Add comment to document the vehicle_info structure
COMMENT ON COLUMN public.bookings.vehicle_info IS 'JSON object containing vehicle details from DVLA: {make, model, registration, year, fuelType, colour, etc.}';

-- Create index for faster searches on vehicle registration
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_lookup ON public.bookings(vehicle_lookup);

-- Create GIN index for vehicle_info JSONB searches
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_info ON public.bookings USING GIN (vehicle_info);

-- Create GIN index for add_ons JSONB searches  
CREATE INDEX IF NOT EXISTS idx_bookings_add_ons ON public.bookings USING GIN (add_ons); 