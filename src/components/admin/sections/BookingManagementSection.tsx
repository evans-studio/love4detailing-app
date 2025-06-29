'use client'

import React, { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Calendar } from '@/components/ui/calendar'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { BookingDetailsModal } from '@/components/admin/modals/BookingDetailsModal'
import { SERVICES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils/formatters'
import {
  Booking,
  AdminRole,
  BookingStatus,
  PaymentStatus,
  FilterValues,
  EditValues,
  SortField,
  SortOrder,
  bookingFilterSchema,
  bookingEditSchema,
  ApiResponse,
  BookingStatusType,
  PaymentStatusType
} from '@/lib/types'

interface BookingManagementSectionProps {
  adminId: string
  adminRole: AdminRole
  bookings: Booking[]
}

export const BookingManagementSection: React.FC<BookingManagementSectionProps> = ({
  adminId: _adminId,
  adminRole: _adminRole,
  bookings,
}) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const { toast } = useToast()

  // Filter form
  const filterForm = useForm<FilterValues>({
    resolver: zodResolver(bookingFilterSchema),
    defaultValues: {
      status: 'all',
      paymentStatus: 'all',
      service: 'all',
      vehicleSize: 'all',
    },
  })

  // Edit form
  const _editForm = useForm<EditValues>({
    resolver: zodResolver(bookingEditSchema),
    defaultValues: {
      time: new Date(),
      status: BookingStatus.CONFIRMED,
      notes: '',
    },
  })

  // Filter and sort bookings
  const filteredAndSortedBookings = useMemo(() => {
    // Extract watched values to avoid dependency array issues
    const searchTerm = filterForm.watch('search')
    const statusFilter = filterForm.watch('status')
    const paymentStatusFilter = filterForm.watch('paymentStatus')
    const serviceFilter = filterForm.watch('service')
    const vehicleSizeFilter = filterForm.watch('vehicleSize')
    const dateFromFilter = filterForm.watch('dateFrom')
    const dateToFilter = filterForm.watch('dateTo')

    const result = bookings.filter(booking => {
      const searchMatch = !searchTerm || 
        booking.customerName.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
        booking.customerEmail.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
        booking.customerPhone.includes(searchTerm || '')

      const statusMatch = statusFilter === 'all' || 
        booking.status === statusFilter

      const paymentStatusMatch = paymentStatusFilter === 'all' ||
        booking.paymentStatus === paymentStatusFilter

      const serviceMatch = serviceFilter === 'all' ||
        booking.service === serviceFilter

      const vehicleSizeMatch = vehicleSizeFilter === 'all' ||
        booking.vehicleSize === vehicleSizeFilter

      const bookingDate = new Date(booking.time)
      const dateMatch = (!dateFromFilter || bookingDate >= dateFromFilter) && 
        (!dateToFilter || bookingDate <= dateToFilter)

      return searchMatch && statusMatch && paymentStatusMatch && 
        serviceMatch && vehicleSizeMatch && dateMatch
    })

    // Sort bookings
    result.sort((a, b) => {
      switch (sortField) {
        case 'date':
          return sortOrder === 'asc' 
            ? new Date(a.time).getTime() - new Date(b.time).getTime()
            : new Date(b.time).getTime() - new Date(a.time).getTime()
        case 'price':
          return sortOrder === 'asc'
            ? a.price - b.price
            : b.price - a.price
        case 'customerName':
          return sortOrder === 'asc'
            ? a.customerName.localeCompare(b.customerName)
            : b.customerName.localeCompare(a.customerName)
        case 'status':
          return sortOrder === 'asc'
            ? a.status.localeCompare(b.status)
            : b.status.localeCompare(a.status)
        default:
          return 0
      }
    })

    return result
  }, [
    bookings,
    filterForm,
    sortField,
    sortOrder
  ])

  // Handle booking update
  const handleBookingUpdate = async (bookingId: string, data: EditValues) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result: ApiResponse<Booking> = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update booking')
      }
      
      toast({
        title: 'Booking Updated',
        description: 'The booking has been successfully updated.',
      })

      // Refresh bookings or update local state
      // Implementation depends on data fetching strategy
    } catch (error) {
      console.error('Error updating booking:', error)
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Failed to update booking',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Get status badge color
  const getStatusColor = (status: BookingStatusType) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return 'bg-[var(--color-primary)] text-white'
      case BookingStatus.COMPLETED:
        return 'bg-green-500 text-white'
      case BookingStatus.CANCELLED:
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getPaymentStatusColor = (status: PaymentStatusType) => {
    switch (status) {
      case PaymentStatus.PAID:
        return 'bg-green-500 text-white'
      case PaymentStatus.UNPAID:
        return 'bg-yellow-500 text-white'
      case PaymentStatus.REFUNDED:
        return 'bg-blue-500 text-white'
      case PaymentStatus.FAILED:
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  // Loading skeleton component
  const BookingSkeleton = () => (
    <Card className="w-full mb-4 animate-pulse">
      <CardContent className="p-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex space-x-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text)]">Booking Management</h2>
        <p className="text-muted-foreground">
          View and manage all bookings
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-sm font-medium text-[var(--color-text)]">Search</label>
              <Input
                {...filterForm.register('search')}
                placeholder="Search by name, email, phone..."
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--color-text)]">Status</label>
              <Select
                value={filterForm.watch('status')}
                onValueChange={(value) => filterForm.setValue('status', value as FilterValues['status'])}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--color-text)]">Payment Status</label>
              <Select
                value={filterForm.watch('paymentStatus')}
                onValueChange={(value) => filterForm.setValue('paymentStatus', value as FilterValues['paymentStatus'])}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--color-text)]">Service</label>
              <Select
                value={filterForm.watch('service')}
                onValueChange={(value) => filterForm.setValue('service', value as FilterValues['service'])}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {Object.entries(SERVICES.packages).map(([key, service]) => (
                    <SelectItem key={key} value={key}>{service.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--color-text)]">Vehicle Size</label>
              <Select
                value={filterForm.watch('vehicleSize')}
                onValueChange={(value) => filterForm.setValue('vehicleSize', value as FilterValues['vehicleSize'])}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select vehicle size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  {Object.entries(SERVICES.vehicleSizes).map(([key, size]) => (
                    <SelectItem key={key} value={key}>{size.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--color-text)]">From Date</label>
              <Calendar
                mode="single"
                selected={filterForm.watch('dateFrom')}
                onSelect={(date) => filterForm.setValue('dateFrom', date)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--color-text)]">To Date</label>
              <Calendar
                mode="single"
                selected={filterForm.watch('dateTo')}
                onSelect={(date) => filterForm.setValue('dateTo', date)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sort Controls */}
      <div className="flex items-center gap-4">
        <Select
          value={sortField}
          onValueChange={(value) => setSortField(value as SortField)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="customerName">Customer Name</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </Button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {isLoading ? (
          // Show skeletons while loading
          Array.from({ length: 3 }).map((_, i) => <BookingSkeleton key={i} />)
        ) : filteredAndSortedBookings.length > 0 ? (
          filteredAndSortedBookings.map((booking) => (
            <Card key={booking.id} className="w-full">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[var(--color-text)]">
                        {booking.customerName}
                      </h3>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                        {booking.paymentStatus}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(booking.time), 'PPP')} at {format(new Date(booking.time), 'HH:mm')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {SERVICES.packages[booking.service].name} • {SERVICES.vehicleSizes[booking.vehicleSize].label}
                    </p>
                    {booking.addOns.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {booking.addOns.map((addOn) => (
                          <Badge key={addOn} variant="outline">
                            {SERVICES.addOns[addOn].name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-lg font-medium text-[var(--color-primary)]">
                    {formatCurrency(booking.price)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="w-full">
            <CardContent className="p-6 text-center text-gray-500">
              No bookings found matching your filters
            </CardContent>
          </Card>
        )}
      </div>

      {/* Booking details modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onUpdate={handleBookingUpdate}
          isLoading={isLoading}
          adminRole={_adminRole}
          onDismiss={() => setSelectedBooking(null)}
        />
      )}
    </div>
  )
} 