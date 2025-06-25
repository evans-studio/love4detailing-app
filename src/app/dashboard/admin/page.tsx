"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useProtectedRoute } from '@/lib/auth'
import { supabase } from '@/lib/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import AdminControlPanel from '@/components/admin/AdminControlPanel'
import ApiUsageTracker from '@/components/admin/ApiUsageTracker'
import { format, isToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import Link from 'next/link'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Car, 
  Users, 
  TrendingUp, 
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  Filter,
  Download,
  Eye,
  UserCheck,
  CalendarDays,
  PoundSterling,
  Award,
  MoreHorizontal,
  Settings,
  BarChart3,
  Activity
} from 'lucide-react'

interface Booking {
  id: string
  booking_date: string
  booking_time: string
  service: string
  total_price: number
  status: string
  postcode: string
  notes?: string
  customer_name: string
  customer_email: string
  customer_phone: string
  vehicle_images: string[]
  created_at: string
  vehicle_size?: string
  add_ons?: string[]
}

interface Customer {
  id: string
  full_name: string
  email: string
  phone?: string
  profile_image_url?: string
  vehicle_photos?: string[]
  total_spent: number
  total_bookings: number
  rewards_points: number
  last_booking: string
  created_at: string
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

interface AdminStats {
  totalBookings: number
  totalRevenue: number
  totalCustomers: number
  pendingBookings: number
  completedBookings: number
  todayBookings: number
  weeklyBookings: number
  monthlyRevenue: number
  weeklyRevenue: number
  averageBookingValue: number
  newCustomersThisMonth: number
  upcomingBookings: number
}

const LoadingSkeleton = () => (
  <div className="space-y-8">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-6">
            <div className="h-8 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useProtectedRoute()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [stats, setStats] = useState<AdminStats>({
    totalBookings: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingBookings: 0,
    completedBookings: 0,
    todayBookings: 0,
    weeklyBookings: 0,
    monthlyRevenue: 0,
    weeklyRevenue: 0,
    averageBookingValue: 0,
    newCustomersThisMonth: 0,
    upcomingBookings: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)

  useEffect(() => {
    if (user) {
      fetchAdminData()
    }
  }, [user])

  async function fetchAdminData() {
    try {
      // Fetch all bookings with customer info
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email,
            phone
          )
        `)
        .order('booking_date', { ascending: false })

      // Fetch customer statistics
      const { data: customersData } = await supabase
        .from('profiles')
        .select('*')

      if (bookingsData && customersData) {
        // Process bookings data
        const processedBookings = bookingsData.map(booking => ({
          ...booking,
          customer_name: booking.profiles?.full_name || 'Unknown',
          customer_email: booking.profiles?.email || '',
          customer_phone: booking.profiles?.phone || ''
        }))

        // Fetch rewards data for all customers
        const { data: rewardsData, error: rewardsError } = await supabase
          .from('rewards')
          .select('user_id, points')

        if (rewardsError) {
          console.error('Error fetching rewards data:', rewardsError)
        }

        // Create a map for quick rewards lookup
        const rewardsMap = new Map()
        rewardsData?.forEach(reward => {
          rewardsMap.set(reward.user_id, reward.points || 0)
        })

        // Calculate customer stats
        const customerStats = customersData.map(customer => {
          const customerBookings = bookingsData.filter(b => b.user_id === customer.id)
          const totalSpent = customerBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
          const lastBooking = customerBookings.length > 0 
            ? customerBookings.sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime())[0].booking_date
            : null

          return {
            id: customer.id,
            full_name: customer.full_name || 'Unknown',
            email: customer.email,
            phone: customer.phone,
            total_spent: totalSpent,
            total_bookings: customerBookings.length,
            rewards_points: rewardsMap.get(customer.id) || 0,
            last_booking: lastBooking,
            created_at: customer.created_at
          }
        })

        // Calculate admin stats
        const now = new Date()
        const today = now.toISOString().split('T')[0]
        const weekStart = startOfWeek(now)
        const weekEnd = endOfWeek(now)
        const monthStart = startOfMonth(now)
        const monthEnd = endOfMonth(now)
        
        const todayBookings = bookingsData.filter(b => b.booking_date === today).length
        const weeklyBookings = bookingsData.filter(b => {
          const bookingDate = new Date(b.booking_date)
          return bookingDate >= weekStart && bookingDate <= weekEnd
        })
        const monthlyBookings = bookingsData.filter(b => {
          const bookingDate = new Date(b.booking_date)
          return bookingDate >= monthStart && bookingDate <= monthEnd
        })
        const upcomingBookings = bookingsData.filter(b => new Date(b.booking_date) >= now)
        const newCustomersThisMonth = customersData.filter(c => {
          const createdDate = new Date(c.created_at)
          return createdDate >= monthStart && createdDate <= monthEnd
        }).length
        
        const totalRevenue = bookingsData.reduce((sum, b) => sum + (b.total_price || 0), 0)
        const monthlyRevenue = monthlyBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
        const weeklyRevenue = weeklyBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
        const pendingBookings = bookingsData.filter(b => b.status === 'pending').length
        const completedBookings = bookingsData.filter(b => b.status === 'completed').length

        setBookings(processedBookings)
        setCustomers(customerStats)
        setStats({
          totalBookings: bookingsData.length,
          totalRevenue,
          totalCustomers: customersData.length,
          pendingBookings,
          completedBookings,
          todayBookings,
          weeklyBookings: weeklyBookings.length,
          monthlyRevenue,
          weeklyRevenue,
          averageBookingValue: bookingsData.length > 0 ? totalRevenue / bookingsData.length : 0,
          newCustomersThisMonth,
          upcomingBookings: upcomingBookings.length
        })
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchCustomerProfile(customerId: string) {
    setIsLoadingProfile(true)
    console.log('Fetching profile for customer:', customerId)
    
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
          bookings: bookings,
          rewards: {
            points: rewardsData?.points || 0,
            total_saved: rewardsData?.total_saved || 0
          }
        }

        console.log('Customer profile loaded:', customerProfile)
        setSelectedCustomer(customerProfile)
        setIsProfileModalOpen(true)
      } else {
        throw new Error('No profile data found')
      }
    } catch (error) {
      console.error('Error fetching customer profile:', error)
      if (typeof window !== 'undefined') {
        alert('Error loading customer profile. Please try again.')
      }
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500'
      case 'pending': return 'bg-platinum-silver'
      case 'completed': return 'bg-blue-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <AlertCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)

      if (!error) {
        // Refresh data
        fetchAdminData()
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
    }
  }

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === statusFilter)

  // Get upcoming bookings for today and next few days
  const upcomingBookings = bookings
    .filter(b => new Date(b.booking_date) >= new Date())
    .sort((a, b) => new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime())
    .slice(0, 5)

  // Get recent customers (last 30 days)
  const recentCustomers = customers
    .filter(c => {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return new Date(c.created_at) >= thirtyDaysAgo
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  if (authLoading || isLoading) {
    return <LoadingSkeleton />
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header Section - Improved Mobile Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
      >
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {user?.full_name || 'Admin'} - Here's your business overview
          </p>
        </div>
        
        {/* Mobile-First Action Buttons */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto touch-target" asChild>
            <Link href="/dashboard/admin/customers">
              <Users className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Manage </span>Customers
            </Link>
          </Button>
          <Button size="sm" className="w-full sm:w-auto touch-target" asChild>
            <Link href="/dashboard/book-service">
              <Calendar className="mr-2 h-4 w-4" />
              New Booking
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Enhanced Stats Grid with Better Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 grid-cols-2 lg:grid-cols-4"
      >
        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-500 rounded-full">
                <PoundSterling className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-2xl font-bold text-green-700 dark:text-green-300 truncate">
                  £{stats.totalRevenue.toFixed(0)}
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-500 rounded-full">
                <CalendarDays className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {stats.totalBookings}
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">Total Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-500 rounded-full">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {stats.totalCustomers}
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400">Total Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-500 rounded-full">
                <AlertCircle className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-2xl font-bold text-orange-700 dark:text-orange-300">
                  {stats.pendingBookings}
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Secondary Stats - Improved Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid gap-4 grid-cols-2 lg:grid-cols-4"
      >
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-base sm:text-xl font-bold">{stats.todayBookings}</div>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-base sm:text-xl font-bold">£{stats.monthlyRevenue.toFixed(0)}</div>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-purple-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-base sm:text-xl font-bold">£{stats.averageBookingValue.toFixed(0)}</div>
                <p className="text-xs text-muted-foreground">Avg Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-indigo-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-base sm:text-xl font-bold">{stats.upcomingBookings}</div>
                <p className="text-xs text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Tabs with Better Mobile Experience */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-6"
      >
        <Tabs defaultValue="overview" className="space-y-6">
          {/* Mobile-Optimized Tabs */}
          <div className="w-full">
            <ScrollArea className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50">
                <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-background">
                  <Activity className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="bookings" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-background">
                  <Calendar className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Bookings</span>
                  <span className="sm:hidden">({stats.totalBookings})</span>
                  <span className="hidden sm:inline"> ({stats.totalBookings})</span>
                </TabsTrigger>
                <TabsTrigger value="customers" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-background">
                  <Users className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Customers</span>
                  <span className="sm:hidden">({stats.totalCustomers})</span>
                  <span className="hidden sm:inline"> ({stats.totalCustomers})</span>
                </TabsTrigger>
                <TabsTrigger value="controls" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-background">
                  <Settings className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Controls</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-background">
                  <BarChart3 className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
              </TabsList>
            </ScrollArea>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* API Usage Tracker */}
            <ApiUsageTracker />
            
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Upcoming Bookings - Enhanced Card */}
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-md">
                      <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    Upcoming Bookings
                    <Badge variant="secondary" className="ml-auto">
                      {bookings.filter(booking => 
                        new Date(booking.booking_date) >= new Date() && 
                        ['pending', 'confirmed'].includes(booking.status)
                      ).length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-3">
                      {bookings
                        .filter(booking => 
                          new Date(booking.booking_date) >= new Date() && 
                          ['pending', 'confirmed'].includes(booking.status)
                        )
                        .sort((a, b) => new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime())
                        .slice(0, 5).length === 0 ? (
                        <div className="text-center py-8">
                          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground">No upcoming bookings</p>
                        </div>
                      ) : (
                        bookings
                          .filter(booking => 
                            new Date(booking.booking_date) >= new Date() && 
                            ['pending', 'confirmed'].includes(booking.status)
                          )
                          .sort((a, b) => new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime())
                          .slice(0, 5)
                          .map((booking) => (
                          <div key={booking.id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={`${getStatusColor(booking.status)} text-white text-xs`}>
                                  {booking.status}
                                </Badge>
                                <span className="font-medium text-sm truncate">{booking.customer_name}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {format(new Date(booking.booking_date), 'MMM dd, yyyy')} at {booking.booking_time}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {booking.service} - £{booking.total_price}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="ml-2 h-8 px-2 text-xs touch-target-sm"
                              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              disabled={booking.status === 'confirmed' || booking.status === 'completed'}
                            >
                              Confirm
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Recent Customers - Enhanced Card */}
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-1.5 bg-purple-100 dark:bg-purple-900 rounded-md">
                      <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    Recent Customers
                    <Badge variant="secondary" className="ml-auto">
                      {customers.slice(0, 5).length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-3">
                      {customers.slice(0, 5).length === 0 ? (
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground">No customers yet</p>
                        </div>
                      ) : (
                        customers
                          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                          .slice(0, 5)
                          .map((customer) => (
                          <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <Avatar className="w-10 h-10 flex-shrink-0">
                                <AvatarImage src={customer.profile_image_url} alt={customer.full_name} />
                                <AvatarFallback className="text-xs">
                                  {customer.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{customer.full_name}</div>
                                <div className="text-xs text-muted-foreground truncate">{customer.email}</div>
                                <div className="text-xs text-muted-foreground">
                                  {customer.total_bookings} booking{customer.total_bookings !== 1 ? 's' : ''} • £{customer.total_spent.toFixed(2)}
                                </div>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="ml-2 h-8 px-2 text-xs touch-target-sm"
                              onClick={() => fetchCustomerProfile(customer.id)}
                              disabled={isLoadingProfile}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            {/* Booking Filters */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Bookings</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <select 
                      value={statusFilter} 
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <Card key={booking.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium capitalize">{booking.service}</h3>
                              <Badge className={getStatusColor(booking.status)}>
                                {getStatusIcon(booking.status)}
                                <span className="ml-1">{booking.status}</span>
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{format(new Date(booking.booking_date), 'PPP')}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{booking.booking_time}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{booking.postcode}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4" />
                                <span>{booking.customer_name}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Mail className="h-4 w-4" />
                                <span>{booking.customer_email}</span>
                              </div>
                              {booking.customer_phone && (
                                <div className="flex items-center space-x-1">
                                  <Phone className="h-4 w-4" />
                                  <span>{booking.customer_phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <p className="text-lg font-bold">£{booking.total_price.toFixed(2)}</p>
                            <div className="flex space-x-1">
                              {booking.status === 'pending' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                >
                                  Confirm
                                </Button>
                              )}
                              {booking.status === 'confirmed' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => updateBookingStatus(booking.id, 'completed')}
                                >
                                  Complete
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customers.map((customer) => (
                    <Card key={customer.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h3 className="font-medium">{customer.full_name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Mail className="h-4 w-4" />
                                <span>{customer.email}</span>
                              </div>
                              {customer.phone && (
                                <div className="flex items-center space-x-1">
                                  <Phone className="h-4 w-4" />
                                  <span>{customer.phone}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                              <span>{customer.total_bookings} bookings</span>
                              <span>£{customer.total_spent.toFixed(2)} spent</span>
                              {customer.last_booking && (
                                <span>Last: {format(new Date(customer.last_booking), 'PP')}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => fetchCustomerProfile(customer.id)}
                              disabled={isLoadingProfile}
                            >
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="controls" className="space-y-4">
            <div className="relative z-10">
              <AdminControlPanel />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Revenue</span>
                      <span className="font-bold">£{stats.totalRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Revenue</span>
                      <span className="font-bold">£{stats.monthlyRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Booking</span>
                      <span className="font-bold">£{stats.averageBookingValue.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Bookings</span>
                      <span className="font-bold">{stats.totalBookings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed</span>
                      <span className="font-bold">{stats.completedBookings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending</span>
                      <span className="font-bold">{stats.pendingBookings}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Customer Profile Modal */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer Profile
            </DialogTitle>
          </DialogHeader>
          
          {isLoadingProfile ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : selectedCustomer ? (
            <div className="space-y-6">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="font-medium">{selectedCustomer.full_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="font-medium">{selectedCustomer.email}</p>
                    </div>
                    {selectedCustomer.phone && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Phone</label>
                        <p className="font-medium">{selectedCustomer.phone}</p>
                      </div>
                    )}
                    {selectedCustomer.address && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Address</label>
                        <p className="font-medium">{selectedCustomer.address}</p>
                      </div>
                    )}
                    {selectedCustomer.postcode && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Postcode</label>
                        <p className="font-medium">{selectedCustomer.postcode}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Customer Since</label>
                      <p className="font-medium">{format(new Date(selectedCustomer.created_at), 'PPP')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Info */}
              {(selectedCustomer.vehicle_make || selectedCustomer.vehicle_model) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      Vehicle Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      {selectedCustomer.vehicle_make && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Make</label>
                          <p className="font-medium">{selectedCustomer.vehicle_make}</p>
                        </div>
                      )}
                      {selectedCustomer.vehicle_model && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Model</label>
                          <p className="font-medium">{selectedCustomer.vehicle_model}</p>
                        </div>
                      )}
                      {selectedCustomer.vehicle_color && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Color</label>
                          <p className="font-medium">{selectedCustomer.vehicle_color}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <CalendarDays className="h-4 w-4 text-blue-500" />
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
                      <PoundSterling className="h-4 w-4 text-green-500" />
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
                        <div className="text-2xl font-bold">{selectedCustomer.rewards_points}</div>
                        <p className="text-xs text-muted-foreground">Reward Points</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Booking History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Booking History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCustomer.bookings.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No bookings found</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedCustomer.bookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{booking.service}</div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(booking.booking_date), 'PPP')} at {booking.booking_time}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">£{booking.total_price.toFixed(2)}</div>
                            <Badge variant="outline" className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
} 