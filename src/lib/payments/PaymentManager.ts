import { 
  PaymentProvider, 
  PaymentData, 
  PaymentResult, 
  PaymentConfirmation, 
  RefundResult, 
  PaymentStatus,
  PaymentConfig,
  PaymentProviderType 
} from './types'
import { PayPalProvider } from './providers/PayPalProvider'
import { StripeProvider } from './providers/StripeProvider'

export class PaymentManager {
  private provider: PaymentProvider
  private providerType: PaymentProviderType

  constructor(providerType: PaymentProviderType = 'paypal', config?: Partial<PaymentConfig>) {
    this.providerType = providerType
    this.provider = this.createProvider(providerType, config)
  }

  private createProvider(type: PaymentProviderType, config?: Partial<PaymentConfig>): PaymentProvider {
    const defaultConfig: PaymentConfig = {
      provider: type,
      sandbox: process.env.NODE_ENV !== 'production',
      ...config
    }

    switch (type) {
      case 'paypal':
        return new PayPalProvider(defaultConfig)
      case 'stripe':
        return new StripeProvider(defaultConfig)
      case 'revolut':
        throw new Error('Revolut provider not implemented yet')
      default:
        throw new Error(`Unsupported payment provider: ${type}`)
    }
  }

  // Switch payment provider at runtime
  switchProvider(newProviderType: PaymentProviderType, config?: Partial<PaymentConfig>) {
    this.providerType = newProviderType
    this.provider = this.createProvider(newProviderType, config)
  }

  getCurrentProvider(): PaymentProviderType {
    return this.providerType
  }

  // Unified payment methods - same interface regardless of provider
  async createPayment(data: PaymentData): Promise<PaymentResult> {
    return this.provider.createPayment(data)
  }

  async confirmPayment(paymentId: string): Promise<PaymentConfirmation> {
    return this.provider.confirmPayment(paymentId)
  }

  async refundPayment(paymentId: string, amount?: number): Promise<RefundResult> {
    return this.provider.refundPayment(paymentId, amount)
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    return this.provider.getPaymentStatus(paymentId)
  }

  // Convenience method for creating a booking payment
  async createBookingPayment(bookingData: {
    bookingId: string
    amount: number
    customerEmail: string
    customerName: string
    service: string
    vehicleSize: string
  }): Promise<PaymentResult> {
    const paymentData: PaymentData = {
      amount: bookingData.amount,
      currency: 'GBP',
      bookingId: bookingData.bookingId,
      customerEmail: bookingData.customerEmail,
      customerName: bookingData.customerName,
      description: `Love4Detailing - ${bookingData.service} (${bookingData.vehicleSize})`,
      metadata: {
        service: bookingData.service,
        vehicleSize: bookingData.vehicleSize
      }
    }

    return this.createPayment(paymentData)
  }
}

// Singleton instance for app-wide use
let paymentManager: PaymentManager | null = null

export function getPaymentManager(): PaymentManager {
  if (!paymentManager) {
    // Default to PayPal, can be changed via environment variable
    const defaultProvider = (process.env.PAYMENT_PROVIDER as PaymentProviderType) || 'paypal'
    paymentManager = new PaymentManager(defaultProvider)
  }
  return paymentManager
}

// Helper function to switch payment provider globally
export function switchPaymentProvider(newProvider: PaymentProviderType, config?: Partial<PaymentConfig>) {
  const manager = getPaymentManager()
  manager.switchProvider(newProvider, config)
  console.log(`Payment provider switched to: ${newProvider}`)
} 