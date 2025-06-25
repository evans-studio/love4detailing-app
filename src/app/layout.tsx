import type { Metadata, Viewport } from 'next'
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
  metadataBase: new URL('https://love4detailing.vercel.app'),
  openGraph: {
    title: 'Love4Detailing - Mobile Car Valeting Services',
    description: 'Professional mobile car valeting and detailing services that come to you.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#8A2B85',
  // iOS Safari specific
  viewportFit: 'cover',
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
      <head>
        {/* iOS Safari specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Love4Detailing" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* Prevent zoom on input focus */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased touch-manipulation">
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
