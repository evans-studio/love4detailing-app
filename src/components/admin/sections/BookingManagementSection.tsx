'use client'

import React, { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, parseISO, isAfter, startOfDay, isBefore, endOfDay, compareAsc, compareDesc } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Sheet as _Sheet, SheetContent as _SheetContent, SheetHeader as _SheetHeader, SheetTitle as _SheetTitle, SheetTrigger as _SheetTrigger } from '@/components/ui/sheet'
import { Calendar } from '@/components/ui/calendar'
import { Skeleton as _Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { BookingDetailsModal } from '@/components/admin/modals/BookingDetailsModal'
import { SERVICES as _SERVICES } from '@/lib/constants'
import {
  Booking,
  BookingStatus,
  PaymentStatus,
  ApiResponse,
  SortOrder
} from '@/lib/types'
import { Label as UILabel } from '@/components/ui/label'
import { EmptyState } from '@/components/ui/empty-state'
import { BookingSkeleton } from '@/components/ui/skeletons'
import { z } from 'zod'
import { Calendar as CalendarIcon } from 'lucide-react'

type AdminRole = 'admin' | 'staff' | 'manager'
type SortableFields = 'time' | 'customerName' | 'status'

interface FilterFormValues {
  dateFrom: Date | undefined
  dateTo: Date | undefined
  status: typeof BookingStatus[keyof typeof BookingStatus] | 'all'
}

interface BookingManagementSectionProps {
  _adminId: string
  _adminRole: AdminRole
  initialBookings?: Booking[]
}

// Define edit form schema
const editFormSchema = z.object({
  time: z.date(),
  status: z.nativeEnum(BookingStatus),
  notes: z.string().optional()
})

type EditFormValues = z.infer<typeof editFormSchema>

export function BookingManagementSection({
  _adminId,
  _adminRole,
  initialBookings = [],
}: BookingManagementSectionProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortableFields>('time')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  
  const [bookings, _setBookings] = useState<Booking[]>(initialBookings)

  const sortOptions: { value: SortableFields; label: string }[] = [
    { value: 'time', label: 'Date' },
    { value: 'customerName', label: 'Customer Name' },
    { value: 'status', label: 'Status' }
  ]

  // Filter form
  const filterForm = useForm<FilterFormValues>({
    defaultValues: {
      dateFrom: undefined,
      dateTo: undefined,
      status: 'all'
    }
  })

  // Handle status change
  const handleStatusChange = (value: string) => {
    filterForm.setValue('status', value as typeof BookingStatus[keyof typeof BookingStatus] | 'all')
  }

  // Watch filter values for dependency tracking
  const filterValues = filterForm.watch(['status', 'dateFrom', 'dateTo'])

  // Edit form
  const _editForm = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      time: new Date(),
      status: BookingStatus.CONFIRMED,
      notes: '',
    },
  })

  // Filter bookings based on search term and filters
  const filteredBookings = useMemo(() => {
    const [status, dateFrom, dateTo] = filterForm.watch(['status', 'dateFrom', 'dateTo'])
    
    return bookings
      .filter((booking) => {
        const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = status === 'all' || booking.status === status
        
        const bookingDate = parseISO(booking.time)
        
        const isAfterFromDate = !dateFrom || isAfter(bookingDate, startOfDay(dateFrom))
        const isBeforeToDate = !dateTo || isBefore(bookingDate, endOfDay(dateTo))
        
        return matchesSearch && matchesStatus && isAfterFromDate && isBeforeToDate
      })
      .sort((a, b) => {
        if (sortField === 'time') {
          return sortOrder === 'asc'
            ? compareAsc(parseISO(a.time), parseISO(b.time))
            : compareDesc(parseISO(a.time), parseISO(b.time))
        }
        
        const aValue = a[sortField]
        const bValue = b[sortField]
        return sortOrder === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue))
      })
  }, [bookings, searchTerm, filterForm, sortField, sortOrder])

  // Handle booking update
  const handleBookingUpdate = async (bookingId: string, data: EditFormValues) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result: ApiResponse<Booking> = await response.json()

      if (!result.success) {
        throw new Error('Failed to update booking')
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

  // Get status badge variant
  const getStatusVariant = (status: typeof BookingStatus[keyof typeof BookingStatus]): 'default' | 'secondary' | 'success' | 'alert' => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return 'default'
      case BookingStatus.COMPLETED:
        return 'success'
      case BookingStatus.CANCELLED:
        return 'alert'
      default:
        return 'secondary'
    }
  }

  // Get payment status badge variant
  const getPaymentStatusVariant = (status: typeof PaymentStatus[keyof typeof PaymentStatus]): 'default' | 'secondary' | 'success' | 'alert' => {
    switch (status) {
      case PaymentStatus.PAID:
        return 'success'
      case PaymentStatus.UNPAID:
        return 'alert'
      case PaymentStatus.REFUNDED:
        return 'default'
      case PaymentStatus.FAILED:
        return 'alert'
      default:
        return 'secondary'
    }
  }

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
              <UILabel className="text-sm font-medium text-[var(--color-text)]">Search</UILabel>
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <UILabel className="text-sm font-medium text-[var(--color-text)]">Status</UILabel>
              <Select
                value={filterForm.watch('status')}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {Object.values(BookingStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <UILabel className="text-sm font-medium text-[var(--color-text)]">From Date</UILabel>
              <Calendar
                mode="single"
                selected={filterForm.watch('dateFrom')}
                onSelect={(date) => filterForm.setValue('dateFrom', date)}
                className="mt-1"
              />
            </div>

            <div>
              <UILabel className="text-sm font-medium text-[var(--color-text)]">To Date</UILabel>
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
        <div className="flex items-center gap-2">
          <UILabel>Sort by:</UILabel>
          <Select
            value={sortField}
            onValueChange={(value) => setSortField(value as SortableFields)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {isLoading ? (
          // Show skeletons while loading
          Array.from({ length: 3 }).map((_, i) => <BookingSkeleton key={i} />)
        ) : filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="w-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{booking.customerName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(booking.time), 'PPP')} at {format(parseISO(booking.time), 'HH:mm')}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={getStatusVariant(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState
            icon={CalendarIcon}
            title="No bookings found"
            description="Try adjusting your filters or search term"
          />
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