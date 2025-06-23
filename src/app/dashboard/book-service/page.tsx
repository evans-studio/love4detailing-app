import DashboardBookingForm from '@/components/booking/DashboardBookingForm'

export default function BookServicePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Book a Service</h1>
        <p className="text-muted-foreground">
          Schedule your next car detailing service with our enhanced booking system
        </p>
      </div>
      
      <DashboardBookingForm />
    </div>
  )
} 