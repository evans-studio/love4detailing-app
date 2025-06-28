import config from '@/config/config';
import { ConfigurableBookingForm } from '@/components/booking/ConfigurableBookingForm';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardBookServicePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // You can fetch user-specific data here and pass it as default values if needed
  const defaultValues = {
    email: user.email,
    fullName: user.user_metadata?.full_name,
    // etc.
  };

  return (
    <div className="w-full">
        <h1 className="text-2xl font-bold text-white mb-6">Book a New Service</h1>
        <ConfigurableBookingForm config={config} defaultValues={defaultValues} />
    </div>
  );
} 