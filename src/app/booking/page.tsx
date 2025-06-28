import config from '@/config/config';
import { ConfigurableBookingForm } from '@/components/booking/ConfigurableBookingForm';

export default async function BookingPage() {

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight text-center sm:text-4xl">
          Book Your Detailing Service
        </h1>
        <p className="mt-4 text-center text-lg text-muted-foreground">
          Fill out the form below to schedule your appointment.
        </p>

        <div className="mt-12">
            <ConfigurableBookingForm config={config} />
        </div>
      </div>
    </div>
  );
} 