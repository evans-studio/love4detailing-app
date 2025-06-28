'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabase/client'
import { useProtectedRoute } from '@/lib/auth'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { Calendar, Car, CreditCard, Star } from 'lucide-react'

interface DashboardData {
  recentBookings: any[]
  totalBookings: number
  totalSpent: number
  rewardPoints: number
  nextRewardThreshold: number
}

export function DashboardClient() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useProtectedRoute()
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    recentBookings: [],
    totalBookings: 0,
    totalSpent: 0,
    rewardPoints: 0,
    nextRewardThreshold: 1000
  })
  const [isLoading, setIsLoading] = useState(true)

  const fetchDashboardData = useCallback(async () => {
    if (!user) return

    try {
      // Fetch bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false })
        .limit(3)

      if (bookingsError) throw bookingsError

      // Fetch rewards
      const { data: rewards, error: rewardsError } = await supabase
        .from('rewards')
        .select('points')
        .eq('user_id', user.id)
        .single()

      if (rewardsError && rewardsError.code !== 'PGRST116') throw rewardsError

      // Calculate totals
      const totalSpent = bookings?.reduce((sum, booking) => sum + (booking.total_price || 0), 0) || 0
      const rewardPoints = rewards?.points || 0

      setDashboardData({
        recentBookings: bookings || [],
        totalBookings: bookings?.length || 0,
        totalSpent,
        rewardPoints,
        nextRewardThreshold: Math.ceil((rewardPoints + 1) / 1000) * 1000
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user && !authLoading) {
      fetchDashboardData()
    }
  }, [user, authLoading, fetchDashboardData])

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9747FF]" />
      </div>
    )
  }

  const progressToNextReward = (dashboardData.rewardPoints % 1000) / 10

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>
                  {user?.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">Welcome back, {user?.user_metadata?.full_name}</h2>
                <p className="text-muted-foreground">Here's what's happening with your account</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime bookings
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(dashboardData.totalSpent)}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime spending
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reward Points</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.rewardPoints}</div>
              <div className="mt-2 space-y-1">
                <Progress value={progressToNextReward} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {1000 - (dashboardData.rewardPoints % 1000)} points to next reward
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentBookings.map(booking => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-[#9747FF]" />
                            <span>{formatDate(booking.booking_date)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Car className="h-4 w-4 text-[#9747FF]" />
                            <span>{booking.vehicle_details}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                          <p className="mt-2 font-semibold">{formatCurrency(booking.total_price)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              {dashboardData.recentBookings.length > 0 && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/dashboard/bookings')}
                >
                  View All Bookings
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 