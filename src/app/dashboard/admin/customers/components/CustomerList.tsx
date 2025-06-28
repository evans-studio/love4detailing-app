'use client'

import { Card, CardContent } from '@/components/ui/Card'
import { Customer } from '../types'
import { formatCurrency } from '@/lib/utils/format'
import { LoadingSkeleton } from './LoadingSkeleton'

interface ProcessedCustomer extends Customer {
  total_spent: number
  total_bookings: number
  loyalty_points: number
}

interface CustomerListProps {
  customers: ProcessedCustomer[]
  onCustomerClick: (customer: ProcessedCustomer) => void
  isLoading: boolean
}

export function CustomerList({ customers, onCustomerClick, isLoading }: CustomerListProps) {
  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {customers.map(customer => (
            <div
              key={customer.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => onCustomerClick(customer)}
            >
              <div>
                <h3 className="font-medium">{customer.full_name || 'Unknown'}</h3>
                <p className="text-sm text-gray-500">{customer.email}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(customer.total_spent)}</p>
                <p className="text-sm text-gray-500">{customer.total_bookings} bookings</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 