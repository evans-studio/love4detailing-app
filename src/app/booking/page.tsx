import BookingForm from '@/components/booking/BookingForm'

export const metadata = {
  title: 'Book a Service | Love 4 Detailing',
  description: 'Book your car valeting service with Love 4 Detailing. Choose your vehicle size, preferred date and time, and any add-ons.',
}

export default function BookingPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Book Your Car Valeting Service
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
          Choose your preferred service options and we'll take care of the rest.
        </p>
        <BookingForm />
      </div>
    </main>
  )
} 