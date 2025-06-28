-- Safely create all enum types
DO $$
BEGIN
  -- Create booking_status enum if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    CREATE TYPE booking_status AS ENUM (
      'pending',
      'confirmed',
      'in_progress',
      'completed',
      'cancelled'
    );
  END IF;

  -- Create payment_status enum if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    CREATE TYPE payment_status AS ENUM (
      'pending',
      'paid',
      'refunded',
      'failed'
    );
  END IF;

  -- Create service_type enum if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_type') THEN
    CREATE TYPE service_type AS ENUM (
      'basic_valet',
      'premium_detail',
      'ultimate_package'
    );
  END IF;

  -- Create vehicle_size enum if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vehicle_size') THEN
    CREATE TYPE vehicle_size AS ENUM (
      'small',
      'medium',
      'large',
      'extra_large'
    );
  END IF;

  -- Create reward_tier enum if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reward_tier') THEN
    CREATE TYPE reward_tier AS ENUM (
      'bronze',
      'silver',
      'gold',
      'platinum'
    );
  END IF;
END$$;

-- Add comment for documentation
COMMENT ON TYPE booking_status IS 'Valid states for a booking throughout its lifecycle';
COMMENT ON TYPE payment_status IS 'Valid states for a payment throughout its lifecycle';
COMMENT ON TYPE service_type IS 'Types of detailing services offered';
COMMENT ON TYPE vehicle_size IS 'Vehicle size categories for pricing';
COMMENT ON TYPE reward_tier IS 'Loyalty program tiers with increasing benefits'; 