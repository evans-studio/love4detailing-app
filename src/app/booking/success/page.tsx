import Link from 'next/link'
import { Button } from "@/components/ui/Button"

export const metadata = {
  title: 'Booking Confirmed | Love 4 Detailing',
  description: 'Your car valeting service booking has been confirmed.',
}

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full p-8 text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-16 w-16 text-success"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for choosing Love4Detailing. We've sent you an email with your booking details.
        </p>
        <div className="space-y-4">
          <Link href="/dashboard" className="block">
            <Button className="w-full" variant="default">
              View Booking Details
            </Button>
          </Link>
          <Link href="/" className="block">
            <Button className="w-full" variant="outline">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 