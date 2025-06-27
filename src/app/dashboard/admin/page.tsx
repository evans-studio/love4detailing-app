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
  Activity,
  ChevronRight,
  User
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
  <div className="space-y-6 sm:space-y-8">
    <Card className="bg-[#1E1E1E]/80 border-[#8A2B85]/20">
      <CardHeader>
        <div className="h-6 bg-[#8A2B85]/10 rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-[#1E1E1E]/80 border-[#8A2B85]/20">
              <CardContent className="pt-6">
                <div className="h-8 bg-[#8A2B85]/10 rounded animate-pulse mb-2" />
                <div className="h-4 bg-[#8A2B85]/10 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
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
    <div className="space-y-6 sm:space-y-8 w-full max-w-[100vw] overflow-x-hidden px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F8F4EB]">Admin Dashboard</h1>
          <p className="text-[#C7C7C7] text-sm sm:text-base">Manage your business operations</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className={cn(
              "border-[#9747FF]/20 text-[#C7C7C7]",
              "hover:bg-[#9747FF]/10 hover:text-[#F8F4EB]",
              "touch-target min-h-[44px]"
            )}
            onClick={() => {/* Export data */}}
          >
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Export Data</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button
            className={cn(
              "bg-[#9747FF] hover:bg-[#9747FF]/90",
              "text-[#F8F4EB]",
              "touch-target min-h-[44px]"
            )}
            onClick={() => {/* Open settings */}}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">Settings</span>
          </Button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 grid-cols-2 lg:grid-cols-4"
      >
        <Card className="bg-[#1E1E1E]/80 border-[#8A2B85]/20 backdrop-blur-sm touch-target min-h-[88px]">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-[#F8F4EB]">{stats.todayBookings}</div>
                <p className="text-xs text-[#C7C7C7]">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1E1E1E]/80 border-[#8A2B85]/20 backdrop-blur-sm touch-target min-h-[88px]">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-[#F8F4EB]">£{stats.monthlyRevenue}</div>
                <p className="text-xs text-[#C7C7C7]">Monthly</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1E1E1E]/80 border-[#8A2B85]/20 backdrop-blur-sm touch-target min-h-[88px]">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-[#8A2B85]" />
              <div>
                <div className="text-2xl font-bold text-[#F8F4EB]">{stats.totalCustomers}</div>
                <p className="text-xs text-[#C7C7C7]">Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1E1E1E]/80 border-[#8A2B85]/20 backdrop-blur-sm touch-target min-h-[88px]">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold text-[#F8F4EB]">{stats.upcomingBookings}</div>
                <p className="text-xs text-[#C7C7C7]">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="bg-[#1E1E1E]/80 border-[#8A2B85]/20 mb-6">
            <TabsTrigger 
              value="bookings"
              className={cn(
                "data-[state=active]:bg-[#8A2B85]/10",
                "data-[state=active]:text-[#F8F4EB]",
                "touch-target min-h-[44px]"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Bookings</span>
              <span className="sm:hidden">Book</span>
            </TabsTrigger>
            <TabsTrigger 
              value="customers"
              className={cn(
                "data-[state=active]:bg-[#8A2B85]/10",
                "data-[state=active]:text-[#F8F4EB]",
                "touch-target min-h-[44px]"
              )}
            >
              <Users className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Customers</span>
              <span className="sm:hidden">Users</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className={cn(
                "data-[state=active]:bg-[#8A2B85]/10",
                "data-[state=active]:text-[#F8F4EB]",
                "touch-target min-h-[44px]"
              )}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card className="bg-[#1E1E1E]/80 border-[#8A2B85]/20 backdrop-blur-sm">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-lg text-[#F8F4EB]">Recent Bookings</CardTitle>
                <div className="flex items-center gap-2">
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger 
                      className={cn(
                        "bg-[#1E1E1E]/50 border-[#8A2B85]/20",
                        "text-[#F8F4EB]",
                        "h-11 touch-target"
                      )}
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E1E1E] border-[#8A2B85]/20">
                      <SelectItem value="all">All Bookings</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings
                    .filter(booking => statusFilter === 'all' || booking.status === statusFilter)
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className={cn(
                          "block relative p-4 rounded-lg",
                          "border-2 border-[#8A2B85]/20",
                          "bg-[#1E1E1E]/50",
                          "transition-all duration-200",
                          "touch-target min-h-[88px]"
                        )}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge className={cn(
                                "text-xs",
                                getStatusColor(booking.status),
                                booking.status === 'pending' ? 'text-[#1E1E1E]' : 'text-[#F8F4EB]'
                              )}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                              <h3 className="text-[#F8F4EB] font-medium">{booking.service}</h3>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-[#C7C7C7]">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{format(new Date(booking.booking_date), 'EEE, MMM d')}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{booking.booking_time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{booking.postcode}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{booking.customer_name}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-bold text-[#8A2B85]">£{booking.total_price}</span>
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className={cn(
                                    "border-[#8A2B85]/20",
                                    "hover:bg-[#8A2B85]/10",
                                    "touch-target min-h-[44px] min-w-[44px]"
                                  )}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </SheetTrigger>
                              <SheetContent className="bg-[#1E1E1E] border-[#8A2B85]/20">
                                <SheetHeader>
                                  <SheetTitle className="text-[#F8F4EB]">Booking Details</SheetTitle>
                                </SheetHeader>
                                <div className="mt-6 space-y-6">
                                  {/* Booking details content */}
                                </div>
                              </SheetContent>
                            </Sheet>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <Card className="bg-[#1E1E1E]/80 border-[#8A2B85]/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-[#F8F4EB]">Customer List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customers.map((customer) => (
                    <div
                      key={customer.id}
                      className={cn(
                        "block relative p-4 rounded-lg",
                        "border-2 border-[#8A2B85]/20",
                        "bg-[#1E1E1E]/50",
                        "transition-all duration-200",
                        "touch-target min-h-[88px]",
                        "cursor-pointer hover:bg-[#1E1E1E]/70"
                      )}
                      onClick={() => fetchCustomerProfile(customer.id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={customer.profile_image_url} />
                            <AvatarFallback className="bg-[#8A2B85]/10 text-[#8A2B85]">
                              {customer.full_name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-[#F8F4EB] font-medium">{customer.full_name}</h3>
                            <div className="flex items-center gap-4 text-sm text-[#C7C7C7]">
                              <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                <span>{customer.email}</span>
                              </div>
                              {customer.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-4 w-4" />
                                  <span>{customer.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-lg font-bold text-[#8A2B85]">£{customer.total_spent}</div>
                            <p className="text-xs text-[#C7C7C7]">{customer.total_bookings} bookings</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-[#C7C7C7]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-[#1E1E1E]/80 border-[#8A2B85]/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-[#F8F4EB]">Business Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                  <Card className="bg-[#1E1E1E]/50 border-[#8A2B85]/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <PoundSterling className="h-4 w-4 text-green-500" />
                        <div>
                          <div className="text-2xl font-bold text-[#F8F4EB]">£{stats.totalRevenue}</div>
                          <p className="text-xs text-[#C7C7C7]">Total Revenue</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#1E1E1E]/50 border-[#8A2B85]/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-blue-500" />
                        <div>
                          <div className="text-2xl font-bold text-[#F8F4EB]">{stats.weeklyBookings}</div>
                          <p className="text-xs text-[#C7C7C7]">Weekly Bookings</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#1E1E1E]/50 border-[#8A2B85]/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-[#8A2B85]" />
                        <div>
                          <div className="text-2xl font-bold text-[#F8F4EB]">{stats.newCustomersThisMonth}</div>
                          <p className="text-xs text-[#C7C7C7]">New Customers</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#1E1E1E]/50 border-[#8A2B85]/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <div>
                          <div className="text-2xl font-bold text-[#F8F4EB]">£{stats.averageBookingValue}</div>
                          <p className="text-xs text-[#C7C7C7]">Avg. Booking</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8">
                  <ApiUsageTracker />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Customer Profile Modal */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="bg-[#1E1E1E] border-[#8A2B85]/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#F8F4EB]">Customer Profile</DialogTitle>
          </DialogHeader>
          {isLoadingProfile ? (
            <div className="py-8">
              <LoadingSkeleton />
            </div>
          ) : selectedCustomer && (
            <ScrollArea className="h-[80vh] pr-4">
              {/* Customer profile content */}
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 