'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBookingStore } from '@/lib/stores/booking'
import { ROUTES } from '@/lib/constants/routes'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import { CheckCircle } from 'lucide-react'

export default function ConfirmationClient() {
  const router = useRouter()
  const { date, timeSlot, reset } = useBookingStore()

  useEffect(() => {
    // If no booking data, redirect to booking page
    if (!date || !timeSlot) {
      router.replace(ROUTES.book)
    }

    // Cleanup booking store when leaving the page
    return () => {
      reset()
    }
  }, [date, timeSlot, router, reset])

  if (!date || !timeSlot) {
    return null
  }

  return (
    <Container>
      <div className="max-w-2xl mx-auto py-12">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-[var(--color-primary)]" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
          <p className="text-muted-foreground mb-8">
            Your booking has been successfully confirmed for{' '}
            <span className="font-semibold text-foreground">
              {new Date(date).toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>{' '}
            at{' '}
            <span className="font-semibold text-foreground">{timeSlot}</span>
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            We've sent a confirmation email with all the details. You can also view your booking in your dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => router.push(ROUTES.dashboard)}
            >
              View Dashboard
            </Button>
            <Button onClick={() => router.push(ROUTES.home)}>
              Return Home
            </Button>
          </div>
        </Card>
      </div>
    </Container>
  )
} 