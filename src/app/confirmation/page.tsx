import { Metadata } from 'next'
import dynamic from 'next/dynamic'

const ConfirmationClient = dynamic(() => import('./ConfirmationClient'), {
  ssr: false,
})

export const metadata: Metadata = {
  title: 'Booking Confirmed | Love4Detailing',
  description: 'Your booking has been confirmed. Thank you for choosing Love4Detailing.',
}

export default function ConfirmationPage() {
  return <ConfirmationClient />
} 