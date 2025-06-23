import { supabase } from '@/lib/supabase/client'

interface UserStats {
  totalBookings: number
  totalSpent: number
  userId: string
}

export async function checkAndAwardBadges(userId: string) {
  try {
    // Get user stats
    const { data: bookings } = await supabase
      .from('bookings')
      .select('total_price, status')
      .eq('user_id', userId)

    if (!bookings) return

    const completedBookings = bookings.filter(b => b.status === 'completed')
    const totalBookings = completedBookings.length
    const totalSpent = completedBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)

    // Get all available badges
    const { data: badges } = await supabase
      .from('loyalty_badges')
      .select('*')
      .eq('is_active', true)

    if (!badges) return

    // Get user's current badges
    const { data: userBadges } = await supabase
      .from('user_badges')
      .select('badge_id')
      .eq('user_id', userId)

    const earnedBadgeIds = userBadges?.map(ub => ub.badge_id) || []

    // Check each badge requirement
    for (const badge of badges) {
      // Skip if user already has this badge
      if (earnedBadgeIds.includes(badge.id)) continue

      let shouldAward = false

      // Check requirements
      if (badge.requirements.bookings && totalBookings >= badge.requirements.bookings) {
        shouldAward = true
      }
      if (badge.requirements.spending && totalSpent >= badge.requirements.spending) {
        shouldAward = true
      }

      // Award the badge
      if (shouldAward) {
        await supabase
          .from('user_badges')
          .insert({
            user_id: userId,
            badge_id: badge.id,
            earned_at: new Date().toISOString()
          })
          .select()

        console.log(`Badge awarded: ${badge.name} to user ${userId}`)
      }
    }

    return true
  } catch (error) {
    console.error('Error checking and awarding badges:', error)
    return false
  }
}

export async function updateLoyaltyPoints(userId: string, bookingAmount: number) {
  try {
    // Get loyalty points rate from admin settings
    const { data: settings } = await supabase
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', 'loyalty_points_rate')
      .single()

    const pointsRate = settings?.setting_value || 10 // Default 10%
    const pointsToAdd = Math.floor(bookingAmount * (pointsRate / 100))

    // Update or create rewards record
    const { data: existingRewards } = await supabase
      .from('rewards')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (existingRewards) {
      // Update existing record
      await supabase
        .from('rewards')
        .update({
          points: existingRewards.points + pointsToAdd,
          lifetime_points: (existingRewards.lifetime_points || 0) + pointsToAdd,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
    } else {
      // Create new record
      await supabase
        .from('rewards')
        .insert({
          user_id: userId,
          points: pointsToAdd,
          lifetime_points: pointsToAdd,
          total_saved: 0
        })
    }

    // Record in history
    await supabase
      .from('rewards_history')
      .insert({
        user_id: userId,
        points: pointsToAdd,
        type: 'earned',
        description: `Earned ${pointsToAdd} points from booking (${pointsRate}% of £${bookingAmount})`
      })

    return pointsToAdd
  } catch (error) {
    console.error('Error updating loyalty points:', error)
    return 0
  }
}

export async function getUserLoyaltyTier(userId: string) {
  try {
    // Get user's total lifetime points
    const { data: rewards } = await supabase
      .from('rewards')
      .select('lifetime_points')
      .eq('user_id', userId)
      .single()

    const lifetimePoints = rewards?.lifetime_points || 0

    // Get loyalty tiers
    const { data: tiers } = await supabase
      .from('loyalty_tiers')
      .select('*')
      .eq('is_active', true)
      .order('min_points', { ascending: false })

    if (!tiers) return null

    // Find the highest tier the user qualifies for
    for (const tier of tiers) {
      if (lifetimePoints >= tier.min_points) {
        return tier
      }
    }

    // Return the lowest tier if no match
    return tiers[tiers.length - 1]
  } catch (error) {
    console.error('Error getting user loyalty tier:', error)
    return null
  }
} 