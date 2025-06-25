"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/Input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useProtectedRoute } from '@/lib/auth'
import { supabase } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { 
  Users, 
  Mail, 
  Phone, 
  Calendar, 
  TrendingUp, 
  Search,
  Filter,
  Download,
  Eye,
  Car,
  MapPin,
  Award,
  CreditCard
} from 'lucide-react'

interface Customer {
  id: string
  full_name: string
  email: string
  phone?: string
  total_spent: number
  total_bookings: number
  rewards_points: number
  last_booking: string | null
  created_at: string
  status: 'active' | 'inactive'
}

interface CustomerProfile extends Customer {
  address?: string
  postcode?: string
  vehicle_make?: string
  vehicle_model?: string
  vehicle_color?: string
  bookings: Booking[]
  rewards: {
    points: number
    total_saved: number
  }
}

interface Booking {
  id: string
  booking_date: string
  booking_time: string
  service_id: string
  total_price: number
  status: string
  notes?: string
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <Card key={i}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 bg-muted rounded animate-pulse w-32" />
              <div className="h-4 bg-muted rounded animate-pulse w-48" />
            </div>
            <div className="h-8 bg-muted rounded animate-pulse w-24" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)

export default function AdminCustomersPage() {
  const { user, isLoading: authLoading } = useProtectedRoute()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'spent' | 'bookings' | 'date'>('name')
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)

  useEffect(() => {
    if (user) {
      console.log('🔑 Current user:', user)
      fetchCustomers()
    }
  }, [user])

  // Refresh customers when component becomes visible (user switches back to this tab)
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
  }, [user])

  useEffect(() => {
    filterAndSortCustomers()
  }, [customers, searchTerm, sortBy])

  async function fetchCustomers() {
    try {
      setIsLoading(true)
      console.log('🔍 Starting customer fetch...')
      
      // Fetch all customers
      const { data: customersData, error: customersError } = await supabase
        .from('profiles')
        .select('*')

      console.log('👥 Raw customers data:', customersData)
      console.log('❌ Customers error:', customersError)

      // Fetch all bookings to calculate customer stats
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')

      console.log('📅 Raw bookings data:', bookingsData)
      console.log('❌ Bookings error:', bookingsError)

      // Fetch all rewards data
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('rewards')
        .select('*')

      console.log('🏆 Raw rewards data:', rewardsData)
      console.log('❌ Rewards error:', rewardsError)

      if (customersData && bookingsData) {
        const customerStats = customersData.map(customer => {
          const customerBookings = bookingsData.filter(b => b.user_id === customer.id)
          const customerRewards = rewardsData?.find(r => r.user_id === customer.id)
          const totalSpent = customerBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
          const lastBooking = customerBookings.length > 0 
            ? customerBookings.sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime())[0].booking_date
            : null

          console.log(`📊 Customer ${customer.email}:`, {
            bookings: customerBookings.length,
            totalSpent,
            rewards: customerRewards?.points || 0
          })

          return {
            id: customer.id,
            full_name: customer.full_name || 'Unknown',
            email: customer.email,
            phone: customer.phone,
            total_spent: totalSpent,
            total_bookings: customerBookings.length,
            rewards_points: customerRewards?.points || 0,
            last_booking: lastBooking,
            created_at: customer.created_at,
            status: customerBookings.length > 0 ? 'active' : 'inactive' as 'active' | 'inactive'
          }
        })

        console.log('✅ Final customer stats:', customerStats)
        setCustomers(customerStats)
        console.log('📈 Total customers found:', customerStats.length)
      } else {
        console.log('⚠️ Missing data - customers:', !!customersData, 'bookings:', !!bookingsData)
      }
    } catch (error) {
      console.error('💥 Error fetching customers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  function filterAndSortCustomers() {
    let filtered = customers.filter(customer =>
      customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Sort customers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.full_name.localeCompare(b.full_name)
        case 'spent':
          return b.total_spent - a.total_spent
        case 'bookings':
          return b.total_bookings - a.total_bookings
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

    setFilteredCustomers(filtered)
  }

  async function fetchCustomerProfile(customerId: string) {
    setIsLoadingProfile(true)
    console.log('Fetching profile for customer:', customerId) // Debug log
    
    try {
      // Fetch detailed customer profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', customerId)
        .single()

      if (profileError) {
        console.error('Profile fetch error:', profileError)
        throw profileError
      }

      // Fetch customer bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', customerId)
        .order('booking_date', { ascending: false })

      if (bookingsError) {
        console.error('Bookings fetch error:', bookingsError)
      }

      // Fetch customer rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('rewards')
        .select('*')
        .eq('user_id', customerId)
        .single()

      if (rewardsError && rewardsError.code !== 'PGRST116') {
        console.error('Rewards fetch error:', rewardsError)
      }

      if (profileData) {
        const bookings = bookingsData || []
        const customerProfile: CustomerProfile = {
          ...profileData,
          total_spent: bookings.reduce((sum, b) => sum + (b.total_price || 0), 0),
          total_bookings: bookings.length,
          rewards_points: rewardsData?.points || 0,
          last_booking: bookings.length > 0 ? bookings[0].booking_date : null,
          status: bookings.length > 0 ? 'active' : 'inactive',
          bookings: bookings,
          rewards: {
            points: rewardsData?.points || 0,
            total_saved: rewardsData?.total_saved || 0
          }
        }

        console.log('Customer profile loaded:', customerProfile) // Debug log
        setSelectedCustomer(customerProfile)
        setIsProfileModalOpen(true)
      } else {
        throw new Error('No profile data found')
      }
    } catch (error) {
      console.error('Error fetching customer profile:', error)
      // Show error toast
      if (typeof window !== 'undefined') {
        alert('Error loading customer profile. Please try again.')
      }
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const getCustomerStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-500' : 'bg-gray-500'
  }

  const totalRevenue = customers.reduce((sum, c) => sum + c.total_spent, 0)
  const activeCustomers = customers.filter(c => c.status === 'active').length
  const averageSpent = customers.length > 0 ? totalRevenue / customers.length : 0

  // Debug function to test RLS policies
  async function debugFetchAllProfiles() {
    console.log('🔧 Debug: Fetching all profiles with different methods...')
    
    try {
      // Method 1: Normal query
      const { data: normalData, error: normalError } = await supabase
        .from('profiles')
        .select('*')
      
      console.log('📊 Normal query result:', { 
        count: normalData?.length || 0, 
        data: normalData,
        error: normalError 
      })

      // Method 2: Count query
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
      
      console.log('🔢 Count query result:', { count, error: countError })

      // Method 3: Check auth user
      const { data: { user: authUser } } = await supabase.auth.getUser()
      console.log('👤 Current auth user:', authUser)

    } catch (error) {
      console.error('🚨 Debug fetch error:', error)
    }
  }

  if (authLoading || isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header Section - Mobile-First Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Customer Management</h1>
          <p className="text-sm text-muted-foreground">Manage and view all customers</p>
        </div>
        
        {/* Action Buttons - Mobile Responsive */}
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
            onClick={() => debugFetchAllProfiles()}
            className="w-full sm:w-auto touch-target bg-muted hover:bg-muted/80"
          >
            Debug DB
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
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Export </span>Customers
          </Button>
        </div>
      </motion.div>

      {/* Enhanced Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 grid-cols-2 lg:grid-cols-4"
      >
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-500 rounded-full">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {customers.length}
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">Total Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-500 rounded-full">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-2xl font-bold text-green-700 dark:text-green-300">
                  {activeCustomers}
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-500 rounded-full">
                <CreditCard className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-2xl font-bold text-purple-700 dark:text-purple-300 truncate">
                  £{totalRevenue.toFixed(0)}
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400">Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-500 rounded-full">
                <Award className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-2xl font-bold text-orange-700 dark:text-orange-300 truncate">
                  £{averageSpent.toFixed(0)}
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400">Avg Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <div className="space-y-4">
              <CardTitle className="text-lg">All Customers</CardTitle>
              
              {/* Mobile-First Search and Filter Layout */}
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-w-[140px]"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="spent">Sort by Spent</option>
                    <option value="bookings">Sort by Bookings</option>
                    <option value="date">Sort by Join Date</option>
                  </select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {filteredCustomers.map((customer) => (
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
                          {customer.last_booking && (
                            <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                              Last: {format(new Date(customer.last_booking), 'MMM dd')}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => fetchCustomerProfile(customer.id)}
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
            
            {filteredCustomers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No customers found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search terms' : 'No customers have signed up yet'}
                </p>
              </div>
            )}
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
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Personal Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="text-sm">{selectedCustomer.full_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-sm flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{selectedCustomer.email}</span>
                      </p>
                    </div>
                    {selectedCustomer.phone && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Phone</label>
                        <p className="text-sm flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>{selectedCustomer.phone}</span>
                        </p>
                      </div>
                    )}
                    {selectedCustomer.address && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Address</label>
                        <p className="text-sm flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{selectedCustomer.address}</span>
                        </p>
                      </div>
                    )}
                    {selectedCustomer.postcode && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Postcode</label>
                        <p className="text-sm">{selectedCustomer.postcode}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <div className="flex items-center space-x-2">
                        <Badge className={getCustomerStatusColor(selectedCustomer.status)}>
                          {selectedCustomer.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                      <p className="text-sm">{format(new Date(selectedCustomer.created_at), 'PPP')}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Car className="h-5 w-5" />
                      <span>Vehicle Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedCustomer.vehicle_make ? (
                      <>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Make</label>
                          <p className="text-sm">{selectedCustomer.vehicle_make}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Model</label>
                          <p className="text-sm">{selectedCustomer.vehicle_model}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Color</label>
                          <p className="text-sm">{selectedCustomer.vehicle_color}</p>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">No vehicle information available</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="text-2xl font-bold">{selectedCustomer.total_bookings}</div>
                        <p className="text-xs text-muted-foreground">Total Bookings</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="text-2xl font-bold">£{selectedCustomer.total_spent.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Total Spent</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-purple-500" />
                      <div>
                        <div className="text-2xl font-bold">{selectedCustomer.rewards.points}</div>
                        <p className="text-xs text-muted-foreground">Reward Points</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCustomer.bookings.length > 0 ? (
                    <div className="space-y-3">
                      {selectedCustomer.bookings.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{booking.service_id}</span>
                              <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'}>
                                {booking.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(booking.booking_date), 'PPP')} at {booking.booking_time}
                            </p>
                            {booking.notes && (
                              <p className="text-sm text-muted-foreground">{booking.notes}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-medium">£{booking.total_price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No bookings found</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 