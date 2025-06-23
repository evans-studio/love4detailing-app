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
import { Calendar, Clock, MapPin, Star, Car, Gift, TrendingUp } from 'lucide-react'
import LoyaltyBadges from '@/components/loyalty/LoyaltyBadges'

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
  <div className="space-y-8">
    <Card>
      <CardHeader>
        <div className="h-6 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse" />
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
      case 'pending': return 'bg-yellow-500'
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
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.full_name}</h1>
          <p className="text-muted-foreground">Here's what's happening with your bookings</p>
        </div>
        <Button asChild size="lg">
          <Link href="/dashboard/book-service">
            <Car className="mr-2 h-4 w-4" />
            Book New Service
          </Link>
        </Button>
      </motion.div>

      {/* Loyalty Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Achievements</CardTitle>
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
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{dashboardData.upcomingBookings.length}</div>
                <p className="text-xs text-muted-foreground">Upcoming Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-2xl font-bold">£{dashboardData.totalSpent.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Gift className="h-4 w-4 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{dashboardData.rewardsPoints}</div>
                <p className="text-xs text-muted-foreground">Rewards Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{dashboardData.totalBookings}</div>
                <p className="text-xs text-muted-foreground">Total Services</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button asChild variant="outline" className="h-auto p-4">
                <Link href="/dashboard/book-service" className="flex flex-col items-center space-y-2">
                  <Car className="h-6 w-6" />
                  <span>Book Service</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4">
                <Link href="/dashboard/rewards" className="flex flex-col items-center space-y-2">
                  <Gift className="h-6 w-6" />
                  <span>View Rewards</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4">
                <Link href="/services" className="flex flex-col items-center space-y-2">
                  <Star className="h-6 w-6" />
                  <span>Our Services</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upcoming Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.upcomingBookings.length === 0 ? (
              <div className="text-center py-12">
                <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No upcoming bookings</h3>
                <p className="text-muted-foreground mb-4">Book your next car service to keep your vehicle in perfect condition</p>
                <Button asChild>
                  <Link href="/dashboard/book-service">Book Your Next Service</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.upcomingBookings.map((booking) => (
                  <Card key={booking.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium capitalize">{booking.service}</h3>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
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
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">£{booking.total_price.toFixed(2)}</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Bookings */}
      {dashboardData.pastBookings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.pastBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium capitalize">{booking.service}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.booking_date), 'PP')} • {booking.postcode}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">£{booking.total_price.toFixed(2)}</p>
                      <Badge variant="outline" className="text-xs">
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              {dashboardData.pastBookings.length > 3 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/bookings">View All Bookings</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
} 