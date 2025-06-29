'use client'

import React, { useState } from 'react'
import { content } from '@/lib/content'
import { REWARDS } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils/formatters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/progress'
import { Star, Gift, Award } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

interface RewardsSectionProps {
  userId: string
  initialData: {
    rewards?: {
      points: number
      tier: string
      history: Array<{
        id: string
        type: 'earned' | 'redeemed'
        points: number
        description: string
        created_at: string
      }>
    }
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

export function RewardsSection({ userId, initialData }: RewardsSectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const rewards = initialData.rewards || { points: 0, tier: 'Bronze', history: [] }

  const tiers = {
    Bronze: { min: 0, max: 100, color: 'bg-bronze' },
    Silver: { min: 100, max: 250, color: 'bg-silver' },
    Gold: { min: 250, max: 500, color: 'bg-gold' },
    Platinum: { min: 500, max: 1000, color: 'bg-platinum' }
  }

  const currentTier = tiers[rewards.tier as keyof typeof tiers]
  const progress = ((rewards.points - currentTier.min) / (currentTier.max - currentTier.min)) * 100

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
      
      // Update rewards history
      const updatedHistory = [newTransaction, ...rewards.history]
      
      // Update rewards state
      const updatedRewards = {
        ...rewards,
        points: rewards.points - reward.pointsCost,
        history: updatedHistory
      }
      
      // Update rewards in state
      // This is a placeholder and should be replaced with actual state management logic
    } catch (error) {
      console.error('Failed to redeem reward:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Your Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* Current Points */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                <Star className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available Points</p>
                <p className="text-2xl font-bold text-[var(--color-primary)]">{rewards.points}</p>
              </div>
            </div>

            {/* Tier Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{rewards.tier} Tier</span>
                <span className="text-muted-foreground">{rewards.points} / {currentTier.max} points</span>
              </div>
              <Progress value={progress} className={currentTier.color} />
              <p className="text-xs text-muted-foreground">
                Earn {currentTier.max - rewards.points} more points to reach the next tier
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Points History */}
      <Card>
        <CardHeader>
          <CardTitle>Points History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="animate-spin w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full"></div>
                <span className="text-muted-foreground">Loading...</span>
              </div>
            </div>
          ) : rewards.history.length > 0 ? (
            <div className="space-y-4">
              {rewards.history.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.type === 'earned' ? 'bg-[var(--color-success)]/10' : 'bg-[var(--color-warning)]/10'
                  }`}>
                    {item.type === 'earned' ? (
                      <Star className="w-5 h-5 text-[var(--color-success)]" />
                    ) : (
                      <Gift className="w-5 h-5 text-[var(--color-warning)]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{item.description}</p>
                      <span className={`font-medium ${
                        item.type === 'earned' ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'
                      }`}>
                        {item.type === 'earned' ? '+' : '-'}{item.points}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Award}
              title="No rewards history"
              description="Start earning points by booking services"
              action={{
                label: "Book a Service",
                onClick: () => window.location.href = '/booking'
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
} 