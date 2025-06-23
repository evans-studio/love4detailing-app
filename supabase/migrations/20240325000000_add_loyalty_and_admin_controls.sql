-- Create loyalty badges table
CREATE TABLE IF NOT EXISTS loyalty_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#8B5A96',
  requirements JSONB NOT NULL, -- e.g., {"bookings": 5, "spending": 500}
  tier INTEGER DEFAULT 1, -- 1=Bronze, 2=Silver, 3=Gold, 4=Platinum
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user badges (many-to-many relationship)
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES loyalty_badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Create loyalty tiers table
CREATE TABLE IF NOT EXISTS loyalty_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  min_points INTEGER NOT NULL,
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  benefits JSONB DEFAULT '[]',
  color TEXT DEFAULT '#8B5A96',
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin settings table for operational controls
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create working hours table
CREATE TABLE IF NOT EXISTS working_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_bookings_per_slot INTEGER DEFAULT 1,
  slot_duration_minutes INTEGER DEFAULT 90,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(day_of_week)
);

-- Update rewards table to include more loyalty features
ALTER TABLE rewards 
ADD COLUMN IF NOT EXISTS tier_id UUID REFERENCES loyalty_tiers(id),
ADD COLUMN IF NOT EXISTS lifetime_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_tier_points INTEGER DEFAULT 0;

-- Insert default loyalty badges
INSERT INTO loyalty_badges (name, description, icon, requirements, tier) VALUES
('First Timer', 'Welcome to Love4Detailing! Your first service is complete.', '🚗', '{"bookings": 1}', 1),
('Regular Customer', 'You''ve booked 5 services with us!', '⭐', '{"bookings": 5}', 1),
('Loyal Customer', 'You''ve been with us for 10 services!', '💎', '{"bookings": 10}', 2),
('Big Spender', 'You''ve spent over £500 with us!', '💰', '{"spending": 500}', 2),
('VIP Member', 'You''ve booked 25 services - you''re a true VIP!', '👑', '{"bookings": 25}', 3),
('Premium Customer', 'You''ve spent over £1000 with us!', '🏆', '{"spending": 1000}', 3),
('Love4Detailing Legend', 'You''ve booked 50 services - legendary status!', '🌟', '{"bookings": 50}', 4);

-- Insert default loyalty tiers
INSERT INTO loyalty_tiers (name, min_points, discount_percentage, benefits, color, icon) VALUES
('Bronze', 0, 0, '["Priority booking notifications"]', '#CD7F32', '🥉'),
('Silver', 500, 5, '["5% discount on all services", "Priority support"]', '#C0C0C0', '🥈'),
('Gold', 1500, 10, '["10% discount on all services", "Free add-ons", "Priority scheduling"]', '#FFD700', '🥇'),
('Platinum', 3000, 15, '["15% discount on all services", "Free monthly service", "Personal detailing consultant"]', '#E5E4E2', '💎');

-- Insert default admin settings
INSERT INTO admin_settings (setting_key, setting_value, description) VALUES
('default_working_hours', '{"start": "10:00", "end": "17:00"}', 'Default working hours for the business'),
('max_daily_bookings', '5', 'Maximum number of bookings per day'),
('booking_advance_days', '30', 'How many days in advance customers can book'),
('loyalty_points_rate', '10', 'Percentage of spending converted to loyalty points'),
('cancellation_window_hours', '24', 'Hours before service that cancellation is allowed');

-- Insert default working hours (Monday to Friday, 10:00-17:00)
INSERT INTO working_hours (day_of_week, start_time, end_time, max_bookings_per_slot, slot_duration_minutes) VALUES
(1, '10:00', '17:00', 1, 90), -- Monday
(2, '10:00', '17:00', 1, 90), -- Tuesday
(3, '10:00', '17:00', 1, 90), -- Wednesday
(4, '10:00', '17:00', 1, 90), -- Thursday
(5, '10:00', '17:00', 1, 90), -- Friday
(6, '10:00', '16:00', 1, 90); -- Saturday

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_tiers_min_points ON loyalty_tiers(min_points);
CREATE INDEX IF NOT EXISTS idx_working_hours_day ON working_hours(day_of_week);
CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON admin_settings(setting_key);

-- Enable RLS
ALTER TABLE loyalty_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;

-- RLS Policies for loyalty_badges (public read, admin write)
CREATE POLICY "Anyone can view loyalty badges"
ON loyalty_badges FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage loyalty badges"
ON loyalty_badges FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.email = 'd.dimpauls@gmail.com'
));

-- RLS Policies for user_badges (users can view their own, admins can manage all)
CREATE POLICY "Users can view their own badges"
ON user_badges FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user badges"
ON user_badges FOR SELECT
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.email = 'd.dimpauls@gmail.com'
));

CREATE POLICY "System can award badges"
ON user_badges FOR INSERT
WITH CHECK (true);

-- RLS Policies for loyalty_tiers (public read, admin write)
CREATE POLICY "Anyone can view loyalty tiers"
ON loyalty_tiers FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage loyalty tiers"
ON loyalty_tiers FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.email = 'd.dimpauls@gmail.com'
));

-- RLS Policies for admin_settings (admin only)
CREATE POLICY "Only admins can access admin settings"
ON admin_settings FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.email = 'd.dimpauls@gmail.com'
));

-- RLS Policies for working_hours (public read, admin write)
CREATE POLICY "Anyone can view working hours"
ON working_hours FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage working hours"
ON working_hours FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.email = 'd.dimpauls@gmail.com'
)); 