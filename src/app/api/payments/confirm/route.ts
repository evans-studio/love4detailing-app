import { NextRequest, NextResponse } from 'next/server'
import { getPaymentManager } from '@/lib/payments'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentId, bookingId } = body

    if (!paymentId || !bookingId) {
      return NextResponse.json(
        { error: 'Missing paymentId or bookingId' },
        { status: 400 }
      )
    }

    // Get payment manager
    const paymentManager = getPaymentManager()

    // Confirm payment with the provider
    const confirmation = await paymentManager.confirmPayment(paymentId)

    if (confirmation.status === 'completed') {
      // Update booking status in database
      const supabase = createClient()
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ 
          status: 'confirmed',
          payment_id: paymentId,
          payment_status: 'completed',
          payment_provider: paymentManager.getCurrentProvider(),
          transaction_id: confirmation.transactionId,
          paid_at: confirmation.paidAt.toISOString()
        })
        .eq('id', bookingId)

      if (updateError) {
        console.error('Database update error:', updateError)
        // Payment succeeded but DB update failed - this needs manual review
        return NextResponse.json({
          success: true,
          warning: 'Payment completed but booking status update failed',
          confirmation
        })
      }

      return NextResponse.json({
        success: true,
        confirmation,
        message: 'Payment completed and booking confirmed'
      })
    } else {
      return NextResponse.json(
        { 
          error: 'Payment confirmation failed',
          status: confirmation.status
        },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Payment confirmation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to confirm payment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 