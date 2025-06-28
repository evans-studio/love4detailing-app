'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAdminRoute } from '@/lib/auth'
import { supabase } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { Users, Search, Filter } from 'lucide-react'
import { CustomerList } from './components/CustomerList'
import { CustomerProfile } from './components/CustomerProfile'
import { StatsGrid } from './components/StatsGrid'
import { LoadingSkeleton } from './components/LoadingSkeleton'
import { Customer, CustomerProfile as CustomerProfileType } from './types'
import { content } from '@/lib/content'
import { motion } from "framer-motion"

export default function AdminCustomersClient() {
  const { user, isLoading: authLoading, isAdmin } = useAdminRoute()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high_value' | 'loyal'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'spent' | 'loyalty' | 'recent'>('name')
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfileType | null>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)

  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true)
      console.log('🔍 Starting customer fetch...')
      
      // Fetch all customers
      const { data: customersData, error: customersError } = await supabase
        .from('profiles')
        .select('*')

      // Fetch all bookings to calculate customer stats
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')

      // Fetch all rewards data
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('rewards')
        .select('*')

      if (customersData && bookingsData) {
        const customerStats = customersData.map(customer => {
          const customerBookings = bookingsData.filter(b => b.user_id === customer.id)
          const customerRewards = rewardsData?.find(r => r.user_id === customer.id)
          const totalSpent = customerBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
          const lastBooking = customerBookings.length > 0 
            ? customerBookings.sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime())[0].booking_date
            : null

          return {
            id: customer.id,
            full_name: customer.full_name || 'Unknown',
            email: customer.email,
            phone: customer.phone,
            postcode: customer.postcode,
            total_spent: totalSpent,
            total_bookings: customerBookings.length,
            loyalty_points: customerRewards?.points || 0,
            last_booking_date: lastBooking,
            created_at: customer.created_at,
            status: customerBookings.length > 0 ? 'active' : 'inactive' as 'active' | 'inactive'
          }
        })

        setCustomers(customerStats)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const filterAndSortCustomers = useCallback((customers: Customer[]) => {
    return customers
      .filter(customer => {
        const matchesSearch = searchTerm === '' ||
          customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesFilter = selectedFilter === 'all' ||
          (selectedFilter === 'high_value' && customer.total_spent > 1000) ||
          (selectedFilter === 'loyal' && customer.loyalty_points > 500)

        return matchesSearch && matchesFilter
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.full_name.localeCompare(b.full_name)
          case 'spent':
            return b.total_spent - a.total_spent
          case 'loyalty':
            return b.loyalty_points - a.loyalty_points
          case 'recent':
            return new Date(b.last_booking_date || 0).getTime() - new Date(a.last_booking_date || 0).getTime()
          default:
            return 0
        }
      })
  }, [searchTerm, selectedFilter, sortBy])

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

  const fetchCustomerProfile = async (customerId: string) => {
    setIsLoadingProfile(true)
    
    try {
      // Fetch detailed customer profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', customerId)
        .single()

      if (profileError) throw profileError

      // Fetch customer bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', customerId)
        .order('booking_date', { ascending: false })

      if (bookingsError) throw bookingsError

      // Fetch customer rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('rewards')
        .select('*')
        .eq('user_id', customerId)
        .single()

      if (rewardsData) {
        const bookings = bookingsData || []
        const customerProfile: CustomerProfileType = {
          ...profileData,
          total_spent: bookings.reduce((sum, b) => sum + (b.total_price || 0), 0),
          total_bookings: bookings.length,
          loyalty_points: rewardsData.points,
          last_booking_date: bookings.length > 0 ? bookings[0].booking_date : null,
          status: bookings.length > 0 ? 'active' : 'inactive',
          bookings: bookings.map(b => ({
            id: b.id,
            booking_date: b.booking_date,
            booking_time: b.booking_time,
            service: b.service_id,
            total_price: b.total_price,
            status: b.status
          }))
        }

        setSelectedCustomer(customerProfile)
        setIsProfileModalOpen(true)
      }
    } catch (error) {
      console.error('Error fetching customer profile:', error)
      if (typeof window !== 'undefined') {
        alert(content.admin.customers.errors.loadProfile)
      }
    } finally {
      setIsLoadingProfile(false)
    }
  }

  if (authLoading || isLoading) {
    return <LoadingSkeleton />
  }

  const totalRevenue = customers.reduce((sum, c) => sum + c.total_spent, 0)
  const activeCustomers = customers.filter(c => c.status === 'active').length
  const averageSpent = customers.length > 0 ? totalRevenue / customers.length : 0

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
                  c.full_name,
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
        totalCustomers={customers.length}
        activeCustomers={activeCustomers}
        totalRevenue={totalRevenue}
        averageSpent={averageSpent}
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
              onViewProfile={fetchCustomerProfile}
              isLoadingProfile={isLoadingProfile}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Customer Profile Modal */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer Profile
            </DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <CustomerProfile customer={selectedCustomer} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 