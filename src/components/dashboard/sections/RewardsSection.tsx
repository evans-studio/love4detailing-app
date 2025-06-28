'use client'

import React, { useState } from 'react'
import { content } from '@/lib/content'
import { REWARDS } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils/index'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface RewardsSectionProps {
  userId: string
  userProfile?: {
    loyaltyPoints: number
    tier: string
  }
  initialRewards?: {
    points: number
    tier: string
    history: RewardTransaction[]
  }
}

interface RewardTransaction {
  id: string
  type: 'earned' | 'redeemed'
  points: number
  description: string
  date: string
  bookingId?: string
}

const ProgressBar: React.FC<{ current: number; next: number; label: string }> = ({ 
  current, 
  next, 
  label 
}) => {
  const percentage = Math.min((current / next) * 100, 100)
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-[var(--color-text)]">
          {current} / {next} points
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--purple-600)] h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

const RewardCard: React.FC<{ reward: any; userPoints: number; onRedeem: (reward: any) => void }> = ({ 
  reward, 
  userPoints, 
  onRedeem 
}) => {
  const canRedeem = userPoints >= reward.pointsCost
  
  return (
    <Card className={`transition-all duration-200 ${canRedeem ? 'hover:shadow-md' : 'opacity-75'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-[var(--color-text)] mb-1">
              {reward.name}
            </h4>
            <p className="text-sm text-muted-foreground">
              {reward.description}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-[var(--color-primary)]">
              {reward.pointsCost} pts
            </p>
            {reward.value && (
              <p className="text-xs text-muted-foreground">
                Worth {formatCurrency(reward.value)}
              </p>
            )}
          </div>
        </div>
        
        <Button 
          size="sm" 
          disabled={!canRedeem}
          onClick={() => onRedeem(reward)}
          className="w-full"
        >
          {canRedeem ? 'Redeem Now' : 'Insufficient Points'}
        </Button>
      </CardContent>
    </Card>
  )
}

const TransactionItem: React.FC<{ transaction: RewardTransaction }> = ({ transaction }) => {
  const isEarned = transaction.type === 'earned'
  
  return (
    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isEarned 
            ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' 
            : 'bg-[var(--color-info)]/10 text-[var(--color-info)]'
        }`}>
          {isEarned ? '+' : '-'}
        </div>
        <div>
          <p className="font-medium text-[var(--color-text)]">
            {transaction.description}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(transaction.date).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-semibold ${
          isEarned ? 'text-[var(--color-success)]' : 'text-[var(--color-info)]'
        }`}>
          {isEarned ? '+' : '-'}{transaction.points} pts
        </p>
      </div>
    </div>
  )
}

export const RewardsSection: React.FC<RewardsSectionProps> = ({
  userId,
  userProfile,
  initialRewards,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [rewardHistory, setRewardHistory] = useState<RewardTransaction[]>(
    initialRewards?.history || []
  )

  const currentPoints = userProfile?.loyaltyPoints || 0
  const currentTier = userProfile?.tier || 'bronze'
  
  // Get current tier data
  const currentTierData = REWARDS.tiers[currentTier as keyof typeof REWARDS.tiers] || REWARDS.tiers.bronze
  
  // Get next tier data
  const tierKeys = Object.keys(REWARDS.tiers) as (keyof typeof REWARDS.tiers)[]
  const currentTierIndex = tierKeys.indexOf(currentTier as keyof typeof REWARDS.tiers)
  const nextTierKey = tierKeys[currentTierIndex + 1]
  const nextTierData = nextTierKey ? REWARDS.tiers[nextTierKey] : null
  
  const loyaltyData = {
    current: currentTierData,
    next: nextTierData
  }

  const handleRedeemReward = async (reward: any) => {
    setIsLoading(true)
    try {
      // TODO: Implement actual redemption API call
      console.log('Redeeming reward:', reward)
      
      // Simulate API success
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Add transaction to history
      const newTransaction: RewardTransaction = {
        id: Date.now().toString(),
        type: 'redeemed',
        points: reward.pointsCost,
        description: `Redeemed: ${reward.name}`,
        date: new Date().toISOString(),
      }
      
      setRewardHistory(prev => [newTransaction, ...prev])
      
    } catch (error) {
      console.error('Failed to redeem reward:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text)]">
          {content.pages.dashboard.rewards.title}
        </h2>
        <p className="text-muted-foreground">
          {content.pages.dashboard.rewards.subtitle}
        </p>
      </div>

      {/* Points & Tier Overview */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Current Points */}
        <Card className="bg-gradient-to-r from-[var(--purple-50)] to-[var(--purple-100)] border-[var(--purple-200)]">
          <CardHeader>
            <CardTitle className="text-lg text-[var(--color-primary)] flex items-center gap-2">
              ⭐ Your Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[var(--color-primary)] mb-2">
              {currentPoints.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Available for redemption
            </p>
          </CardContent>
        </Card>

        {/* Current Tier */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🏆 {loyaltyData.current.name} Member
            </CardTitle>
          </CardHeader>
                     <CardContent>
             <p className="text-sm text-muted-foreground mb-3">
               Enjoy exclusive benefits and discounts as a {loyaltyData.current.name} member
             </p>
             {loyaltyData.next && (
               <ProgressBar
                 current={currentPoints}
                 next={loyaltyData.next.threshold}
                 label={`Progress to ${loyaltyData.next.name}`}
               />
             )}
           </CardContent>
        </Card>
      </div>

      {/* Tier Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Your Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loyaltyData.current.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-[var(--purple-50)] rounded-lg">
                <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-sm font-medium text-[var(--color-text)]">{benefit}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Rewards */}
      <Card>
        <CardHeader>
          <CardTitle>Available Rewards</CardTitle>
          <p className="text-sm text-muted-foreground">
            Redeem your points for these exclusive rewards
          </p>
        </CardHeader>
                 <CardContent>
           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
             {Object.values(REWARDS.redemptions).map((reward: any) => (
               <RewardCard
                 key={reward.id}
                 reward={reward}
                 userPoints={currentPoints}
                 onRedeem={handleRedeemReward}
               />
             ))}
           </div>
         </CardContent>
      </Card>

      {/* Points History */}
      {rewardHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Points History</CardTitle>
            <p className="text-sm text-muted-foreground">
              Your recent earning and redemption activity
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rewardHistory.slice(0, 10).map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
            {rewardHistory.length > 10 && (
              <Button variant="ghost" className="w-full mt-4">
                View All History
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Earn More Points */}
      <Card className="bg-gradient-to-r from-[var(--color-info)]/5 to-[var(--color-success)]/5 border-[var(--color-info)]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💡 Earn More Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="p-3 bg-background/50 rounded-lg">
              <p className="font-medium text-[var(--color-text)] mb-1">Book Services</p>
                             <p className="text-sm text-muted-foreground">
                 Earn {REWARDS.pointsEarning.booking} points per £1 spent on services
               </p>
             </div>
             <div className="p-3 bg-background/50 rounded-lg">
               <p className="font-medium text-[var(--color-text)] mb-1">Refer Friends</p>
               <p className="text-sm text-muted-foreground">
                 Get {REWARDS.pointsEarning.referral} points for each successful referral
               </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 