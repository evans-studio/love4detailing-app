'use client'

import React, { useState } from 'react'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { SERVICES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils/formatters'

interface Booking {
  id: string
  customerName: string
  service: keyof typeof SERVICES.packages
  vehicleSize: keyof typeof SERVICES.vehicleSizes
  time: string
  price: number
  status: 'confirmed' | 'completed' | 'cancelled'
}

interface CalendarViewProps {
  adminId: string
  adminRole: 'admin' | 'staff' | 'manager'
  bookings: Booking[]
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  adminId,
  adminRole,
  bookings,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  // Get the start and end of the current week
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }) // Start on Monday
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 })

  // Get all days in the current week
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Filter bookings for the selected day
  const getDayBookings = (date: Date) => {
    return bookings.filter(booking => isSameDay(new Date(booking.time), date))
  }

  // Get status badge color
  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-[var(--color-primary)] text-white'
      case 'completed':
        return 'bg-green-500 text-white'
      case 'cancelled':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">Calendar View</h2>
          <p className="text-muted-foreground">
            Manage bookings by date
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setSelectedDate(subWeeks(selectedDate, 1))}
          >
            Previous Week
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedDate(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedDate(addWeeks(selectedDate, 1))}
          >
            Next Week
          </Button>
        </div>
      </div>

      {/* Week View */}
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <Card key={day.toString()} className={`${isSameDay(day, new Date()) ? 'border-[var(--color-primary)]' : ''}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {format(day, 'EEEE')}
                <br />
                {format(day, 'd MMM')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getDayBookings(day).map((booking) => (
                  <Sheet key={booking.id}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium truncate">
                              {format(new Date(booking.time), 'HH:mm')}
                            </span>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {booking.customerName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {SERVICES.packages[booking.service].name}
                          </p>
                        </div>
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Booking Details</SheetTitle>
                      </SheetHeader>
                      {selectedBooking && (
                        <div className="space-y-6 mt-6">
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Customer</h3>
                            <p className="text-sm">{selectedBooking.customerName}</p>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Service</h3>
                            <p className="text-sm">{SERVICES.packages[selectedBooking.service].name}</p>
                            <p className="text-sm text-muted-foreground">
                              {SERVICES.packages[selectedBooking.service].description}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Vehicle Size</h3>
                            <p className="text-sm">{SERVICES.vehicleSizes[selectedBooking.vehicleSize].label}</p>
                            <p className="text-sm text-muted-foreground">
                              {SERVICES.vehicleSizes[selectedBooking.vehicleSize].description}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Time & Price</h3>
                            <p className="text-sm">
                              {format(new Date(selectedBooking.time), 'PPP')} at{' '}
                              {format(new Date(selectedBooking.time), 'HH:mm')}
                            </p>
                            <p className="text-sm font-medium text-[var(--color-primary)]">
                              {formatCurrency(selectedBooking.price)}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Status</h3>
                            <Badge className={getStatusColor(selectedBooking.status)}>
                              {selectedBooking.status}
                            </Badge>
                          </div>

                          <div className="flex justify-end gap-2 mt-8">
                            {selectedBooking.status === 'confirmed' && (
                              <>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    // Handle cancellation
                                  }}
                                >
                                  Cancel Booking
                                </Button>
                                <Button
                                  onClick={() => {
                                    // Handle completion
                                  }}
                                >
                                  Mark as Complete
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </SheetContent>
                  </Sheet>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 