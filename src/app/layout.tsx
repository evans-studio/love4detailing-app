import { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { SupabaseProvider } from '@/components/providers/SupabaseProvider'
import { SidebarProvider } from '@/components/layout/SidebarContext'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

export const metadata: Metadata = {
  title: 'Love4Detailing',
  description: 'Professional car detailing services in South West London',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="min-h-screen bg-background text-foreground">
        <SupabaseProvider>
          <SidebarProvider>
            {children}
            <Toaster />
          </SidebarProvider>
        </SupabaseProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
