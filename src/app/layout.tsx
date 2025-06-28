import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { SupabaseProvider } from '@/components/providers/SupabaseProvider'
import { MantineProvider } from '@/components/providers/MantineProvider'
import { Toaster } from '@/components/ui/toaster'
import AppLayout from '@/components/layout/AppLayout'
import { Viewport } from 'next'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'Love4Detailing',
  description: 'Premium car valeting services in London',
  formatDetection: {
    telephone: 'no',
  },
  appleWebApp: {
    capable: 'yes',
    statusBarStyle: 'black-translucent',
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
