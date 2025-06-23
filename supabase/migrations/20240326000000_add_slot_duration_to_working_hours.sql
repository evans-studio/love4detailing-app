-- Add slot_duration_minutes column to working_hours table
ALTER TABLE working_hours 
ADD COLUMN IF NOT EXISTS slot_duration_minutes INTEGER DEFAULT 90;

-- Update existing records to have default slot duration
UPDATE working_hours 
SET slot_duration_minutes = 90 
WHERE slot_duration_minutes IS NULL; 