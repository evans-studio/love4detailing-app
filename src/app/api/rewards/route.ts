import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Validation schemas
const redeemRewardSchema = z.object({
  rewardId: z.string(),
  pointsCost: z.number().min(1),
  rewardName: z.string(),
  rewardType: z.enum(['discount', 'freeService', 'upgrade', 'merchandise']),
})

const updatePointsSchema = z.object({
  points: z.number(),
  reason: z.string(),
  type: z.enum(['earned', 'redeemed', 'adjustment']),
  bookingId: z.string().optional(),
})

// Response types
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Loyalty tier thresholds
const TIER_THRESHOLDS = {
  bronze: { min: 0, max: 99 },
  silver: { min: 100, max: 299 },
  gold: { min: 300, max: 599 },
  platinum: { min: 600, max: Infinity },
}

// Helper function to get user from auth header
async function getUserFromAuth(request: NextRequest): Promise<{ userId: string } | null> {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return null
    }
    
    const token = authHeader.substring(7)
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return null
    }
    
    return { userId: user.id }
  } catch (error) {
    console.error('Auth validation error:', error)
    return null
  }
}

// Helper function to calculate tier from points
function calculateTier(points: number): string {
  if (points >= TIER_THRESHOLDS.platinum.min) return 'platinum'
  if (points >= TIER_THRESHOLDS.gold.min) return 'gold'
  if (points >= TIER_THRESHOLDS.silver.min) return 'silver'
  return 'bronze'
}

// Helper function to get tier info
function getTierInfo(tier: string) {
  const tiers = {
    bronze: { 
      name: 'Bronze', 
      threshold: 0, 
      nextTier: 'silver',
      nextThreshold: 100,
      benefits: ['Basic support', 'Booking confirmations'],
      discountPercentage: 0 
    },
    silver: { 
      name: 'Silver', 
      threshold: 100, 
      nextTier: 'gold',
      nextThreshold: 300,
      benefits: ['Priority support', '5% discount', 'Exclusive offers'],
      discountPercentage: 5 
    },
    gold: { 
      name: 'Gold', 
      threshold: 300, 
      nextTier: 'platinum',
      nextThreshold: 600,
      benefits: ['Priority support', '10% discount', 'Free add-ons', 'Flexible booking'],
      discountPercentage: 10 
    },
    platinum: { 
      name: 'Platinum', 
      threshold: 600, 
      nextTier: null,
      nextThreshold: null,
      benefits: ['VIP support', '15% discount', 'Free upgrades', 'Priority scheduling'],
      discountPercentage: 15 
    },
  }
  
  return tiers[tier as keyof typeof tiers] || tiers.bronze
}

// Helper function to format reward transaction response
function formatRewardTransactionResponse(transaction: any) {
  return {
    id: transaction.id,
    type: transaction.type,
    points: transaction.points,
    description: transaction.description,
    rewardId: transaction.reward_id,
    bookingId: transaction.booking_id,
    status: transaction.status,
    createdAt: transaction.created_at,
  }
}

// GET - Fetch user rewards data
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const auth = await getUserFromAuth(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user profile for current points and tier
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('loyalty_points, tier')
      .eq('id', auth.userId)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch rewards data' },
        { status: 500 }
      )
    }

    const currentPoints = profile?.loyalty_points || 0
    const currentTier = profile?.tier || 'bronze'
    
    // Get reward transaction history
    const { data: transactions, error: transactionsError } = await supabase
      .from('reward_transactions')
      .select('*')
      .eq('user_id', auth.userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (transactionsError) {
      console.error('Transactions fetch error:', transactionsError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch transaction history' },
        { status: 500 }
      )
    }

    // Calculate tier information
    const tierInfo = getTierInfo(currentTier)
    
    // Calculate available rewards based on current points
    const availableRewards = [
      {
        id: 'discount_10',
        name: '£10 Off Next Service',
        description: 'Get £10 discount on your next booking',
        pointsCost: 100,
        type: 'discount',
        value: 10,
        available: currentPoints >= 100,
      },
      {
        id: 'discount_25',
        name: '£25 Off Next Service',
        description: 'Get £25 discount on your next booking',
        pointsCost: 250,
        type: 'discount',
        value: 25,
        available: currentPoints >= 250,
      },
      {
        id: 'free_interior',
        name: 'Free Interior Protection',
        description: 'Complimentary interior protection service',
        pointsCost: 150,
        type: 'freeService',
        value: 15,
        available: currentPoints >= 150,
      },
      {
        id: 'service_upgrade',
        name: 'Free Service Upgrade',
        description: 'Upgrade your service package for free',
        pointsCost: 300,
        type: 'upgrade',
        value: 30,
        available: currentPoints >= 300,
      },
    ]

    return NextResponse.json({
      success: true,
      data: {
        currentPoints,
        currentTier,
        tierInfo,
        availableRewards,
        transactions: transactions?.map(formatRewardTransactionResponse) || [],
        earningSummary: {
          totalEarned: transactions?.filter(t => t.type === 'earned').reduce((sum, t) => sum + t.points, 0) || 0,
          totalRedeemed: transactions?.filter(t => t.type === 'redeemed').reduce((sum, t) => sum + Math.abs(t.points), 0) || 0,
        },
      },
    })

  } catch (error) {
    console.error('Rewards GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Redeem reward
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const auth = await getUserFromAuth(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = redeemRewardSchema.parse(body)

    // Get current user points
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('loyalty_points, tier')
      .eq('id', auth.userId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      )
    }

    const currentPoints = profile.loyalty_points || 0

    // Check if user has enough points
    if (currentPoints < validatedData.pointsCost) {
      return NextResponse.json(
        { success: false, error: 'Insufficient points for this reward' },
        { status: 400 }
      )
    }

    // Create reward transaction
    const transactionData = {
      id: `RT${Date.now().toString().slice(-8)}`,
      user_id: auth.userId,
      type: 'redeemed',
      points: -validatedData.pointsCost, // Negative for redemption
      description: `Redeemed: ${validatedData.rewardName}`,
      reward_id: validatedData.rewardId,
      status: 'completed',
      created_at: new Date().toISOString(),
    }

    const { error: transactionError } = await supabase
      .from('reward_transactions')
      .insert(transactionData)

    if (transactionError) {
      console.error('Transaction creation error:', transactionError)
      return NextResponse.json(
        { success: false, error: 'Failed to process reward redemption' },
        { status: 500 }
      )
    }

    // Update user points
    const newPoints = currentPoints - validatedData.pointsCost
    const newTier = calculateTier(newPoints)

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        loyalty_points: newPoints,
        tier: newTier,
        updated_at: new Date().toISOString(),
      })
      .eq('id', auth.userId)

    if (updateError) {
      console.error('Points update error:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update points balance' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        transaction: formatRewardTransactionResponse(transactionData),
        newBalance: newPoints,
        newTier,
        tierInfo: getTierInfo(newTier),
      },
      message: 'Reward redeemed successfully',
    })

  } catch (error) {
    console.error('Reward redemption error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update points (admin function)
export async function PATCH(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const auth = await getUserFromAuth(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // TODO: Add admin role check here
    // For now, this endpoint is available to all authenticated users
    // In production, you'd check if the user has admin privileges

    const body = await request.json()
    const validatedData = updatePointsSchema.parse(body)

    // Get current user points
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('loyalty_points, tier')
      .eq('id', auth.userId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      )
    }

    const currentPoints = profile.loyalty_points || 0

    // Create transaction record
    const transactionData = {
      id: `RT${Date.now().toString().slice(-8)}`,
      user_id: auth.userId,
      type: validatedData.type,
      points: validatedData.points,
      description: validatedData.reason,
      booking_id: validatedData.bookingId,
      status: 'completed',
      created_at: new Date().toISOString(),
    }

    const { error: transactionError } = await supabase
      .from('reward_transactions')
      .insert(transactionData)

    if (transactionError) {
      console.error('Transaction creation error:', transactionError)
      return NextResponse.json(
        { success: false, error: 'Failed to create transaction' },
        { status: 500 }
      )
    }

    // Update user points
    const newPoints = Math.max(0, currentPoints + validatedData.points)
    const newTier = calculateTier(newPoints)

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        loyalty_points: newPoints,
        tier: newTier,
        updated_at: new Date().toISOString(),
      })
      .eq('id', auth.userId)

    if (updateError) {
      console.error('Points update error:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update points balance' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        transaction: formatRewardTransactionResponse(transactionData),
        oldBalance: currentPoints,
        newBalance: newPoints,
        oldTier: profile.tier,
        newTier,
        tierInfo: getTierInfo(newTier),
      },
      message: 'Points updated successfully',
    })

  } catch (error) {
    console.error('Points update error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 