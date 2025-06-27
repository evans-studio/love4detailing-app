-- Create dashboard_stats table
create table if not exists public.dashboard_stats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  total_bookings integer default 0,
  completed_bookings integer default 0,
  total_spent decimal(10,2) default 0.00,
  last_booking_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for better query performance
create index if not exists idx_dashboard_stats_user_id on dashboard_stats(user_id);

-- Enable RLS
alter table public.dashboard_stats enable row level security;

-- Create policies
create policy "Users can view their own dashboard stats"
  on public.dashboard_stats for select
  using (auth.uid() = user_id);

create policy "Users can update their own dashboard stats"
  on public.dashboard_stats for update
  using (auth.uid() = user_id);

-- Create function to initialize dashboard stats for new users
create or replace function public.initialize_dashboard_stats()
returns trigger as $$
begin
  insert into public.dashboard_stats (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to initialize dashboard stats when a new profile is created
create trigger on_profile_created
  after insert on public.profiles
  for each row execute procedure public.initialize_dashboard_stats();

-- Grant necessary permissions
grant all on dashboard_stats to authenticated;
grant all on dashboard_stats to service_role; 