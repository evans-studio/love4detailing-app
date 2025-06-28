'use client'

import { cn } from '@/lib/utils'
import ClientLayout from '@/components/layout/ClientLayout'

export const metadata = {
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
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={cn('min-h-screen bg-background font-sans antialiased')}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
