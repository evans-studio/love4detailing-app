import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication | Love4Detailing',
  description: 'Sign in or create an account to manage your bookings.',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-[#9747FF]/10 to-[#141414] opacity-50" />
      <div className="relative w-full">
        {children}
      </div>
    </div>
  )
} 