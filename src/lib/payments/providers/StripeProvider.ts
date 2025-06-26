import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export class StripeProvider {
  private stripe: Stripe

  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable')
    }
    this.stripe = stripe
  }

  async createPayment(amount: number, currency: string = 'GBP', metadata: Record<string, string> = {}) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata,
      })

      return {
        success: true,
        paymentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      }
    } catch (error) {
      console.error('Stripe payment creation error:', error)
      throw error
    }
  }

  async cancelPayment(paymentId: string) {
    try {
      await this.stripe.paymentIntents.cancel(paymentId)
      return { success: true }
    } catch (error) {
      console.error('Stripe payment cancellation error:', error)
      throw error
    }
  }

  async refundPayment(paymentId: string, amount?: number) {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      })

      return {
        success: true,
        refundId: refund.id,
      }
    } catch (error) {
      console.error('Stripe refund error:', error)
      throw error
    }
  }

  async getPaymentStatus(paymentId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId)
      return {
        success: true,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100, // Convert from cents
      }
    } catch (error) {
      console.error('Stripe payment status error:', error)
      throw error
    }
  }
}

/* 
FUTURE STRIPE IMPLEMENTATION NOTES:
When ready to implement Stripe, here's the structure:

1. Install Stripe SDK: npm install stripe
2. Import Stripe: import Stripe from 'stripe'
3. Initialize: this.stripe = new Stripe(this.apiKey)
4. Create Payment Intent:
   const paymentIntent = await this.stripe.paymentIntents.create({
     amount: data.amount * 100, // Stripe uses cents
     currency: data.currency,
     metadata: { bookingId: data.bookingId }
   })
5. Return PaymentResult with clientSecret for frontend
6. Handle webhooks for confirmation
7. Implement refunds and status checks

This structure ensures easy migration from PayPal to Stripe when needed.
*/ 