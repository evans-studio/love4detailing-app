import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_OPTIONS } from './config'
import { CookieOptions } from '@supabase/ssr'

interface CookieError extends Error {
  code?: string;
  name: string;
  message: string;
}

export function createClient() {
  try {
    const cookieStore = cookies()
    
    return createServerClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        ...SUPABASE_OPTIONS,
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              const cookieError = error as CookieError
              console.error('Error setting cookie:', cookieError.message)
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.delete({ name, ...options })
            } catch (error) {
              const cookieError = error as CookieError
              console.error('Error removing cookie:', cookieError.message)
            }
          },
        },
      }
    )
  } catch (error) {
    const serverError = error as Error
    console.error('Error creating Supabase server client:', serverError.message)
    throw new Error('Failed to initialize Supabase server client')
  }
} 