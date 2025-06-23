-- Create rewards table to track user points
create table rewards (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade,
    points integer not null default 0,
    total_saved decimal(10,2) not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create rewards_history table to track point transactions
create table rewards_history (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade,
    booking_id uuid references bookings(id) on delete set null,
    points integer not null,
    type text not null check (type in ('earned', 'redeemed')),
    description text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add rewards_points column to bookings table
alter table bookings
add column rewards_points integer default 0;

-- Create function to update rewards on booking completion
create or replace function update_rewards_on_booking()
returns trigger as $$
begin
    -- Calculate points (1 point per £1)
    new.rewards_points := floor(new.total_price);
    
    -- Insert into rewards history
    insert into rewards_history (
        user_id,
        booking_id,
        points,
        type,
        description
    ) values (
        new.user_id,
        new.id,
        new.rewards_points,
        'earned',
        'Points earned from booking #' || new.id
    );
    
    -- Update total points in rewards table
    insert into rewards (user_id, points)
    values (new.user_id, new.rewards_points)
    on conflict (user_id)
    do update set
        points = rewards.points + new.rewards_points,
        updated_at = now();
    
    return new;
end;
$$ language plpgsql;

-- Create trigger for new bookings
create trigger booking_rewards_trigger
    after insert
    on bookings
    for each row
    execute function update_rewards_on_booking();

-- Create indexes for performance
create index idx_rewards_user_id on rewards(user_id);
create index idx_rewards_history_user_id on rewards_history(user_id);
create index idx_rewards_history_booking_id on rewards_history(booking_id);

-- Add RLS policies
alter table rewards enable row level security;
alter table rewards_history enable row level security;

create policy "Users can view their own rewards"
    on rewards for select
    using (auth.uid() = user_id);

create policy "System can update rewards"
    on rewards for all
    using (true)
    with check (true);

create policy "Users can view their own rewards history"
    on rewards_history for select
    using (auth.uid() = user_id);

create policy "System can insert rewards history"
    on rewards_history for insert
    with check (true);

-- Comments
comment on table rewards is 'Stores user reward points and savings';
comment on table rewards_history is 'Tracks all reward point transactions';
comment on column rewards.points is 'Current available points balance';
comment on column rewards.total_saved is 'Total amount saved through reward redemptions';
comment on column rewards_history.type is 'Type of transaction: earned or redeemed';
comment on column bookings.rewards_points is 'Points earned from this booking'; 