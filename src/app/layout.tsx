'use client'

import type { Metadata, Viewport } from 'next'
import '@mantine/core/styles.css'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import { SupabaseProvider } from '@/components/providers/SupabaseProvider'
import { MantineProvider } from '@/components/providers/MantineProvider'
import AppLayout from '@/components/layout/AppLayout'
import { Inter } from 'next/font/google'
import { useEffect } from 'react'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Love4Detailing - Mobile Car Valeting Services',
  description: 'Professional mobile car valeting and detailing services that come to you.',
  other: {
    'format-detection': 'telephone=no',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: 'cover'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Debug Info:', {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
          visualViewport: window.visualViewport ? {
            width: window.visualViewport.width,
            height: window.visualViewport.height,
            offsetTop: window.visualViewport.offsetTop,
            offsetLeft: window.visualViewport.offsetLeft,
            scale: window.visualViewport.scale,
          } : 'Not supported',
        },
        userAgent: window.navigator.userAgent,
        platform: window.navigator.platform,
        safeAreaInsets: getComputedStyle(document.documentElement).getPropertyValue('--sat'),
      });
    }
  }, []);

  return (
    <html lang="en" className={cn(
      "dark",
      inter.variable
    )} suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#9747FF" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SupabaseProvider>
          <MantineProvider>
            <AppLayout>
              {children}
            </AppLayout>
            <Toaster />
          </MantineProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
