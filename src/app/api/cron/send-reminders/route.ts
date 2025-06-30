import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { EMAIL } from '@/lib/constants'
import { emailService } from '@/lib/email/service'
import type { BookingData } from '@/lib/schemas'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Vercel Cron authentication
const cronSecret = process.env.CRON_SECRET

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${cronSecret}`) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    
    // Skip if reminders are disabled
    if (!EMAIL.reminders.enabled) {
      return NextResponse.json({ success: true, message: 'Reminders disabled' })
    }
    
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get date ranges for 24h and 1h reminders
    const now = new Date()
    
    // 24h reminder range (tomorrow's bookings)
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const tomorrowEnd = new Date(tomorrow)
    tomorrowEnd.setHours(23, 59, 59, 999)
    
    // 1h reminder range (bookings in the next hour)
    const oneHourLater = new Date(now)
    oneHourLater.setHours(oneHourLater.getHours() + 1)
    
    // Get bookings for both reminder types
    const { data: bookings24h, error: error24h } = await supabase
      .from('bookings')
      .select('*')
      .eq('reminderSent24h', false)
      .gte('date', tomorrow.toISOString())
      .lte('date', tomorrowEnd.toISOString())
      .not('status', 'eq', 'cancelled')
    
    const { data: bookings1h, error: error1h } = await supabase
      .from('bookings')
      .select('*')
      .eq('reminderSent1h', false)
      .gte('date', now.toISOString())
      .lte('date', oneHourLater.toISOString())
      .not('status', 'eq', 'cancelled')
    
    if (error24h || error1h) {
      console.error('Failed to fetch bookings:', { error24h, error1h })
      return NextResponse.json(
        { success: false, error: 'Failed to fetch bookings' },
        { status: 500 }
      )
    }
    
    // Send reminders and update reminder status
    const results24h = await Promise.allSettled(
      (bookings24h || []).map(async (booking: BookingData) => {
        try {
          if (EMAIL.reminders.schedule['24h']) {
            // TODO: Implement sendBookingReminder method
            // await emailService.sendBookingReminder(booking)
            console.log('24h reminder would be sent for booking:', booking.id)
          }
          
          await supabase
            .from('bookings')
            .update({ reminderSent24h: true })
            .eq('id', booking.id)
            
          return { success: true, bookingId: booking.id, type: '24h' }
        } catch (error) {
          console.error(`Failed to send 24h reminder for booking ${booking.id}:`, error)
          return { success: false, bookingId: booking.id, type: '24h', error }
        }
      })
    )
    
    const results1h = await Promise.allSettled(
      (bookings1h || []).map(async (booking: BookingData) => {
        try {
          if (EMAIL.reminders.schedule['1h']) {
            // TODO: Implement sendBookingReminder method
            // await emailService.sendBookingReminder(booking)
            console.log('1h reminder would be sent for booking:', booking.id)
          }
          
          await supabase
            .from('bookings')
            .update({ reminderSent1h: true })
            .eq('id', booking.id)
            
          return { success: true, bookingId: booking.id, type: '1h' }
        } catch (error) {
          console.error(`Failed to send 1h reminder for booking ${booking.id}:`, error)
          return { success: false, bookingId: booking.id, type: '1h', error }
        }
      })
    )
    
    // Count successes and failures
    const succeeded24h = results24h.filter(r => r.status === 'fulfilled').length
    const failed24h = results24h.filter(r => r.status === 'rejected').length
    const succeeded1h = results1h.filter(r => r.status === 'fulfilled').length
    const failed1h = results1h.filter(r => r.status === 'rejected').length
    
    return NextResponse.json({
      success: true,
      '24h': {
        sent: succeeded24h,
        failed: failed24h,
        total: bookings24h?.length || 0,
      },
      '1h': {
        sent: succeeded1h,
        failed: failed1h,
        total: bookings1h?.length || 0,
      },
    })
  } catch (error) {
    console.error('Reminder scheduler error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 