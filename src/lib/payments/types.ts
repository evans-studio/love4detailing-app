export interface PaymentData {
  amount: number
  currency: string
  bookingId: string
  customerEmail: string
  customerName: string
  description: string
  metadata?: Record<string, any>
}

export interface PaymentResult {
  paymentId: string
  clientSecret?: string
  approvalUrl?: string
  status: 'pending' | 'completed' | 'failed'
  provider: 'paypal' | 'stripe' | 'revolut'
}

export interface PaymentConfirmation {
  paymentId: string
  transactionId: string
  amount: number
  currency: string
  status: 'completed' | 'failed'
  paidAt: Date
  fees?: number
  metadata?: Record<string, any>
}

export interface RefundResult {
  refundId: string
  paymentId: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  refundedAt?: Date
}

export interface PaymentStatus {
  paymentId: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  amount: number
  currency: string
  createdAt: Date
  updatedAt: Date
}

export interface PaymentProvider {
  createPayment(data: PaymentData): Promise<PaymentResult>
  confirmPayment(paymentId: string): Promise<PaymentConfirmation>
  refundPayment(paymentId: string, amount?: number): Promise<RefundResult>
  getPaymentStatus(paymentId: string): Promise<PaymentStatus>
}

export type PaymentProviderType = 'paypal' | 'stripe' | 'revolut'

export interface PaymentConfig {
  provider: PaymentProviderType
  sandbox?: boolean
  apiKey?: string
  secretKey?: string
  clientId?: string
  webhookSecret?: string
} 