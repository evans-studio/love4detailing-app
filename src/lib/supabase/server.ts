import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_OPTIONS } from './config'

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
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              console.error('Error setting cookie:', error)
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.delete({ name, ...options })
            } catch (error) {
              console.error('Error removing cookie:', error)
            }
          },
        },
      }
    )
  } catch (error) {
    console.error('Error creating Supabase server client:', error)
    throw new Error('Failed to initialize Supabase server client')
  }
} 