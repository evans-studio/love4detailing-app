import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { SupabaseProvider } from '@/components/providers/SupabaseProvider'
import { MantineProvider } from '@/components/providers/MantineProvider'
import { Toaster } from '@/components/ui/toaster'
import AppLayout from '@/components/layout/AppLayout'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'Love4Detailing',
  description: 'Premium car valeting services in London',
  themeColor: '#9747FF',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: 'no',
    viewportFit: 'cover',
  },
  formatDetection: {
    telephone: 'no',
  },
  appleWebApp: {
    capable: 'yes',
    statusBarStyle: 'black-translucent',
  },
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
