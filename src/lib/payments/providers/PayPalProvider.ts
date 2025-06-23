import { 
  PaymentProvider, 
  PaymentData, 
  PaymentResult, 
  PaymentConfirmation, 
  RefundResult, 
  PaymentStatus,
  PaymentConfig 
} from '../types'

export class PayPalProvider implements PaymentProvider {
  private clientId: string
  private clientSecret: string
  private sandbox: boolean
  private baseUrl: string

  constructor(config: PaymentConfig) {
    this.clientId = config.clientId || process.env.PAYPAL_CLIENT_ID || ''
    this.clientSecret = config.secretKey || process.env.PAYPAL_CLIENT_SECRET || ''
    this.sandbox = config.sandbox ?? process.env.NODE_ENV !== 'production'
    this.baseUrl = this.sandbox 
      ? 'https://api-m.sandbox.paypal.com' 
      : 'https://api-m.paypal.com'
  }

  async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')
    
    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    })

    const data = await response.json()
    return data.access_token
  }

  async createPayment(data: PaymentData): Promise<PaymentResult> {
    try {
      const accessToken = await this.getAccessToken()
      
      const orderData = {
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: data.bookingId,
          description: data.description,
          amount: {
            currency_code: data.currency.toUpperCase(),
            value: data.amount.toFixed(2)
          },
          custom_id: data.bookingId
        }],
        application_context: {
          brand_name: 'Love4Detailing',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/cancelled`
        }
      }

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(orderData)
      })

      const order = await response.json()
      
      if (!response.ok) {
        throw new Error(`PayPal API Error: ${order.message || 'Unknown error'}`)
      }

      const approvalUrl = order.links?.find((link: any) => link.rel === 'approve')?.href

      return {
        paymentId: order.id,
        approvalUrl,
        status: 'pending',
        provider: 'paypal'
      }
    } catch (error) {
      console.error('PayPal createPayment error:', error)
      throw new Error(`Failed to create PayPal payment: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async confirmPayment(paymentId: string): Promise<PaymentConfirmation> {
    try {
      const accessToken = await this.getAccessToken()
      
      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${paymentId}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      })

      const captureData = await response.json()
      
      if (!response.ok) {
        throw new Error(`PayPal capture error: ${captureData.message || 'Unknown error'}`)
      }

      const capture = captureData.purchase_units[0].payments.captures[0]
      
      return {
        paymentId,
        transactionId: capture.id,
        amount: parseFloat(capture.amount.value),
        currency: capture.amount.currency_code,
        status: capture.status === 'COMPLETED' ? 'completed' : 'failed',
        paidAt: new Date(capture.create_time),
        fees: capture.seller_receivable_breakdown?.paypal_fee?.value 
          ? parseFloat(capture.seller_receivable_breakdown.paypal_fee.value) 
          : undefined
      }
    } catch (error) {
      console.error('PayPal confirmPayment error:', error)
      throw new Error(`Failed to confirm PayPal payment: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async refundPayment(paymentId: string, amount?: number): Promise<RefundResult> {
    try {
      const accessToken = await this.getAccessToken()
      
      // First get the capture ID from the order
      const orderResponse = await fetch(`${this.baseUrl}/v2/checkout/orders/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      })
      
      const orderData = await orderResponse.json()
      const captureId = orderData.purchase_units[0].payments.captures[0].id

      const refundData: any = {}
      if (amount) {
        refundData.amount = {
          value: amount.toFixed(2),
          currency_code: orderData.purchase_units[0].amount.currency_code
        }
      }

      const response = await fetch(`${this.baseUrl}/v2/payments/captures/${captureId}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(refundData)
      })

      const refund = await response.json()
      
      if (!response.ok) {
        throw new Error(`PayPal refund error: ${refund.message || 'Unknown error'}`)
      }

      return {
        refundId: refund.id,
        paymentId,
        amount: parseFloat(refund.amount.value),
        status: refund.status === 'COMPLETED' ? 'completed' : 'pending',
        refundedAt: refund.status === 'COMPLETED' ? new Date(refund.create_time) : undefined
      }
    } catch (error) {
      console.error('PayPal refundPayment error:', error)
      throw new Error(`Failed to refund PayPal payment: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      const accessToken = await this.getAccessToken()
      
      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      })

      const order = await response.json()
      
      if (!response.ok) {
        throw new Error(`PayPal get status error: ${order.message || 'Unknown error'}`)
      }

      let status: 'pending' | 'completed' | 'failed' | 'cancelled' = 'pending'
      
      switch (order.status) {
        case 'COMPLETED':
          status = 'completed'
          break
        case 'CANCELLED':
          status = 'cancelled'
          break
        case 'PAYER_ACTION_REQUIRED':
        case 'CREATED':
        case 'SAVED':
        case 'APPROVED':
          status = 'pending'
          break
        default:
          status = 'failed'
      }

      return {
        paymentId,
        status,
        amount: parseFloat(order.purchase_units[0].amount.value),
        currency: order.purchase_units[0].amount.currency_code,
        createdAt: new Date(order.create_time),
        updatedAt: new Date(order.update_time)
      }
    } catch (error) {
      console.error('PayPal getPaymentStatus error:', error)
      throw new Error(`Failed to get PayPal payment status: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
} 