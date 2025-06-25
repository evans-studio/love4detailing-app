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

    switch (paypalEvent.event_type) {
      case 'CHECKOUT.ORDER.APPROVED':
        // Order was approved by customer
        const orderId = paypalEvent.resource.id
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
        // Payment was captured successfully
        const captureId = paypalEvent.resource.id
        const parentPayment = paypalEvent.resource.supplementary_data?.related_ids?.order_id
        
        console.log('PayPal payment captured:', captureId, 'for order:', parentPayment)
        
        if (parentPayment) {
          // Update booking to confirmed
          await supabase
            .from('bookings')
            .update({ 
              status: 'confirmed',
              payment_status: 'completed',
              transaction_id: captureId,
              paid_at: new Date(paypalEvent.resource.create_time).toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('payment_id', parentPayment)
        }
        
        break

      case 'PAYMENT.CAPTURE.DENIED':
        // Payment was denied
        const deniedOrderId = paypalEvent.resource.supplementary_data?.related_ids?.order_id
        
        console.log('PayPal payment denied for order:', deniedOrderId)
        
        if (deniedOrderId) {
          await supabase
            .from('bookings')
            .update({ 
              status: 'cancelled',
              payment_status: 'failed',
              updated_at: new Date().toISOString()
            })
            .eq('payment_id', deniedOrderId)
        }
        
        break

      case 'PAYMENT.CAPTURE.REFUNDED':
        // Payment was refunded
        const refundOrderId = paypalEvent.resource.supplementary_data?.related_ids?.order_id
        
        console.log('PayPal payment refunded for order:', refundOrderId)
        
        if (refundOrderId) {
          await supabase
            .from('bookings')
            .update({ 
              status: 'refunded',
              payment_status: 'refunded',
              updated_at: new Date().toISOString()
            })
            .eq('payment_id', refundOrderId)
        }
        
        break

      default:
        console.log('Unhandled PayPal webhook event:', paypalEvent.event_type)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('PayPal webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
} 