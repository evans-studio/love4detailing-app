'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { supabase } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { Search, User } from 'lucide-react'
import { CustomerList } from './components/CustomerList'
import { CustomerProfileView } from './components/CustomerProfile'
import { StatsGrid } from './components/StatsGrid'
import { LoadingSkeleton } from './components/LoadingSkeleton'
import type { Customer } from '@/types'
import { content } from '@/lib/content'
import { motion } from "framer-motion"
import { useProtectedRoute } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'
import { LoyaltyTier, CustomerStatus, PaymentStatus } from '@/lib/enums'

type SortBy = 'name' | 'spent' | 'loyalty' | 'recent'

interface ProcessedCustomer extends Customer {
  total_spent: number
  total_bookings: number
  loyalty_points: number
  loyalty_tier: LoyaltyTier
}

export default function AdminCustomersClient() {
  const { user } = useProtectedRoute()
  const [customers, setCustomers] = useState<ProcessedCustomer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<ProcessedCustomer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high_value' | 'loyal'>('all')
  const [sortBy, setSortBy] = useState<SortBy>('name')
  const [selectedCustomer, setSelectedCustomer] = useState<ProcessedCustomer | null>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const { toast } = useToast()

  const fetchCustomers = useCallback(async () => {
    try {
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')

      if (customersError) throw customersError

      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')

      if (bookingsError) throw bookingsError

      const { data: rewardsData, error: rewardsError } = await supabase
        .from('rewards')
        .select('*')

      if (rewardsError) throw rewardsError

      const processedCustomers: ProcessedCustomer[] = customersData.map((customer: Customer) => ({
        id: customer.id,
        email: customer.email,
        full_name: customer.full_name || null,
        avatar_url: customer.avatar_url || null,
        postcode: customer.postcode || null,
        phone: customer.phone || undefined,
        created_at: customer.created_at,
        total_spent: customer.total_spent || 0,
        total_bookings: bookingsData.filter((b: { user_id: string }) => b.user_id === customer.id).length,
        loyalty_points: rewardsData.find((r: { user_id: string; points: number }) => r.user_id === customer.id)?.points || 0,
        loyalty_tier: rewardsData.find((r: { user_id: string; loyalty_tier: LoyaltyTier }) => r.user_id === customer.id)?.loyalty_tier || LoyaltyTier.BRONZE,
        last_booking_date: bookingsData
          .filter((b: { user_id: string }) => b.user_id === customer.id)
          .sort((a: { booking_date: string }, b: { booking_date: string }) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime())[0]?.booking_date || null,
        status: customer.status || CustomerStatus.INACTIVE
      }))

      setCustomers(processedCustomers)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching customers:', error)
      setIsLoading(false)
    }
  }, [])

  const filterAndSortCustomers = useCallback((customers: ProcessedCustomer[]) => {
    return customers
      .filter(customer => {
        const searchLower = searchTerm.toLowerCase()
        const nameMatch = customer.full_name?.toLowerCase().includes(searchLower) || false
        const emailMatch = customer.email.toLowerCase().includes(searchLower)
        return nameMatch || emailMatch
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return (a.full_name || '').localeCompare(b.full_name || '')
          case 'spent':
            return (b.total_spent || 0) - (a.total_spent || 0)
          case 'loyalty':
            return (b.loyalty_points || 0) - (a.loyalty_points || 0)
          case 'recent':
            return new Date(b.last_booking_date || 0).getTime() - new Date(a.last_booking_date || 0).getTime()
          default:
            return 0
        }
      })
  }, [searchTerm, sortBy])

  useEffect(() => {
    if (customers) {
      setFilteredCustomers(filterAndSortCustomers(customers))
    }
  }, [customers, filterAndSortCustomers])

  useEffect(() => {
    if (user) {
      fetchCustomers()
    }
  }, [user, fetchCustomers])

  // Refresh customers when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        fetchCustomers()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [user, fetchCustomers])

  const handleViewProfile = useCallback(async (customer: ProcessedCustomer) => {
    try {
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', customer.id)
        .order('booking_date', { ascending: false })

      if (bookingsError) throw bookingsError

      const processedCustomer: ProcessedCustomer = {
        ...customer,
        bookings: bookingsData.map(booking => ({
          id: booking.id,
          booking_date: booking.booking_date,
          booking_time: booking.booking_time,
          service: booking.service_type,
          total_price: booking.total_price,
          status: booking.status,
          payment_status: booking.payment_status || PaymentStatus.PENDING
        }))
      }

      setSelectedCustomer(processedCustomer)
      setIsProfileModalOpen(true)
    } catch (error) {
      console.error('Error fetching customer profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to load customer profile',
        variant: 'destructive'
      })
    }
  }, [toast])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  const customerStats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === CustomerStatus.ACTIVE).length,
    totalRevenue: customers.reduce((sum, c) => sum + (c.total_spent || 0), 0),
    averageSpent: customers.length > 0 
      ? customers.reduce((sum, c) => sum + (c.total_spent || 0), 0) / customers.length 
      : 0,
    loyalCustomers: customers.filter(c => (c.loyalty_points || 0) > 500).length,
    recentBookings: customers.filter(c => c.last_booking_date && 
      new Date(c.last_booking_date).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000).length
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{content.admin.customers.title}</h1>
          <p className="text-sm text-muted-foreground">{content.admin.customers.subtitle}</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => fetchCustomers()}
            disabled={isLoading}
            className="w-full sm:w-auto touch-target"
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => {
              // Export customers to CSV
              const csvContent = [
                ['Name', 'Email', 'Phone', 'Status', 'Total Spent', 'Total Bookings', 'Joined'],
                ...filteredCustomers.map(c => [
                  c.full_name || '',
                  c.email,
                  c.phone || '',
                  c.status,
                  c.total_spent.toFixed(2),
                  c.total_bookings.toString(),
                  format(new Date(c.created_at), 'PP')
                ])
              ].map(row => row.join(',')).join('\n')
              
              const blob = new Blob([csvContent], { type: 'text/csv' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `customers-${format(new Date(), 'yyyy-MM-dd')}.csv`
              a.click()
              window.URL.revokeObjectURL(url)
            }}
            className="w-full sm:w-auto touch-target"
          >
            <span className="hidden sm:inline">Export </span>Customers
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <StatsGrid
        totalCustomers={customerStats.totalCustomers}
        activeCustomers={customerStats.activeCustomers}
        totalRevenue={customerStats.totalRevenue}
        averageSpent={customerStats.averageSpent}
        loyalCustomers={customerStats.loyalCustomers}
        recentBookings={customerStats.recentBookings}
      />

      {/* Customer List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <div className="space-y-4">
              <CardTitle className="text-lg">All Customers</CardTitle>
              
              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value as 'all' | 'high_value' | 'loyal')}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">{content.admin.customers.filters.all}</option>
                    <option value="high_value">{content.admin.customers.filters.high_value}</option>
                    <option value="loyal">{content.admin.customers.filters.loyal}</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'spent' | 'loyalty' | 'recent')}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="name">{content.admin.customers.sort.name}</option>
                    <option value="spent">{content.admin.customers.sort.spent}</option>
                    <option value="loyalty">{content.admin.customers.sort.loyalty}</option>
                    <option value="recent">{content.admin.customers.sort.recent}</option>
                  </select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <CustomerList
              customers={filteredCustomers}
              onCustomerClick={handleViewProfile}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Customer Profile Modal */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Profile
            </DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <CustomerProfileView customer={selectedCustomer} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 