-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE vehicle_size AS ENUM ('small', 'medium', 'large', 'van');
CREATE TYPE service_type AS ENUM ('basic-wash', 'full-valet', 'premium-detail');
CREATE TYPE booking_status AS ENUM ('draft', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('card', 'cash', 'stripe', 'paypal');
CREATE TYPE loyalty_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum');
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');

-- Create users table (handled by Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES users(id),
  full_name TEXT,
  phone TEXT,
  postcode TEXT,
  address TEXT,
  loyalty_tier loyalty_tier NOT NULL DEFAULT 'bronze',
  loyalty_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  registration TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  color TEXT,
  size vehicle_size NOT NULL DEFAULT 'medium',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, registration)
);

-- Create services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type service_type NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  features JSONB,
  base_price JSONB NOT NULL, -- { "small": 49.99, "medium": 59.99, "large": 69.99, "van": 79.99 }
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(type)
);

-- Create add_ons table
CREATE TABLE add_ons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price JSONB NOT NULL, -- { "small": 29.99, "medium": 39.99, "large": 49.99, "van": 59.99 }
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id),
  service_type service_type NOT NULL,
  add_ons UUID[] DEFAULT '{}',
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  vehicle_size vehicle_size NOT NULL,
  vehicle_lookup JSONB,
  vehicle_images TEXT[] DEFAULT '{}',
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  postcode TEXT NOT NULL,
  address TEXT NOT NULL,
  special_requests TEXT,
  notes TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  add_ons_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  travel_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  payment_method payment_method,
  booking_reference TEXT NOT NULL UNIQUE,
  requires_manual_approval BOOLEAN NOT NULL DEFAULT false,
  distance DECIMAL(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create reward_transactions table
CREATE TABLE reward_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  points INTEGER NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX idx_reward_transactions_user_id ON reward_transactions(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- Create functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_add_ons_updated_at
  BEFORE UPDATE ON add_ons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at(); 