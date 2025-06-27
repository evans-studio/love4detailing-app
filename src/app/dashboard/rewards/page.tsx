// Server Component wrapper for proper metadata and static optimization
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rewards - Love4Detailing',
  description: 'View your loyalty points and redeem rewards.',
}

export default function RewardsPage() {
  return <RewardsClient />
}

// Client Component for interactive rewards features
"use client"

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import LoyaltyBadges from '@/components/loyalty/LoyaltyBadges'
import { useProtectedRoute } from '@/lib/auth'
import { formatCurrency } from '@/lib/utils/format'
import { Gift, Star, Trophy, Sparkles } from 'lucide-react'

interface RewardsData {
  points: number
  pointsToNextReward: number
  totalSaved: number
  nextRewardValue: number
  rewardsHistory: {
    id: string
    date: string
    description: string
    points: number
    type: 'earned' | 'redeemed'
  }[]
}

interface RewardOption {
  points: number
  value: number
  description: string
}

const rewardOptions: RewardOption[] = [
  { points: 100, value: 5, description: '£5 off your next booking' },
  { points: 200, value: 12, description: '£12 off your next booking' },
  { points: 500, value: 35, description: '£35 off your next booking' },
  { points: 1000, value: 80, description: '£80 off your next booking' }
]

function RewardsClient() {
  const [rewardsData, setRewardsData] = useState<RewardsData>({
    points: 0,
    pointsToNextReward: 100,
    totalSaved: 0,
    nextRewardValue: 5,
    rewardsHistory: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReward, setSelectedReward] = useState<RewardOption | null>(null)
  const { toast } = useToast()

  const fetchRewardsData = useCallback(async () => {
    try {
      const { data: rewards, error } = await supabase
        .from('rewards')
        .select('*')
        .single()

      if (error) throw error
      setRewardsData(rewards)
    } catch (error) {
      console.error('Error fetching rewards:', error)
      toast({
        title: 'Error',
        description: 'Failed to load rewards data',
        variant: 'destructive'
      })
    }
  }, [toast])

  useEffect(() => {
    fetchRewardsData()
  }, [fetchRewardsData])

  function getNextRewardThreshold(currentPoints: number): number {
    const nextReward = rewardOptions.find(option => option.points > currentPoints)
    return nextReward ? nextReward.points - currentPoints : 100
  }

  function getNextRewardValue(currentPoints: number): number {
    const nextReward = rewardOptions.find(option => option.points > currentPoints)
    return nextReward ? nextReward.value : 5
  }

  async function handleRedeemReward(reward: RewardOption) {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData?.user?.id) {
        toast({
          title: "Error",
          description: "Please sign in to redeem rewards",
          variant: "destructive"
        })
        return
      }

      // Start a Supabase transaction
      const { data } = await supabase
        .from('rewards')
        .select('points')
        .eq('user_id', userData.user.id)
        .single()

      if (!data || data.points < reward.points) {
        toast({
          title: "Error",
          description: "Not enough points to redeem this reward",
          variant: "destructive"
        })
        return
      }

      // Update points balance
      const { error: updateError } = await supabase
        .from('rewards')
        .update({
          points: data.points - reward.points,
          total_saved: rewardsData.totalSaved + reward.value,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userData.user.id)

      if (updateError) throw updateError

      // Record the redemption in history
      const { error: historyError } = await supabase
        .from('rewards_history')
        .insert({
          user_id: userData.user.id,
          points: -reward.points,
          type: 'redeemed',
          description: `Redeemed ${reward.description}`
        })

      if (historyError) throw historyError

      // Generate reward code (you might want to implement a more sophisticated system)
      const rewardCode = `REWARD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

      toast({
        title: "Success!",
        description: `Reward redeemed successfully. Your code: ${rewardCode}`,
      })

      // Refresh rewards data
      await fetchRewardsData()
      setSelectedReward(null)
    } catch (error) {
      console.error('Error redeeming reward:', error)
      toast({
        title: "Error",
        description: "Failed to redeem reward. Please try again.",
        variant: "destructive"
      })
    }
  }

  const progressPercentage = (rewardsData.points / (rewardsData.points + rewardsData.pointsToNextReward)) * 100

  return (
    <div className="space-y-8">
      {/* Points Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Your Rewards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold">{rewardsData.points}</p>
                <p className="text-sm text-muted-foreground">Available Points</p>
              </div>
              <div>
                <p className="text-3xl font-bold">£{rewardsData.totalSaved.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Saved</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to next reward</span>
                <span>{rewardsData.points} / {rewardsData.points + rewardsData.pointsToNextReward} points</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Earn {rewardsData.pointsToNextReward} more points for a £{rewardsData.nextRewardValue} discount
              </p>
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
        <Card>
          <CardHeader>
            <CardTitle>Available Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {rewardOptions.map((reward) => (
                <Card key={reward.points} className={`cursor-pointer transition-colors ${
                  rewardsData.points >= reward.points ? 'hover:bg-accent' : 'opacity-50'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-lg font-bold">£{reward.value}</p>
                      <p className="text-sm text-muted-foreground">{reward.points} points</p>
                    </div>
                    <p className="text-sm mb-4">{reward.description}</p>
                    <Button
                      className="w-full"
                      disabled={rewardsData.points < reward.points}
                      onClick={() => setSelectedReward(reward)}
                    >
                      Redeem Reward
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Loyalty Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <LoyaltyBadges />
      </motion.div>

      {/* Points History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Points History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rewardsData.rewardsHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-medium">{item.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`font-medium ${
                    item.type === 'earned' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {item.type === 'earned' ? '+' : '-'}{item.points} points
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Redemption Dialog */}
      <Dialog open={!!selectedReward} onOpenChange={(open) => !open && setSelectedReward(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Redemption</DialogTitle>
            <DialogDescription>
              Please review your reward redemption details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedReward && (
              <>
                <p>Are you sure you want to redeem this reward?</p>
                <div className="bg-accent/50 p-4 rounded-lg">
                  <p className="font-medium">{selectedReward.description}</p>
                  <p className="text-sm text-muted-foreground">Cost: {selectedReward.points} points</p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setSelectedReward(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleRedeemReward(selectedReward)}>
                    Confirm Redemption
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 