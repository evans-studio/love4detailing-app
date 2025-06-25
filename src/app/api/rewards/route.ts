import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()

    const { data: rewards, error } = await supabase
      .from('rewards')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching rewards:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(rewards)
  } catch (error) {
    console.error('Error in rewards API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 