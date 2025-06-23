import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import { SupabaseProvider } from '@/components/providers/SupabaseProvider'
import AppLayout from '@/components/layout/AppLayout'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Love4Detailing - Mobile Car Valeting Services',
  description: 'Professional mobile car valeting and detailing services that come to you.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn(
      "dark",
      inter.variable
    )} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SupabaseProvider>
          <AppLayout>
            {children}
          </AppLayout>
          <Toaster />
        </SupabaseProvider>
      </body>
    </html>
  )
}
