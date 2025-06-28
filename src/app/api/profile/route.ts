import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Validation schemas
const updateProfileSchema = z.object({
  fullName: z.string().min(1).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  postcode: z.string().optional(),
  emailPreferences: z.object({
    marketing: z.boolean().optional(),
    bookingUpdates: z.boolean().optional(),
    rewardNotifications: z.boolean().optional(),
  }).optional(),
})

// Response types
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
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

// Helper function to format profile response
function formatProfileResponse(profile: any, user: any) {
  return {
    id: profile.id || user.id,
    fullName: profile.full_name || user.user_metadata?.full_name || '',
    email: user.email || '',
    phone: profile.phone || '',
    address: profile.address || '',
    postcode: profile.postcode || '',
    loyaltyPoints: profile.loyalty_points || 0,
    tier: profile.tier || 'bronze',
    emailPreferences: {
      marketing: profile.email_marketing ?? true,
      bookingUpdates: profile.email_booking_updates ?? true,
      rewardNotifications: profile.email_reward_notifications ?? true,
    },
    createdAt: profile.created_at || user.created_at,
    updatedAt: profile.updated_at,
  }
}

// GET - Fetch user profile
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const auth = await getUserFromAuth(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user data from auth
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Get profile data from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', auth.userId)
      .single()

    // Profile might not exist yet, that's okay
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch profile' },
        { status: 500 }
      )
    }

    // Get booking and loyalty stats
    const [bookingsResult, rewardsResult] = await Promise.all([
      supabase
        .from('bookings')
        .select('id, status, total_amount')
        .eq('user_id', auth.userId),
      supabase
        .from('reward_transactions')
        .select('points, type')
        .eq('user_id', auth.userId)
    ])

    const bookings = bookingsResult.data || []
    const rewardTransactions = rewardsResult.data || []

    // Calculate stats
    const totalBookings = bookings.length
    const completedBookings = bookings.filter(b => b.status === 'completed').length
    const totalSpent = bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)
    const earnedPoints = rewardTransactions
      .filter(t => t.type === 'earned')
      .reduce((sum, t) => sum + t.points, 0)

    const profileData = formatProfileResponse(profile || {}, user)

    return NextResponse.json({
      success: true,
      data: {
        ...profileData,
        stats: {
          totalBookings,
          completedBookings,
          totalSpent,
          earnedPoints,
        },
      },
    })

  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update user profile
export async function PATCH(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const auth = await getUserFromAuth(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updateProfileSchema.parse(body)

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', auth.userId)
      .single()

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (validatedData.fullName !== undefined) updateData.full_name = validatedData.fullName
    if (validatedData.phone !== undefined) updateData.phone = validatedData.phone
    if (validatedData.address !== undefined) updateData.address = validatedData.address
    if (validatedData.postcode !== undefined) updateData.postcode = validatedData.postcode?.toUpperCase()

    if (validatedData.emailPreferences) {
      if (validatedData.emailPreferences.marketing !== undefined) {
        updateData.email_marketing = validatedData.emailPreferences.marketing
      }
      if (validatedData.emailPreferences.bookingUpdates !== undefined) {
        updateData.email_booking_updates = validatedData.emailPreferences.bookingUpdates
      }
      if (validatedData.emailPreferences.rewardNotifications !== undefined) {
        updateData.email_reward_notifications = validatedData.emailPreferences.rewardNotifications
      }
    }

    let result
    if (existingProfile) {
      // Update existing profile
      result = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', auth.userId)
        .select()
        .single()
    } else {
      // Create new profile
      const profileData = {
        id: auth.userId,
        ...updateData,
        loyalty_points: 0,
        tier: 'bronze',
        created_at: new Date().toISOString(),
      }
      
      result = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single()
    }

    const { data: profile, error } = result

    if (error) {
      console.error('Profile update error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    // Get user data for complete response
    const { data: { user } } = await supabase.auth.getUser()

    return NextResponse.json({
      success: true,
      data: formatProfileResponse(profile, user),
      message: 'Profile updated successfully',
    })

  } catch (error) {
    console.error('Profile PATCH error:', error)
    
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

// DELETE - Delete user account
export async function DELETE(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const auth = await getUserFromAuth(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check for active bookings
    const { data: activeBookings } = await supabase
      .from('bookings')
      .select('id')
      .eq('user_id', auth.userId)
      .in('status', ['pending', 'confirmed'])

    if (activeBookings && activeBookings.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete account with active bookings. Please cancel or complete all bookings first.' 
        },
        { status: 409 }
      )
    }

    // Delete user data in order (respecting foreign key constraints)
    const deleteOperations = [
      supabase.from('reward_transactions').delete().eq('user_id', auth.userId),
      supabase.from('vehicles').delete().eq('user_id', auth.userId),
      supabase.from('bookings').delete().eq('user_id', auth.userId),
      supabase.from('profiles').delete().eq('id', auth.userId),
    ]

    // Execute deletions
    for (const operation of deleteOperations) {
      const { error } = await operation
      if (error) {
        console.error('Deletion error:', error)
        // Continue with other deletions even if one fails
      }
    }

    // Finally delete the auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(auth.userId)
    
    if (authError) {
      console.error('Auth user deletion error:', authError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete account' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    })

  } catch (error) {
    console.error('Profile DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 