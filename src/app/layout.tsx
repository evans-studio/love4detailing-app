import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import AppLayout from '@/components/layout/AppLayout'
import { ClientProvider } from '@/components/providers/ClientProvider'
import config from '@/config/config'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'Love4Detailing',
  description: 'Premium car valeting services in London',
  keywords: 'car valeting, car detailing, car cleaning, London',
  authors: [{ name: 'Love4Detailing' }],
  creator: 'Love4Detailing',
  publisher: 'Love4Detailing',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://love4detailing.co.uk',
    title: 'Love4Detailing',
    description: 'Premium car valeting services in London',
    siteName: 'Love4Detailing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Love4Detailing',
    description: 'Premium car valeting services in London',
    creator: '@love4detailing',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body className="font-sans">
        <ClientProvider>
          <AppLayout sidebarContent={config.content.sidebar}>
            {children}
            <Analytics />
            <SpeedInsights />
          </AppLayout>
        </ClientProvider>
      </body>
    </html>
  )
}
