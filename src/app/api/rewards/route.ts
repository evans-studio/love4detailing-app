import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rewardsSchema } from '@/lib/schemas/api'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's rewards with specific fields only
    const { data: rewards, error: rewardsError } = await supabase
      .from('rewards')
      .select('id, points, total_saved, created_at, updated_at')
      .eq('user_id', user.id)
      .single()

    if (rewardsError) {
      console.error('Error fetching rewards:', rewardsError)
      return NextResponse.json(
        { error: 'Failed to fetch rewards' },
        { status: 500 }
      )
    }

    return NextResponse.json(rewards || { points: 0, total_saved: 0 })
  } catch (error) {
    console.error('Rewards GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate request body
    const body = await request.json()
    const validationResult = rewardsSchema.safeParse({
      ...body,
      user_id: user.id // Ensure user_id matches authenticated user
    })

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { points, total_saved } = validationResult.data

    // Create rewards history entry
    const { error: historyError } = await supabase
      .from('rewards_history')
      .insert({
        user_id: user.id,
        points_change: points,
        total_saved_change: total_saved,
        action: 'manual_update',
        notes: 'Manual update via API'
      })

    if (historyError) {
      console.error('Error creating rewards history:', historyError)
      return NextResponse.json(
        { error: 'Failed to update rewards history' },
        { status: 500 }
      )
    }

    // Update or create rewards record
    const { error: upsertError } = await supabase
      .from('rewards')
      .upsert({
        user_id: user.id,
        points,
        total_saved
      }, {
        onConflict: 'user_id'
      })

    if (upsertError) {
      console.error('Error updating rewards:', upsertError)
      return NextResponse.json(
        { error: 'Failed to update rewards' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Rewards POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current rewards
    const { data: currentRewards, error: fetchError } = await supabase
      .from('rewards')
      .select('points, total_saved')
      .eq('user_id', user.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') { // Ignore not found error
      console.error('Error fetching current rewards:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch current rewards' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { points_change = 0, total_saved_change = 0 } = body

    // Calculate new values
    const newPoints = (currentRewards?.points || 0) + points_change
    const newTotalSaved = (currentRewards?.total_saved || 0) + total_saved_change

    // Validate new values
    const validationResult = rewardsSchema.safeParse({
      user_id: user.id,
      points: newPoints,
      total_saved: newTotalSaved
    })

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid rewards values', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    // Create rewards history entry
    const { error: historyError } = await supabase
      .from('rewards_history')
      .insert({
        user_id: user.id,
        points_change,
        total_saved_change,
        action: 'increment',
        notes: 'Incremental update via API'
      })

    if (historyError) {
      console.error('Error creating rewards history:', historyError)
      return NextResponse.json(
        { error: 'Failed to update rewards history' },
        { status: 500 }
      )
    }

    // Update rewards
    const { error: updateError } = await supabase
      .from('rewards')
      .upsert({
        user_id: user.id,
        points: newPoints,
        total_saved: newTotalSaved
      }, {
        onConflict: 'user_id'
      })

    if (updateError) {
      console.error('Error updating rewards:', updateError)
      return NextResponse.json(
        { error: 'Failed to update rewards' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      points: newPoints,
      total_saved: newTotalSaved
    })
  } catch (error) {
    console.error('Rewards PATCH error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 