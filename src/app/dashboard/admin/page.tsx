"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useAdminRoute } from '@/lib/auth'
import { supabase } from '@/lib/supabase/client'
import AdminControlPanel from '@/components/admin/AdminControlPanel'
import ApiUsageTracker from '@/components/admin/ApiUsageTracker'
import { format } from 'date-fns'
import Link from 'next/link'
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  CalendarDays,
  PoundSterling,
  BarChart3,
  Activity,
  Settings,
  MoreHorizontal
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
  upcomingBookings: number
}

const LoadingSkeleton = () => (
  <div className="space-y-6 sm:space-y-8">
    <Card className="bg-[#1E1E1E]/80 border-[#9747FF]/20">
      <CardHeader>
        <div className="h-6 bg-[#9747FF]/10 rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-[#1E1E1E]/80 border-[#9747FF]/20">
              <CardContent className="pt-6">
                <div className="h-8 bg-[#9747FF]/10 rounded animate-pulse mb-2" />
                <div className="h-4 bg-[#9747FF]/10 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
)

export default function AdminDashboard() {
  const { user, isLoading: authLoading, isAdmin } = useAdminRoute()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

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
        const processedBookings: Booking[] = bookingsData.map(booking => ({
          ...booking,
          customer_name: booking.profiles?.full_name || 'Unknown',
          customer_email: booking.profiles?.email || '',
          customer_phone: booking.profiles?.phone || '',
          upcomingBookings: 0
        }))

        setBookings(processedBookings)
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'confirmed': return 'text-blue-400'
      case 'pending': return 'text-yellow-400'
      case 'cancelled': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-[#141414]">
        <LoadingSkeleton />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 text-white">
        You do not have permission to view this page.
      </div>
    )
  }

  const filteredBookings = bookings.filter(booking => 
    statusFilter === 'all' || booking.status === statusFilter
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-[#141414] text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#F8F4EB]">Admin Dashboard</h1>
            <p className="text-sm text-[#C7C7C7]">Welcome back, {user?.email}</p>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/customers">
                <Users className="mr-2 h-4 w-4" />
                Manage Customers
              </Link>
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </header>

        <main>
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mb-4 bg-[#1E1E1E]/80 border border-[#9747FF]/20">
              <TabsTrigger 
                value="overview"
                className={cn(
                  "data-[state=active]:bg-[#9747FF]/10",
                  "data-[state=active]:text-[#F8F4EB]",
                  "touch-target min-h-[44px]"
                )}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="bookings"
                className={cn(
                  "data-[state=active]:bg-[#9747FF]/10",
                  "data-[state=active]:text-[#F8F4EB]",
                  "touch-target min-h-[44px]"
                )}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Bookings</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className={cn(
                  "data-[state=active]:bg-[#9747FF]/10",
                  "data-[state=active]:text-[#F8F4EB]",
                  "touch-target min-h-[44px]"
                )}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger 
                value="api"
                className={cn(
                  "data-[state=active]:bg-[#9747FF]/10",
                  "data-[state=active]:text-[#F8F4EB]",
                  "touch-target min-h-[44px]"
                )}
              >
                <Activity className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">API Usage</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <AdminControlPanel />
            </TabsContent>

            <TabsContent value="bookings">
              <Card className="bg-[#1E1E1E]/80 border-[#9747FF]/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-[#F8F4EB]">Manage Bookings</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px] bg-[#141414] border-[#9747FF]/30">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1E1E1E] text-white border-[#9747FF]/30">
                        <SelectItem value="all">All Statuses</SelectItem>
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
                    {filteredBookings.map((booking) => (
                      <div 
                        key={booking.id}
                        className={cn(
                          "block relative p-4 rounded-lg",
                          "border-2 border-[#9747FF]/20",
                          "bg-[#1E1E1E]/50",
                          "transition-all duration-200",
                          "touch-target min-h-[88px]"
                        )}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-[#F8F4EB] font-medium">{booking.service}</h3>
                            <p className="text-sm text-[#C7C7C7]">{booking.customer_name}</p>
                            <div className="flex items-center gap-4 text-xs text-[#9b9b9b] mt-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{format(new Date(booking.booking_date), 'PP')} at {booking.booking_time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-lg font-bold text-[#9747FF]">
                                <PoundSterling className="inline h-4 w-4 -mt-1" />
                                {booking.total_price.toFixed(2)}
                              </div>
                              <Badge 
                                className={cn(
                                  "text-xs mt-1",
                                  getStatusColor(booking.status),
                                  "bg-opacity-20 border border-current"
                                )}
                              >
                                {booking.status}
                              </Badge>
                            </div>
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </SheetTrigger>
                              <SheetContent className="bg-[#1E1E1E] text-white border-l border-l-[#9747FF]/30">
                                <SheetHeader>
                                  <SheetTitle>Booking Details</SheetTitle>
                                </SheetHeader>
                                {/* ... Booking details content ... */}
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

            <TabsContent value="analytics">
              {/* Analytics components will go here */}
            </TabsContent>
            
            <TabsContent value="api">
              <ApiUsageTracker />
            </TabsContent>
          </Tabs>
        </main>
      </motion.div>
    </div>
  )
} 