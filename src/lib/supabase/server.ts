import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: { name: string; value: string; [key: string]: any }) {
          try {
            cookieStore.set(options)
          } catch (error) {
            // Handle cookie errors silently
          }
        },
        remove(name: string, options: { name: string; [key: string]: any }) {
          try {
            cookieStore.delete(options)
          } catch (error) {
            // Handle cookie errors silently
          }
        },
      },
    }
  )
} 