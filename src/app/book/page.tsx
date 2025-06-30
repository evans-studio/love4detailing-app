'use client'

import { BookingFlow } from '@/components/booking/BookingFlow'

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-muted/10 py-12">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Book a Service</h1>
          <p className="text-muted-foreground mt-2">
            Complete the form below to book your car detailing service.
          </p>
        </div>
        
        <BookingFlow />
      </div>
    </main>
  )
} 