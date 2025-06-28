'use client'

import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, Calendar, Eye } from 'lucide-react'
import { Customer } from '../types'

interface CustomerListProps {
  customers: Customer[]
  onViewProfile: (customerId: string) => void
  isLoadingProfile: boolean
}

export function CustomerList({ customers, onViewProfile, isLoadingProfile }: CustomerListProps) {
  const getCustomerStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-500' : 'bg-gray-500'
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No customers found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search terms
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {customers.map((customer) => (
        <Card key={customer.id} className="border rounded-lg hover:bg-muted/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-sm sm:text-base truncate">{customer.full_name}</h3>
                  <Badge variant="outline" className={getCustomerStatusColor(customer.status)}>
                    {customer.status}
                  </Badge>
                </div>
                
                <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>Joined {format(new Date(customer.created_at), 'PP')}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                  <span className="font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                    {customer.total_bookings} booking{customer.total_bookings !== 1 ? 's' : ''}
                  </span>
                  <span className="font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                    £{customer.total_spent.toFixed(2)} spent
                  </span>
                  {customer.last_booking_date && (
                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                      Last: {format(new Date(customer.last_booking_date), 'MMM dd')}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewProfile(customer.id)}
                  disabled={isLoadingProfile}
                  className="touch-target"
                >
                  <Eye className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">{isLoadingProfile ? 'Loading...' : 'View'}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 