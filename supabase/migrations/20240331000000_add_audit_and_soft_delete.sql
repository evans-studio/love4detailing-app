-- Add soft delete functionality to core tables
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Create audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE', 'SOFT_DELETE', 'RESTORE')),
    old_values JSONB,
    new_values JSONB,
    user_id UUID REFERENCES auth.users(id),
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
    ON public.audit_logs FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.email IN ('evanspaul87@gmail.com', 'admin@love4detailing.com')
    ));

-- Create function to handle soft deletes
CREATE OR REPLACE FUNCTION handle_soft_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Don't actually delete the record
    NEW.deleted_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for soft delete
CREATE TRIGGER before_delete_bookings
    BEFORE DELETE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION handle_soft_delete();

CREATE TRIGGER before_delete_profiles
    BEFORE DELETE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_soft_delete();

-- Update RLS policies to exclude soft deleted records
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
CREATE POLICY "Users can view their own bookings"
    ON public.bookings FOR SELECT
    USING (auth.uid() = user_id AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id AND deleted_at IS NULL);

-- Create function to log changes
CREATE OR REPLACE FUNCTION log_table_changes()
RETURNS TRIGGER AS $$
DECLARE
    old_values JSONB;
    new_values JSONB;
    operation_type TEXT;
    user_id UUID;
BEGIN
    -- Get current user ID from auth.uid()
    user_id := auth.uid();
    
    IF TG_OP = 'INSERT' THEN
        old_values := NULL;
        new_values := to_jsonb(NEW);
        operation_type := 'INSERT';
    ELSIF TG_OP = 'UPDATE' THEN
        old_values := to_jsonb(OLD);
        new_values := to_jsonb(NEW);
        
        -- Check if this is a soft delete operation
        IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
            operation_type := 'SOFT_DELETE';
        ELSE
            operation_type := 'UPDATE';
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        old_values := to_jsonb(OLD);
        new_values := NULL;
        operation_type := 'DELETE';
    END IF;

    -- Insert into audit_logs
    INSERT INTO public.audit_logs (
        table_name,
        record_id,
        operation,
        old_values,
        new_values,
        user_id
    ) VALUES (
        TG_TABLE_NAME,
        CASE 
            WHEN TG_OP = 'DELETE' THEN OLD.id
            ELSE NEW.id
        END,
        operation_type,
        old_values,
        new_values,
        user_id
    );

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers for important tables
CREATE TRIGGER audit_bookings_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION log_table_changes();

CREATE TRIGGER audit_profiles_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION log_table_changes();

CREATE TRIGGER audit_rewards_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.rewards
    FOR EACH ROW EXECUTE FUNCTION log_table_changes();

-- Grant necessary permissions
GRANT ALL ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role; 