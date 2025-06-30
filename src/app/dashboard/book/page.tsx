import { BookingFlow } from '@/components/booking/BookingFlow';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardBookServicePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="w-full">
        <h1 className="text-2xl font-bold text-white mb-6">Book a New Service</h1>
        <BookingFlow />
    </div>
  );
} 