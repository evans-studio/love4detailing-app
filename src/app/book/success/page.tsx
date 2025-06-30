'use client'

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function BookingSuccessPage() {
  return (
    <main className="min-h-screen bg-muted/10 py-12">
      <div className="container max-w-2xl">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">
            Booking Confirmed!
          </h1>
          
          <p className="text-muted-foreground mb-8">
            Thank you for booking with Love4Detailing. We have sent you a confirmation
            email with all the details of your appointment.
          </p>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If you need to make any changes to your booking or have any questions,
              please don't hesitate to contact us.
            </p>
            
            <div className="flex justify-center gap-4">
                <Link href="/dashboard">
                <Button variant="outline">
                  View Booking
                </Button>
                </Link>
              
                <Link href="/">
                <Button>
                  Return Home
                </Button>
                </Link>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
} 