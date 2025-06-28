'use client'

import React, { useState } from 'react'
import { content } from '@/lib/content'
import { ROUTES } from '@/lib/constants'
import { formatCurrency, formatDate } from '@/lib/utils/index'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

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
  initialBookings?: BookingData[]
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

export const BookingsSection: React.FC<BookingsSectionProps> = ({
  userId,
  initialBookings = [],
}) => {
  const [bookings, setBookings] = useState<BookingData[]>(initialBookings)
  const [filter, setFilter] = useState<'all' | BookingData['status']>('all')
  const [isLoading, setIsLoading] = useState(false)

  // Filter bookings based on status
  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter)

  // Group bookings by status
  const bookingCounts = bookings.reduce((acc, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1
    return acc
  }, {} as Record<BookingData['status'], number>)

  const filterOptions = [
    { value: 'all' as const, label: 'All Bookings', count: bookings.length },
    { value: 'upcoming' as const, label: 'Upcoming', count: bookingCounts.upcoming || 0 },
    { value: 'completed' as const, label: 'Completed', count: bookingCounts.completed || 0 },
    { value: 'pending' as const, label: 'Pending', count: bookingCounts.pending || 0 },
    { value: 'cancelled' as const, label: 'Cancelled', count: bookingCounts.cancelled || 0 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">
            {content.pages.dashboard.bookings.title}
          </h2>
          <p className="text-muted-foreground">
            {content.pages.dashboard.bookings.subtitle}
          </p>
        </div>
        <Button onClick={() => window.location.href = ROUTES.booking}>
          Book New Service
        </Button>
      </div>

      {/* Filter Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2 overflow-x-auto">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={filter === option.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter(option.value)}
                className="flex-shrink-0"
              >
                {option.label}
                {option.count > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-background/20 rounded text-xs">
                    {option.count}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="animate-spin w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full"></div>
            <span className="text-muted-foreground">Loading bookings...</span>
          </div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
              {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
            </h3>
            <p className="text-muted-foreground mb-4">
              {filter === 'all' 
                ? "You haven't made any bookings yet. Ready to get your vehicle detailed?"
                : `You don't have any ${filter} bookings at the moment.`
              }
            </p>
            {filter === 'all' && (
              <Button onClick={() => window.location.href = ROUTES.booking}>
                Book Your First Service
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  )
} 