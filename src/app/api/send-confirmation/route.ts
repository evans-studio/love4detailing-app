import { NextResponse } from 'next/server'
import emailjs from '@emailjs/browser'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, cc, booking } = body

    const templateParams = {
      to_email: to,
      cc_email: cc,
      booking_date: booking.date,
      booking_time: booking.timeSlot,
      vehicle_size: booking.vehicleSize,
      add_ons: booking.addOns.join(', ') || 'None',
      travel_fee: booking.travelFee ? `£${booking.travelFee}` : 'No fee',
      total_price: `£${booking.totalPrice}`,
      customer_name: booking.fullName,
      postcode: booking.postcode,
    }

    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      templateParams,
      process.env.EMAILJS_USER_ID!
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    )
  }
} 