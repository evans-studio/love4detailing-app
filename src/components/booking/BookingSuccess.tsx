'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { CheckCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'

interface BookingSuccessProps {
  bookingDate: string
  bookingTime: string
  bookingReference: string
}

export function BookingSuccess({ bookingDate, bookingTime, bookingReference }: BookingSuccessProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-[#28C76F]" />
          </div>
          <CardTitle className="text-2xl font-bold">Booking Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-lg">
              Your booking is confirmed for{' '}
              <span className="font-semibold">
                {format(new Date(bookingDate), 'MMMM do, yyyy')}
              </span>{' '}
              at{' '}
              <span className="font-semibold">{bookingTime}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Booking Reference: {bookingReference}
            </p>
          </div>

          {!isAuthenticated && (
            <div className="bg-[#9747FF]/10 p-6 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">Want to manage your bookings?</h3>
              <p className="text-sm text-muted-foreground">
                Create an account to access your customer dashboard where you can view and manage all your bookings.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => router.push(ROUTES.auth.signUp)}
                  className="flex-1"
                >
                  Create Account
                </Button>
                <Button
                  onClick={() => router.push(ROUTES.auth.signIn)}
                  variant="outline"
                  className="flex-1"
                >
                  Sign In
                </Button>
              </div>
            </div>
          )}

          <div className="text-center">
            <Button
              onClick={() => router.push(ROUTES.home)}
              variant="ghost"
              className="text-muted-foreground"
            >
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 