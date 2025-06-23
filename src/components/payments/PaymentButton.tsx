"use client"

import { useState } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { Button } from '@/components/ui/Button'
import { Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface PaymentButtonProps {
  bookingData: {
    id: string
    amount: number
    customerEmail: string
    customerName: string
    service: string
    vehicleSize?: string
  }
  onSuccess: (paymentResult: any) => void
  onError?: (error: any) => void
  disabled?: boolean
  provider?: 'paypal' | 'stripe'
}

export default function PaymentButton({ 
  bookingData, 
  onSuccess, 
  onError,
  disabled = false,
  provider = 'paypal'
}: PaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentId, setPaymentId] = useState<string | null>(null)

  const createPayment = async () => {
    try {
      setIsProcessing(true)
      
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: bookingData.id,
          amount: bookingData.amount,
          customerEmail: bookingData.customerEmail,
          customerName: bookingData.customerName,
          service: bookingData.service,
          vehicleSize: bookingData.vehicleSize
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment')
      }

      return data.payment.paymentId
    } catch (error) {
      console.error('Payment creation error:', error)
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to create payment",
        variant: "destructive"
      })
      onError?.(error)
      throw error
    } finally {
      setIsProcessing(false)
    }
  }

  const confirmPayment = async (paymentId: string) => {
    try {
      const response = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId,
          bookingId: bookingData.id
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to confirm payment')
      }

      return data
    } catch (error) {
      console.error('Payment confirmation error:', error)
      toast({
        title: "Payment Confirmation Error",
        description: error instanceof Error ? error.message : "Failed to confirm payment",
        variant: "destructive"
      })
      onError?.(error)
      throw error
    }
  }

  if (provider === 'paypal') {
    return (
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
          currency: 'GBP',
          intent: 'capture'
        }}
      >
        <div className="w-full">
          {isProcessing && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Processing payment...</span>
            </div>
          )}
          
          <PayPalButtons
            disabled={disabled || isProcessing}
            style={{
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'paypal'
            }}
            createOrder={async (data, actions) => {
              const paymentId = await createPayment()
              setPaymentId(paymentId)
              return paymentId
            }}
            onApprove={async (data, actions) => {
              try {
                setIsProcessing(true)
                
                // Capture the payment
                if (actions.order) {
                  const orderData = await actions.order.capture()
                  
                  // Confirm payment on our backend
                  const confirmation = await confirmPayment(data.orderID)
                  
                  toast({
                    title: "Payment Successful!",
                    description: "Your booking has been confirmed.",
                    variant: "default"
                  })
                  
                  const transactionId = orderData.purchase_units?.[0]?.payments?.captures?.[0]?.id
                  
                  onSuccess({
                    paymentId: data.orderID,
                    transactionId,
                    confirmation
                  })
                }
              } catch (error) {
                console.error('Payment approval error:', error)
                onError?.(error)
              } finally {
                setIsProcessing(false)
              }
            }}
            onError={(error) => {
              console.error('PayPal error:', error)
              toast({
                title: "Payment Error",
                description: "There was an issue processing your payment. Please try again.",
                variant: "destructive"
              })
              onError?.(error)
              setIsProcessing(false)
            }}
            onCancel={() => {
              toast({
                title: "Payment Cancelled",
                description: "Your payment was cancelled.",
                variant: "default"
              })
              setIsProcessing(false)
            }}
          />
        </div>
      </PayPalScriptProvider>
    )
  }

  // Stripe implementation (placeholder for future)
  if (provider === 'stripe') {
    return (
      <Button disabled className="w-full">
        Stripe payments coming soon
      </Button>
    )
  }

  return null
} 