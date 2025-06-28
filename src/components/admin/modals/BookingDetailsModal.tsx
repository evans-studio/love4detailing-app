'use client'

import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SERVICES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils/formatters'
import {
  Booking,
  AdminRole,
  BookingStatus,
  PaymentStatus,
  EditValues,
  bookingEditSchema,
  BookingStatusType,
  PaymentStatusType
} from '@/lib/types'

interface BookingDetailsModalProps {
  booking: Booking
  adminRole: AdminRole
  onUpdate: (bookingId: string, data: EditValues) => Promise<void>
  isLoading?: boolean
  onDismiss: () => void
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  adminRole,
  onUpdate,
  isLoading: externalLoading,
  onDismiss,
}) => {
  const [internalLoading, setInternalLoading] = useState(false)
  const isLoading = externalLoading || internalLoading

  // Edit form
  const editForm = useForm<EditValues>({
    resolver: zodResolver(bookingEditSchema),
    defaultValues: {
      time: new Date(booking.time),
      status: booking.status,
      notes: booking.notes,
    },
  })

  // Handle form submission
  const handleSubmit: SubmitHandler<EditValues> = async (data) => {
    try {
      setInternalLoading(true)
      await onUpdate(booking.id, data)
      onDismiss()
    } catch (error) {
      console.error('Error updating booking:', error)
    } finally {
      setInternalLoading(false)
    }
  }

  // Helper function to check if user has permission for an action
  const hasPermission = (action: 'edit' | 'cancel' | 'payment'): boolean => {
    switch (action) {
      case 'edit':
        return ['admin', 'manager'].includes(adminRole)
      case 'cancel':
        return ['admin', 'manager', 'staff'].includes(adminRole)
      case 'payment':
        return ['admin', 'manager'].includes(adminRole)
      default:
        return false
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

  return (
    <Sheet onOpenChange={(open) => !open && onDismiss()}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Booking Details</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="details" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-4">
            {/* Service Details */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Service</h3>
              <p className="text-sm">{SERVICES.packages[booking.service].name}</p>
              <p className="text-sm text-muted-foreground">
                {SERVICES.packages[booking.service].description}
              </p>
              <p className="text-sm text-muted-foreground">
                Duration: {SERVICES.packages[booking.service].duration}
              </p>
            </div>

            {/* Add-ons */}
            {booking.addOns.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Add-ons</h3>
                <div className="space-y-1">
                  {booking.addOns.map((addOn) => (
                    <div key={addOn} className="flex items-center justify-between">
                      <p className="text-sm">{SERVICES.addOns[addOn].name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(SERVICES.addOns[addOn].price)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Time & Price */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Time & Price</h3>
              <p className="text-sm">
                {format(new Date(booking.time), 'PPP')} at {format(new Date(booking.time), 'HH:mm')}
              </p>
              <p className="text-sm font-medium text-[var(--color-primary)]">
                {formatCurrency(booking.price)}
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Status</h3>
              <div className="flex gap-2">
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status}
                </Badge>
                <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                  {booking.paymentStatus}
                </Badge>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Notes</h3>
              <p className="text-sm text-muted-foreground">
                {booking.notes || 'No notes added'}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="customer" className="space-y-6 mt-4">
            {/* Customer Details */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <p className="text-sm">{booking.customerName}</p>
              <p className="text-sm text-muted-foreground">{booking.customerEmail}</p>
              <p className="text-sm text-muted-foreground">{booking.customerPhone}</p>
            </div>
          </TabsContent>

          <TabsContent value="vehicle" className="space-y-6 mt-4">
            {/* Vehicle Details */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Vehicle Information</h3>
              {booking.vehicleInfo ? (
                <>
                  <p className="text-sm">
                    {booking.vehicleInfo.make} {booking.vehicleInfo.model} ({booking.vehicleInfo.year})
                  </p>
                  <p className="text-sm text-muted-foreground">Color: {booking.vehicleInfo.color}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No vehicle information provided</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Form */}
        {hasPermission('edit') && (
          <form onSubmit={editForm.handleSubmit(handleSubmit)} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Booking Time</label>
              <Calendar
                mode="single"
                selected={editForm.watch('time')}
                onSelect={(date) => date && editForm.setValue('time', date)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={editForm.watch('status')}
                onValueChange={(value) => editForm.setValue('status', value as BookingStatusType)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(BookingStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Input
                {...editForm.register('notes')}
                placeholder="Add booking notes..."
                disabled={isLoading}
              />
            </div>

            <SheetFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Booking'}
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
} 