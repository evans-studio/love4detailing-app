"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { useProtectedRoute } from '@/lib/auth'
import { supabase } from '@/lib/supabase/client'
import { format } from 'date-fns'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Star, Car, Gift, TrendingUp, User, ChevronRight } from 'lucide-react'
import LoyaltyBadges from '@/components/loyalty/LoyaltyBadges'
import { cn } from '@/lib/utils'

interface Booking {
  id: string
  booking_date: string
  booking_time: string
  service: string
  total_price: number
  status: string
  vehicle_images: string[]
  postcode: string
  notes?: string
}

interface DashboardData {
  upcomingBookings: Booking[]
  pastBookings: Booking[]
  totalSpent: number
  rewardsPoints: number
  vehicleImages: string[]
  totalBookings: number
}

const LoadingSkeleton = () => (
  <div className="space-y-6 sm:space-y-8">
    <Card className="bg-[#1E1E1E]/80 border-[#8A2B85]/20">
      <CardHeader>
        <div className="h-6 bg-[#8A2B85]/10 rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

export default function CustomerDashboard() {
  const { user, isLoading: authLoading } = useProtectedRoute()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    upcomingBookings: [],
    pastBookings: [],
    totalSpent: 0,
    rewardsPoints: 0,
    vehicleImages: [],
    totalBookings: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is admin and redirect
  useEffect(() => {
    if (user && !authLoading) {
      const isAdmin = user.email === 'd.dimpauls@gmail.com'
      if (isAdmin) {
        router.push('/dashboard/admin')
        return
      }
      fetchDashboardData()
    }
  }, [user, authLoading, router])

  async function fetchDashboardData() {
    try {
      // Fetch bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user?.id)
        .order('booking_date', { ascending: true })

      if (bookings) {
        const now = new Date()
        const upcoming = bookings.filter(b => new Date(b.booking_date) >= now)
        const past = bookings.filter(b => new Date(b.booking_date) < now)
        const totalSpent = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
        const allImages = bookings.flatMap(b => b.vehicle_images || [])

        // Fetch rewards points
        const { data: rewards } = await supabase
          .from('rewards')
          .select('points, total_saved')
          .eq('user_id', user?.id)
          .single()

        setDashboardData({
          upcomingBookings: upcoming,
          pastBookings: past,
          totalSpent,
          rewardsPoints: rewards?.points || 0,
          vehicleImages: allImages,
          totalBookings: bookings.length
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500'
      case 'pending': return 'bg-[#F8F4EB]'
      case 'completed': return 'bg-blue-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  if (authLoading || isLoading) {
    return <LoadingSkeleton />
  }

  // Don't render anything if redirecting to admin
  if (user && user.email === 'd.dimpauls@gmail.com') {
    return <LoadingSkeleton />
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
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F8F4EB]">
            Welcome back, {(user as any)?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
          </h1>
          <p className="text-[#C7C7C7] text-sm sm:text-base">Here's what's happening with your bookings</p>
        </div>
        <Button asChild size="lg" className="bg-[#8A2B85] hover:bg-[#8A2B85]/90 text-[#F8F4EB] touch-target min-h-[44px]">
          <Link href="/dashboard/book-service">
            <Car className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Book New Service</span>
            <span className="sm:hidden">Book Service</span>
          </Link>
        </Button>
      </motion.div>

      {/* Loyalty Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <Card className="bg-[#1E1E1E]/80 border-[#8A2B85]/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-[#F8F4EB]">Your Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <LoyaltyBadges compact={true} showProgress={false} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
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
                <div className="text-2xl font-bold text-[#F8F4EB]">{dashboardData.upcomingBookings.length}</div>
                <p className="text-xs text-[#C7C7C7]">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1E1E1E]/80 border-[#8A2B85]/20 backdrop-blur-sm touch-target min-h-[88px]">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-[#F8F4EB]">£{dashboardData.totalSpent}</div>
                <p className="text-xs text-[#C7C7C7]">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1E1E1E]/80 border-[#8A2B85]/20 backdrop-blur-sm touch-target min-h-[88px]">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Gift className="h-4 w-4 text-[#8A2B85]" />
              <div>
                <div className="text-2xl font-bold text-[#F8F4EB]">{dashboardData.rewardsPoints}</div>
                <p className="text-xs text-[#C7C7C7]">Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1E1E1E]/80 border-[#8A2B85]/20 backdrop-blur-sm touch-target min-h-[88px]">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold text-[#F8F4EB]">{dashboardData.totalBookings}</div>
                <p className="text-xs text-[#C7C7C7]">Services</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upcoming Bookings */}
      {dashboardData.upcomingBookings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-[#1E1E1E]/80 border-[#8A2B85]/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg text-[#F8F4EB]">Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.upcomingBookings.map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/dashboard/bookings/${booking.id}`}
                    className={cn(
                      "block relative p-4 rounded-lg",
                      "border-2 border-[#8A2B85]/20",
                      "bg-[#1E1E1E]/50 hover:bg-[#1E1E1E]/70",
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
                        <div className="flex items-center gap-4 text-sm text-[#C7C7C7]">
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
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-[#8A2B85]">£{booking.total_price}</span>
                        <ChevronRight className="h-4 w-4 text-[#C7C7C7]" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Past Bookings */}
      {dashboardData.pastBookings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-[#1E1E1E]/80 border-[#8A2B85]/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg text-[#F8F4EB]">Past Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.pastBookings.slice(0, 5).map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/dashboard/bookings/${booking.id}`}
                    className={cn(
                      "block relative p-4 rounded-lg",
                      "border-2 border-[#8A2B85]/20",
                      "bg-[#1E1E1E]/50 hover:bg-[#1E1E1E]/70",
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
                        <div className="flex items-center gap-4 text-sm text-[#C7C7C7]">
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
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-[#8A2B85]">£{booking.total_price}</span>
                        <ChevronRight className="h-4 w-4 text-[#C7C7C7]" />
                      </div>
                    </div>
                  </Link>
                ))}
                {dashboardData.pastBookings.length > 5 && (
                  <Button
                    asChild
                    variant="outline"
                    className={cn(
                      "w-full border-[#8A2B85]/20 text-[#C7C7C7]",
                      "hover:bg-[#8A2B85]/10 hover:text-[#F8F4EB]",
                      "touch-target min-h-[44px]"
                    )}
                  >
                    <Link href="/dashboard/bookings">
                      View All Bookings
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
} 