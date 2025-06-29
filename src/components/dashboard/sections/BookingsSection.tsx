'use client'

import React, { useState, useEffect } from 'react'
import { content } from '@/lib/content'
import { ROUTES } from '@/lib/constants'
import { formatCurrency, formatDate } from '@/lib/utils/formatters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { EmptyState } from '@/components/ui/empty-state'

interface BookingData {
  id: string
  status: 'upcoming' | 'completed' | 'cancelled' | 'pending'
  servicePackage: string
  serviceName: string
  date: string
  timeSlot: string
  total: number
  vehicleInfo: string
  address?: string
  notes?: string
  createdAt: string
  paymentStatus: 'paid' | 'unpaid' | 'refunded' | 'failed'
}

interface BookingsSectionProps {
  userId: string
  initialData: {
    bookings?: Array<{
      id: string
      booking_date: string
      booking_time: string
      service: string
      total_price: number
      status: string
      vehicle_images: string[]
      postcode: string
      notes?: string
      created_at: string
      vehicle_make: string
      vehicle_model: string
    }>
  }
}

const BookingCard: React.FC<{ booking: BookingData }> = ({ booking }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-[var(--color-info)] text-white'
      case 'completed': return 'bg-[var(--color-success)] text-white'
      case 'cancelled': return 'bg-[var(--color-error)] text-white'
      case 'pending': return 'bg-[var(--color-warning)] text-white'
      default: return 'bg-[var(--color-muted)] text-white'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-[var(--color-success)]'
      case 'unpaid': return 'text-[var(--color-warning)]'
      case 'refunded': return 'text-[var(--color-info)]'
      case 'failed': return 'text-[var(--color-error)]'
      default: return 'text-[var(--color-muted)]'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Upcoming'
      case 'completed': return 'Completed'
      case 'cancelled': return 'Cancelled'
      case 'pending': return 'Pending'
      default: return status
    }
  }

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid'
      case 'unpaid': return 'Cash Payment Pending'
      case 'refunded': return 'Refunded'
      case 'failed': return 'Payment Failed'
      default: return status
    }
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-[var(--color-text)] mb-1">
              {booking.serviceName}
            </h4>
            <p className="text-sm text-muted-foreground">
              {booking.vehicleInfo}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
              {getStatusLabel(booking.status)}
            </span>
            <span className={`text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
              {getPaymentStatusLabel(booking.paymentStatus)}
            </span>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 text-sm">
          <div>
            <p className="text-muted-foreground">Date & Time</p>
            <p className="font-medium text-[var(--color-text)]">
              {formatDate(new Date(booking.date), 'short')} at {booking.timeSlot}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Total</p>
            <p className="font-bold text-[var(--color-primary)]">
              {formatCurrency(booking.total)}
            </p>
          </div>
        </div>

        {booking.address && (
          <div className="mt-2 text-sm">
            <p className="text-muted-foreground">Location</p>
            <p className="text-[var(--color-text)]">{booking.address}</p>
          </div>
        )}

        {booking.notes && (
          <div className="mt-2 text-sm">
            <p className="text-muted-foreground">Notes</p>
            <p className="text-[var(--color-text)]">{booking.notes}</p>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          {booking.status === 'upcoming' && (
            <>
              <Button size="sm" variant="outline">
                Reschedule
              </Button>
              <Button size="sm" variant="ghost" className="text-[var(--color-error)]">
                Cancel
              </Button>
            </>
          )}
          {booking.status === 'completed' && (
            <Button size="sm" variant="outline">
              Book Again
            </Button>
          )}
          <Button size="sm" variant="ghost">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function BookingsSection({ userId, initialData }: BookingsSectionProps) {
  const [bookings, setBookings] = useState(initialData.bookings || [])
  const [isLoading, setIsLoading] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500'
      case 'pending': return 'bg-platinum-silver'
      case 'completed': return 'bg-blue-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <AlertCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="animate-spin w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full"></div>
                <span className="text-muted-foreground">Loading...</span>
              </div>
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="border-l-4 border-l-primary hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium capitalize text-sm sm:text-base truncate">{booking.service}</h3>
                          <Badge variant="outline" className={getStatusColor(booking.status)}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1">{booking.status}</span>
                          </Badge>
                        </div>
                        
                        <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>{format(new Date(booking.booking_date), 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>{booking.booking_time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>{booking.postcode}</span>
                          </div>
                        </div>
                        
                        {booking.notes && (
                          <p className="text-xs sm:text-sm text-muted-foreground italic">
                            Notes: {booking.notes}
                          </p>
                        )}
                        
                        <p className="text-xs text-muted-foreground">
                          Booked on {format(new Date(booking.created_at), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="No bookings found"
              description="You haven't made any bookings yet"
              action={{
                label: "Book a Service",
                onClick: () => window.location.href = '/booking'
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
} 