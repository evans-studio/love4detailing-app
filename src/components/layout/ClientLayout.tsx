'use client'

import { SupabaseProvider } from '@/components/providers/SupabaseProvider'
import { MantineProvider } from '@/components/providers/MantineProvider'
import { ClientProvider } from '@/components/providers/ClientProvider'
import { Toaster } from '@/components/ui/toaster'
import AppLayout from '@/components/layout/AppLayout'
import PremiumLoadingProvider from '@/components/providers/PremiumLoadingProvider'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <MantineProvider>
        <ClientProvider>
          <PremiumLoadingProvider>
            <AppLayout>{children}</AppLayout>
          </PremiumLoadingProvider>
          <Toaster />
        </ClientProvider>
      </MantineProvider>
    </SupabaseProvider>
  )
} 