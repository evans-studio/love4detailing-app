-- Create storage bucket for user uploads
insert into storage.buckets (id, name, public)
values ('user-uploads', 'user-uploads', true);

-- Create storage policy to allow authenticated uploads
create policy "Allow public access to user-uploads"
on storage.objects for select
using ( bucket_id = 'user-uploads' );

create policy "Allow authenticated uploads to user-uploads"
on storage.objects for insert
using ( bucket_id = 'user-uploads' );

-- Add vehicle_images column to bookings table
alter table bookings
add column vehicle_images text[] default '{}'::text[];

-- Add index for future user profile linking
create index idx_bookings_user_id on bookings(user_id);

comment on column bookings.vehicle_images is 'Array of public URLs for vehicle images uploaded during booking'; 