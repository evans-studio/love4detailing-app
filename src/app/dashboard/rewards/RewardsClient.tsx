'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { useProtectedRoute } from '@/lib/auth'
import { supabase } from '@/lib/supabase/client'
import { Award, Gift, Star, Clock, Lock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Reward {
  id: string
  name: string
  description: string
  points_required: number
  discount_amount: number
  expiry_days: number
  is_available: boolean
}

interface UserRewards {
  total_points: number
  points_used: number
  points_available: number
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  next_tier_points: number
  rewards_claimed: number
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
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

const TIER_THRESHOLDS = {
  Bronze: 0,
  Silver: 1000,
  Gold: 2500,
  Platinum: 5000
}

const TIER_COLORS = {
  Bronze: 'from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900',
  Silver: 'from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900',
  Gold: 'from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900',
  Platinum: 'from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900'
}

export function RewardsClient() {
  const { user, isLoading: authLoading } = useProtectedRoute()
  const [rewards, setRewards] = useState<Reward[]>([])
  const [userRewards, setUserRewards] = useState<UserRewards | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchRewards = useCallback(async () => {
    if (!user) return

    try {
      // Fetch available rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('rewards')
        .select('*')
        .eq('is_available', true)

      if (rewardsError) throw rewardsError

      // Fetch user's rewards data
      const { data: userData, error: userError } = await supabase
        .from('user_rewards')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (userError && userError.code !== 'PGRST116') throw userError // PGRST116 is "not found"

      // Calculate user's tier
      const totalPoints = userData?.total_points || 0
      let tier: UserRewards['tier'] = 'Bronze'
      let nextTierPoints = TIER_THRESHOLDS.Silver

      if (totalPoints >= TIER_THRESHOLDS.Platinum) {
        tier = 'Platinum'
        nextTierPoints = TIER_THRESHOLDS.Platinum
      } else if (totalPoints >= TIER_THRESHOLDS.Gold) {
        tier = 'Gold'
        nextTierPoints = TIER_THRESHOLDS.Platinum
      } else if (totalPoints >= TIER_THRESHOLDS.Silver) {
        tier = 'Silver'
        nextTierPoints = TIER_THRESHOLDS.Gold
      }

      setRewards(rewardsData || [])
      setUserRewards({
        total_points: totalPoints,
        points_used: userData?.points_used || 0,
        points_available: totalPoints - (userData?.points_used || 0),
        tier,
        next_tier_points: nextTierPoints,
        rewards_claimed: userData?.rewards_claimed || 0
      })
    } catch (error) {
      console.error('Error fetching rewards:', error)
      toast({
        title: 'Error',
        description: 'Failed to load rewards',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }, [user, toast])

  useEffect(() => {
    fetchRewards()
  }, [fetchRewards])

  const handleClaimReward = async (reward: Reward) => {
    if (!user || !userRewards) return

    if (userRewards.points_available < reward.points_required) {
      toast({
        title: 'Not enough points',
        description: `You need ${reward.points_required - userRewards.points_available} more points to claim this reward.`,
        variant: 'destructive'
      })
      return
    }

    try {
      const { error } = await supabase.rpc('claim_reward', {
        reward_id: reward.id,
        points: reward.points_required
      })

      if (error) throw error

      // Update local state
      setUserRewards({
        ...userRewards,
        points_used: userRewards.points_used + reward.points_required,
        points_available: userRewards.points_available - reward.points_required,
        rewards_claimed: userRewards.rewards_claimed + 1
      })

      toast({
        title: 'Success',
        description: `You've claimed ${reward.name}! Check your email for the reward code.`
      })
    } catch (error) {
      console.error('Error claiming reward:', error)
      toast({
        title: 'Error',
        description: 'Failed to claim reward. Please try again.',
        variant: 'destructive'
      })
    }
  }

  if (authLoading || isLoading) {
    return <LoadingSkeleton />
  }

  if (!userRewards) {
    return (
      <div className="text-center py-12">
        <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No rewards data found</h3>
        <p className="text-muted-foreground">
          Please try refreshing the page
        </p>
      </div>
    )
  }

  const tierProgress = ((userRewards.total_points - TIER_THRESHOLDS[userRewards.tier]) /
    (userRewards.next_tier_points - TIER_THRESHOLDS[userRewards.tier])) * 100

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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Rewards</h1>
          <p className="text-sm text-muted-foreground">View your loyalty points and redeem rewards</p>
        </div>
      </motion.div>

      {/* Rewards Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className={`bg-gradient-to-br ${TIER_COLORS[userRewards.tier]}`}>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{userRewards.tier} Member</h2>
                  <p className="text-sm text-muted-foreground">
                    {userRewards.total_points} total points earned
                  </p>
                </div>
                <Award className="h-8 w-8 text-primary" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to {userRewards.tier === 'Platinum' ? 'max tier' : 'next tier'}</span>
                  <span>{Math.round(tierProgress)}%</span>
                </div>
                <Progress value={tierProgress} className="h-2" />
                {userRewards.tier !== 'Platinum' && (
                  <p className="text-xs text-muted-foreground">
                    {userRewards.next_tier_points - userRewards.total_points} points until {
                      userRewards.tier === 'Bronze' ? 'Silver' :
                      userRewards.tier === 'Silver' ? 'Gold' : 'Platinum'
                    } tier
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-3 bg-white/10 rounded-lg">
                  <p className="text-2xl font-bold">{userRewards.points_available}</p>
                  <p className="text-xs text-muted-foreground">Available Points</p>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-lg">
                  <p className="text-2xl font-bold">{userRewards.rewards_claimed}</p>
                  <p className="text-xs text-muted-foreground">Rewards Claimed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Available Rewards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Available Rewards</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rewards.map((reward) => (
              <Card key={reward.id} className="relative overflow-hidden">
                {reward.points_required > userRewards.points_available && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center p-4">
                      <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium">
                        Need {reward.points_required - userRewards.points_available} more points
                      </p>
                    </div>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{reward.name}</span>
                    <Badge variant="secondary">
                      <Star className="h-3 w-3 mr-1" />
                      {reward.points_required}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{reward.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Expires in {reward.expiry_days} days</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleClaimReward(reward)}
                      disabled={reward.points_required > userRewards.points_available}
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Claim
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
} 