import { NextRequest, NextResponse } from 'next/server'
import { getPaymentManager } from '@/lib/payments'
import { createClient } from '@/lib/supabase/server'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const paypalEvent = JSON.parse(body)

    console.log('PayPal webhook received:', paypalEvent.event_type)

    // Verify webhook signature (in production, you should verify this)
    // const signature = request.headers.get('PAYPAL-TRANSMISSION-SIG')
    // TODO: Implement PayPal webhook signature verification

    const supabase = createClient()
    const paymentManager = getPaymentManager()

    let paymentId: string
    let amount: number
    let orderId: string
    let status: string
    let error: string | undefined
    let paymentData: any

    switch (paypalEvent.event_type) {
      case 'CHECKOUT.ORDER.APPROVED':
        // Order was approved by customer
        orderId = paypalEvent.resource.id
        console.log('PayPal order approved:', orderId)
        
        // Update booking status to approved
        await supabase
          .from('bookings')
          .update({ 
            payment_status: 'approved',
            updated_at: new Date().toISOString()
          })
          .eq('payment_id', orderId)
        
        break

      case 'PAYMENT.CAPTURE.COMPLETED':
        paymentId = paypalEvent.resource.id
        orderId = paypalEvent.resource.supplementary_data?.related_ids?.order_id
        amount = parseFloat(paypalEvent.resource.amount.value)
        status = 'completed'
        
        console.log('PayPal payment captured:', paymentId, 'for order:', orderId)
        
        if (orderId) {
          // Update booking to confirmed
          await supabase
            .from('bookings')
            .update({ 
              status: 'confirmed',
              payment_status: 'completed',
              transaction_id: paymentId,
              paid_at: new Date(paypalEvent.resource.create_time).toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('payment_id', orderId)
        }
        
        await paymentManager.updatePayment(paymentId, {
          status,
          amount,
          orderId,
        })
        break

      case 'PAYMENT.CAPTURE.DENIED':
        paymentId = paypalEvent.resource.id
        orderId = paypalEvent.resource.supplementary_data?.related_ids?.order_id
        error = 'Payment was denied'
        status = 'failed'
        
        console.log('PayPal payment denied for order:', orderId)
        
        if (orderId) {
          await supabase
            .from('bookings')
            .update({ 
              status: 'cancelled',
              payment_status: 'failed',
              updated_at: new Date().toISOString()
            })
            .eq('payment_id', orderId)
        }
        
        await paymentManager.updatePayment(paymentId, {
          status,
          error,
          orderId,
        })
        break

      case 'PAYMENT.CAPTURE.REFUNDED':
        paymentId = paypalEvent.resource.id
        orderId = paypalEvent.resource.supplementary_data?.related_ids?.order_id
        status = 'refunded'
        
        console.log('PayPal payment refunded for order:', orderId)
        
        if (orderId) {
          await supabase
            .from('bookings')
            .update({ 
              status: 'refunded',
              payment_status: 'refunded',
              updated_at: new Date().toISOString()
            })
            .eq('payment_id', orderId)
        }
        
        await paymentManager.updatePayment(paymentId, {
          status,
          orderId,
        })
        break

      default:
        console.log('Unhandled PayPal webhook event:', paypalEvent.event_type)
        return NextResponse.json(
          { error: 'Unhandled webhook event' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('PayPal webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 