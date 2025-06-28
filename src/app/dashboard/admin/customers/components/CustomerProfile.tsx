'use client'

import { Card, CardContent } from '@/components/ui/Card'
import { formatCurrency, formatDate } from '@/lib/utils/formatters'
import type { Customer } from '@/types'

interface ProcessedCustomer extends Customer {
  total_spent: number
  total_bookings: number
  loyalty_points: number
}

interface CustomerProfileViewProps {
  customer: ProcessedCustomer
}

export function CustomerProfileView({ customer }: CustomerProfileViewProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {customer.full_name || 'Unknown'}</p>
            <p><span className="font-medium">Email:</span> {customer.email}</p>
            <p><span className="font-medium">Phone:</span> {customer.phone || 'N/A'}</p>
            <p><span className="font-medium">Postcode:</span> {customer.postcode || 'N/A'}</p>
            <p><span className="font-medium">Member Since:</span> {formatDate(customer.created_at)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">Account Statistics</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Total Spent:</span> {formatCurrency(customer.total_spent)}</p>
            <p><span className="font-medium">Total Bookings:</span> {customer.total_bookings}</p>
            <p><span className="font-medium">Loyalty Points:</span> {customer.loyalty_points}</p>
            <p><span className="font-medium">Last Booking:</span> {customer.last_booking_date ? formatDate(customer.last_booking_date) : 'No bookings yet'}</p>
            <p><span className="font-medium">Status:</span> {customer.status || 'Inactive'}</p>
          </div>
        </CardContent>
      </Card>

      {customer.bookings && customer.bookings.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">Recent Bookings</h3>
            <div className="space-y-3">
              {customer.bookings.map((booking) => (
                <div key={booking.id} className="border-b pb-2 last:border-0">
                  <p><span className="font-medium">Date:</span> {formatDate(booking.booking_date)}</p>
                  <p><span className="font-medium">Service:</span> {booking.service}</p>
                  <p><span className="font-medium">Amount:</span> {formatCurrency(booking.total_price)}</p>
                  <p><span className="font-medium">Status:</span> {booking.status}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 