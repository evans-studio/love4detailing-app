"use client"

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth'
import { Trophy, Star, Crown, Award, Target } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface LoyaltyBadge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  requirements: any
  tier: number
  earned_at?: string
}

interface UserProgress {
  totalBookings: number
  totalSpent: number
  currentPoints: number
}

interface LoyaltyBadgesProps {
  showProgress?: boolean
  compact?: boolean
}

export default function LoyaltyBadges({ showProgress = true, compact = false }: LoyaltyBadgesProps) {
  const { user } = useAuth()
  const [earnedBadges, setEarnedBadges] = useState<LoyaltyBadge[]>([])
  const [availableBadges, setAvailableBadges] = useState<LoyaltyBadge[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalBookings: 0,
    totalSpent: 0,
    currentPoints: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchBadgesAndProgress = useCallback(async () => {
    try {
      // Fetch user's earned badges
      const { data: userBadges } = await supabase
        .from('user_badges')
        .select(`
          earned_at,
          loyalty_badges (
            id, name, description, icon, color, requirements, tier
          )
        `)
        .eq('user_id', user?.id)

      // Fetch all available badges
      const { data: allBadges } = await supabase
        .from('loyalty_badges')
        .select('*')
        .eq('is_active', true)
        .order('tier', { ascending: true })

      // Fetch user progress data
      const { data: bookings } = await supabase
        .from('bookings')
        .select('total_price, status')
        .eq('user_id', user?.id)

      const { data: rewards } = await supabase
        .from('rewards')
        .select('points')
        .eq('user_id', user?.id)
        .single()

      // Process data
      const earned = userBadges?.map(ub => ({
        ...(ub.loyalty_badges as any),
        earned_at: ub.earned_at
      })) || []

      const earnedIds = earned.map(b => b.id)
      const available = allBadges?.filter(b => !earnedIds.includes(b.id)) || []

      const totalBookings = bookings?.filter(b => b.status === 'completed').length || 0
      const totalSpent = bookings?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0
      const currentPoints = rewards?.points || 0

      setEarnedBadges(earned)
      setAvailableBadges(available)
      setUserProgress({ totalBookings, totalSpent, currentPoints })

    } catch (error) {
      console.error('Error fetching badges:', error)
      toast({
        title: 'Error',
        description: 'Failed to load loyalty badges',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }, [user, toast])

  useEffect(() => {
    fetchBadgesAndProgress()
  }, [fetchBadgesAndProgress])

  const calculateProgress = (requirements: any): number => {
    if (requirements.bookings) {
      return Math.min((userProgress.totalBookings / requirements.bookings) * 100, 100)
    }
    if (requirements.spending) {
      return Math.min((userProgress.totalSpent / requirements.spending) * 100, 100)
    }
    return 0
  }

  const getProgressText = (requirements: any): string => {
    if (requirements.bookings) {
      return `${userProgress.totalBookings}/${requirements.bookings} bookings`
    }
    if (requirements.spending) {
      return `£${userProgress.totalSpent.toFixed(0)}/£${requirements.spending} spent`
    }
    return ''
  }

  const getTierIcon = (tier: number) => {
    switch (tier) {
      case 1: return <Star className="w-4 h-4" />
      case 2: return <Award className="w-4 h-4" />
      case 3: return <Trophy className="w-4 h-4" />
      case 4: return <Crown className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
    }
  }

  const getTierColor = (tier: number): string => {
    switch (tier) {
      case 1: return 'bg-platinum-silver/20 text-platinum-silver border-platinum-silver/30'
      case 2: return 'bg-gray-100 text-gray-800 border-gray-200'
      case 3: return 'bg-deep-purple/20 text-deep-purple border-deep-purple/30'
      case 4: return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {earnedBadges.slice(0, 3).map((badge) => (
          <motion.div
            key={badge.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="relative"
            title={badge.description}
          >
            <Badge className={`${getTierColor(badge.tier)} text-lg px-3 py-1`}>
              {badge.icon} {badge.name}
            </Badge>
          </motion.div>
        ))}
        {earnedBadges.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{earnedBadges.length - 3} more
          </Badge>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                              <Trophy className="h-5 w-5 text-platinum-silver" />
              Your Badges ({earnedBadges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {earnedBadges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <Card className="border-2" style={{ borderColor: badge.color }}>
                      <CardContent className="pt-4">
                        <div className="text-center space-y-2">
                          <div className="text-3xl">{badge.icon}</div>
                          <div>
                            <h4 className="font-semibold text-sm">{badge.name}</h4>
                            <p className="text-xs text-muted-foreground">{badge.description}</p>
                          </div>
                          <Badge className={getTierColor(badge.tier)}>
                            {getTierIcon(badge.tier)}
                            Tier {badge.tier}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Badges with Progress */}
      {showProgress && availableBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Next Badges to Earn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableBadges.slice(0, 5).map((badge) => {
                const progress = calculateProgress(badge.requirements)
                const isCloseToEarning = progress >= 80
                
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 border rounded-lg ${isCloseToEarning ? 'border-green-200 bg-green-50' : 'border-border'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{badge.icon}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-sm">{badge.name}</h4>
                            <p className="text-xs text-muted-foreground">{badge.description}</p>
                          </div>
                          <Badge className={getTierColor(badge.tier)}>
                            {getTierIcon(badge.tier)}
                            Tier {badge.tier}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{getProgressText(badge.requirements)}</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          {isCloseToEarning && (
                            <p className="text-xs text-green-600 font-medium">
                              🎉 Almost there! Keep going!
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-500">{userProgress.totalBookings}</div>
              <div className="text-xs text-muted-foreground">Total Bookings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">£{userProgress.totalSpent.toFixed(0)}</div>
              <div className="text-xs text-muted-foreground">Total Spent</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-500">{userProgress.currentPoints}</div>
              <div className="text-xs text-muted-foreground">Loyalty Points</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 