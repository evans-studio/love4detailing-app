'use client'

import { useEffect, useCallback, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { motion } from 'framer-motion'
import { useProtectedRoute } from '@/lib/auth'
import { supabase } from '@/lib/supabase/client'
import type { DashboardData } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { Calendar, Car, CreditCard, Star } from 'lucide-react'

interface UserMetadata {
  avatar_url?: string
  full_name?: string
}

export function DashboardClient() {
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
  const userMetadata = user?.user_metadata as UserMetadata | undefined

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
                <AvatarImage src={userMetadata?.avatar_url} />
                <AvatarFallback>
                  {userMetadata?.full_name?.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">Welcome back, {userMetadata?.full_name}</h2>
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
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{booking.service_type}</p>
                      <p className="text-sm text-muted-foreground">{booking.vehicle}</p>
                    </div>
                    <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'}>
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    {formatDate(booking.created_at)}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 