'use client'

import React, { useState } from 'react'
import { formatCurrency, formatDate } from '@/lib/utils/formatters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface CustomerData {
  id: string
  fullName: string
  email: string
  phone?: string
  address?: string
  postcode?: string
  loyaltyPoints: number
  tier: string
  totalBookings: number
  totalSpent: number
  lastBooking?: string
  createdAt: string
  status: 'active' | 'inactive' | 'banned'
}

interface CustomerManagementSectionProps {
  adminId: string
  adminRole: 'admin' | 'staff' | 'manager'
  initialCustomers?: CustomerData[]
}

export const CustomerManagementSection: React.FC<CustomerManagementSectionProps> = ({
  adminId,
  adminRole,
  initialCustomers = [],
}) => {
  const [customers, setCustomers] = useState<CustomerData[]>(initialCustomers)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTier, setFilterTier] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null)

  // Filter customers based on search and filters
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.postcode?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTier = filterTier === 'all' || customer.tier === filterTier
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus
    
    return matchesSearch && matchesTier && matchesStatus
  })

  const handleViewCustomer = (customer: CustomerData) => {
    setSelectedCustomer(customer)
  }

  const handleUpdateCustomerStatus = async (customerId: string, newStatus: CustomerData['status']) => {
    setIsLoading(true)
    try {
      // TODO: Implement API call to update customer status
      setCustomers(prev => 
        prev.map(c => c.id === customerId ? { ...c, status: newStatus } : c)
      )
    } catch (error) {
      console.error('Failed to update customer status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: CustomerData['status']) => {
    switch (status) {
      case 'active':
        return 'text-[var(--color-success)] bg-[var(--color-success)]/10'
      case 'inactive':
        return 'text-[var(--color-warning)] bg-[var(--color-warning)]/10'
      case 'banned':
        return 'text-[var(--color-error)] bg-[var(--color-error)]/10'
      default:
        return 'text-muted-foreground bg-muted'
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return 'text-[var(--color-warning)] bg-[var(--color-warning)]/10'
      case 'silver':
        return 'text-[var(--color-info)] bg-[var(--color-info)]/10'
      case 'gold':
        return 'text-[var(--color-warning)] bg-[var(--color-warning)]/20'
      case 'platinum':
        return 'text-[var(--color-primary)] bg-[var(--color-primary)]/10'
      default:
        return 'text-muted-foreground bg-muted'
    }
  }

  if (selectedCustomer) {
    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedCustomer(null)}
          >
            ← Back to Customers
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-text)]">
              Customer Details
            </h2>
            <p className="text-muted-foreground">
              Manage customer account and booking history
            </p>
          </div>
        </div>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedCustomer.fullName}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedCustomer.status)}`}>
                {selectedCustomer.status}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Contact Information</p>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p>Email: {selectedCustomer.email}</p>
                    {selectedCustomer.phone && <p>Phone: {selectedCustomer.phone}</p>}
                    {selectedCustomer.address && (
                      <p>Address: {selectedCustomer.address}{selectedCustomer.postcode && `, ${selectedCustomer.postcode}`}</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Account Details</p>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p>Member since: {formatDate(new Date(selectedCustomer.createdAt), 'long')}</p>
                    <p>Customer ID: {selectedCustomer.id}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Loyalty Information</p>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTierColor(selectedCustomer.tier)}`}>
                        {selectedCustomer.tier} Member
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {selectedCustomer.loyaltyPoints} points
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Booking Statistics</p>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p>Total bookings: {selectedCustomer.totalBookings}</p>
                    <p>Total spent: {formatCurrency(selectedCustomer.totalSpent)}</p>
                    {selectedCustomer.lastBooking && (
                      <p>Last booking: {formatDate(new Date(selectedCustomer.lastBooking), 'short')}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {adminRole === 'admin' && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm font-medium text-[var(--color-text)] mb-3">Admin Actions</p>
                <div className="flex gap-2">
                  {selectedCustomer.status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateCustomerStatus(selectedCustomer.id, 'inactive')}
                      disabled={isLoading}
                    >
                      Deactivate Account
                    </Button>
                  )}
                  {selectedCustomer.status === 'inactive' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateCustomerStatus(selectedCustomer.id, 'active')}
                      disabled={isLoading}
                    >
                      Reactivate Account
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[var(--color-error)]"
                    onClick={() => handleUpdateCustomerStatus(selectedCustomer.id, 'banned')}
                    disabled={isLoading}
                  >
                    Ban Account
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text)]">Customer Management</h2>
        <p className="text-muted-foreground">
          Search and manage customer accounts
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="h-10 rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="all">All Tiers</option>
              <option value="bronze">Bronze</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
              <option value="platinum">Platinum</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-10 rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>

            <div className="text-sm text-muted-foreground flex items-center">
              {filteredCustomers.length} of {customers.length} customers
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="animate-spin w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full"></div>
            <span className="text-muted-foreground">Loading customers...</span>
          </div>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
              No customers found
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || filterTier !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No customers have been registered yet'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="transition-all duration-200 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[var(--purple-100)] rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-[var(--color-primary)]">
                        {customer.fullName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--color-text)]">
                        {customer.fullName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {customer.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTierColor(customer.tier)}`}>
                          {customer.tier}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(customer.status)}`}>
                          {customer.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {customer.totalBookings} bookings • {formatCurrency(customer.totalSpent)}
                      </p>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewCustomer(customer)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 