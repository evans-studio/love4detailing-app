import { NextRequest, NextResponse } from 'next/server'
import { getPaymentManager } from '@/lib/payments'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, amount, customerEmail, customerName, service, vehicleSize } = body

    // Validate required fields
    if (!bookingId || !amount || !customerEmail || !customerName || !service) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get payment manager (defaults to PayPal)
    const paymentManager = getPaymentManager()

    // Create payment using the abstraction layer
    const paymentResult = await paymentManager.createBookingPayment({
      bookingId,
      amount,
      customerEmail,
      customerName,
      service,
      vehicleSize: vehicleSize || 'Medium'
    })

    return NextResponse.json({
      success: true,
      payment: paymentResult
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create payment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 