-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";

-- Create users table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text unique,
  phone text,
  postcode text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create services table
create table if not exists public.services (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  type service_type not null,
  description text,
  price decimal(10,2) not null,
  duration_minutes integer not null,
  features jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create bookings table
create table if not exists public.bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  service_id uuid references public.services(id) on delete restrict not null,
  status booking_status default 'pending' not null,
  booking_date date not null,
  booking_time time not null,
  postcode text not null,
  travel_fee decimal(10,2),
  total_price decimal(10,2) not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create rewards table
create table if not exists public.rewards (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  points integer default 0 not null,
  total_earned integer default 0 not null,
  total_redeemed integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint points_non_negative check (points >= 0)
);

-- Create rewards transactions table
create table if not exists public.reward_transactions (
  id uuid default uuid_generate_v4() primary key,
  reward_id uuid references public.rewards(id) on delete cascade not null,
  booking_id uuid references public.bookings(id) on delete set null,
  points_change integer not null,
  transaction_type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create functions and triggers
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  
  insert into public.rewards (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.handle_booking_completion()
returns trigger as $$
begin
  if new.status = 'completed' and old.status != 'completed' then
    -- Calculate points (1 point per pound spent)
    insert into public.reward_transactions (
      reward_id,
      booking_id,
      points_change,
      transaction_type
    )
    select
      r.id,
      new.id,
      floor(new.total_price)::integer,
      'earned'
    from public.rewards r
    where r.user_id = new.user_id;
    
    -- Update rewards balance
    update public.rewards
    set
      points = points + floor(new.total_price)::integer,
      total_earned = total_earned + floor(new.total_price)::integer
    where user_id = new.user_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_booking_completed
  after update on public.bookings
  for each row execute procedure public.handle_booking_completion();

-- Create indexes
create index if not exists bookings_user_id_idx on public.bookings(user_id);
create index if not exists bookings_service_id_idx on public.bookings(service_id);
create index if not exists bookings_date_idx on public.bookings(booking_date);
create index if not exists rewards_user_id_idx on public.rewards(user_id);
create index if not exists reward_transactions_reward_id_idx on public.reward_transactions(reward_id);

-- Set up row level security
alter table public.profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.rewards enable row level security;
alter table public.reward_transactions enable row level security;

-- Create policies safely
DO $$
BEGIN
  -- Profiles policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own profile') THEN
    CREATE POLICY "Users can view their own profile"
      ON public.profiles FOR SELECT
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own profile') THEN
    CREATE POLICY "Users can update their own profile"
      ON public.profiles FOR UPDATE
      USING (auth.uid() = id);
  END IF;

  -- Bookings policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own bookings') THEN
    CREATE POLICY "Users can view their own bookings"
      ON public.bookings FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create their own bookings') THEN
    CREATE POLICY "Users can create their own bookings"
      ON public.bookings FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own bookings') THEN
    CREATE POLICY "Users can update their own bookings"
      ON public.bookings FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;

  -- Rewards policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own rewards') THEN
    CREATE POLICY "Users can view their own rewards"
      ON public.rewards FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  -- Reward transactions policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own reward transactions') THEN
    CREATE POLICY "Users can view their own reward transactions"
      ON public.reward_transactions FOR SELECT
      USING (auth.uid() in (
        SELECT user_id FROM public.rewards WHERE id = reward_transactions.reward_id
      ));
  END IF;
END$$;

-- Insert initial services if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.services WHERE type = 'basic_valet') THEN
    INSERT INTO public.services (name, type, description, price, duration_minutes, features) VALUES
      (
        'Basic Valet',
        'basic_valet',
        'A thorough exterior and interior cleaning service',
        49.99,
        120,
        '["Exterior hand wash and dry", "Wheel cleaning and tire dressing", "Interior vacuum and dust", "Dashboard and console cleaning", "Window cleaning inside and out", "Air freshener"]'::jsonb
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.services WHERE type = 'premium_detail') THEN
    INSERT INTO public.services (name, type, description, price, duration_minutes, features) VALUES
      (
        'Premium Detail',
        'premium_detail',
        'Comprehensive detailing for a showroom finish',
        149.99,
        240,
        '["All Basic Valet services", "Clay bar treatment", "Paint decontamination", "Machine polish", "Leather cleaning and conditioning", "Interior deep clean", "Carpet shampooing", "Paint sealant application"]'::jsonb
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.services WHERE type = 'ultimate_package') THEN
    INSERT INTO public.services (name, type, description, price, duration_minutes, features) VALUES
      (
        'Ultimate Package',
        'ultimate_package',
        'The most comprehensive detailing experience',
        299.99,
        360,
        '["All Premium Detail services", "Ceramic coating application", "Multi-stage paint correction", "Engine bay detailing", "Glass coating", "Leather protection", "Interior sanitization", "Paint protection film consultation"]'::jsonb
      );
  END IF;
END$$; 