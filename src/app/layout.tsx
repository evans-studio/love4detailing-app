import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { SupabaseProvider } from '@/components/providers/SupabaseProvider'
import { MantineProvider } from '@/components/providers/MantineProvider'
import { ClientProvider } from '@/components/providers/ClientProvider'
import { Toaster } from '@/components/ui/toaster'
import AppLayout from '@/components/layout/AppLayout'
import { Viewport } from 'next'
import PremiumLoadingProvider from '@/components/providers/PremiumLoadingProvider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

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
}

export const viewport: Viewport = {
  themeColor: '#9747FF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
      inter.variable,
      "font-sans antialiased",
      "[&_*]:!transition-[background-color]",
      "motion-reduce:transform-none motion-reduce:transition-none"
    )} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SupabaseProvider>
          <MantineProvider>
            <ClientProvider>
              <PremiumLoadingProvider initialDelay={100} duration={3000}>
                <AppLayout>
                  {children}
                </AppLayout>
              </PremiumLoadingProvider>
              <Toaster />
            </ClientProvider>
          </MantineProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
