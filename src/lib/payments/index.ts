// Main exports
export { PaymentManager, getPaymentManager, switchPaymentProvider } from './PaymentManager'

// Types
export type {
  PaymentData,
  PaymentResult,
  PaymentConfirmation,
  RefundResult,
  PaymentStatus,
  PaymentProvider,
  PaymentProviderType,
  PaymentConfig
} from './types'

// Providers (for direct access if needed)
export { PayPalProvider } from './providers/PayPalProvider'
export { StripeProvider } from './providers/StripeProvider'

// Convenience functions
export { getPaymentManager as createPaymentManager } from './PaymentManager' 