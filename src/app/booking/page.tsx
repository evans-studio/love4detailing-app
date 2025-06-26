import BookingForm from '@/components/booking/BookingForm'
import Container from '@/components/ui/Container'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'Book a Service | Love 4 Detailing',
  description: 'Book your car valeting service with Love 4 Detailing. Choose your vehicle size, preferred date and time, and any add-ons.',
}

export default function BookingPage() {
  return (
    <Container 
      as="main" 
      maxWidth="lg"
      className="py-6 sm:py-8 lg:py-12"
    >
      <div className="w-full">
        <h1 className={cn(
          "text-2xl sm:text-3xl font-bold",
          "text-[#F8F4EB] text-center",
          "mb-4 sm:mb-6"
        )}>
          Book Your Car Valeting Service
        </h1>
        <p className={cn(
          "text-[#C7C7C7]",
          "text-base sm:text-lg",
          "mb-6 sm:mb-8 text-center",
          "max-w-2xl mx-auto"
        )}>
          Choose your preferred service options and we'll take care of the rest.
        </p>
        <BookingForm />
      </div>
    </Container>
  )
} 