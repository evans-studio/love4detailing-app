import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_OPTIONS } from './config'
import type { CookieOptions } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const createClient = () => {
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}

export const supabase = createBrowserClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    ...SUPABASE_OPTIONS,
    cookies: {
      get(name: string) {
        if (typeof window === 'undefined') return null
        const cookie = document.cookie
          .split('; ')
          .find(row => row.startsWith(`${name}=`))
        return cookie ? decodeURIComponent(cookie.split('=')[1]) : null
      },
      set(name: string, value: string, options: CookieOptions) {
        if (typeof window === 'undefined') return
        const secure = window.location.protocol === 'https:'
        const sameSite = secure ? '; SameSite=None' : '; SameSite=Lax'
        document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${options.maxAge ?? 3600}${secure ? '; Secure' : ''}${sameSite}`
      },
      remove(name: string) {
        if (typeof window === 'undefined') return
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
      },
    },
  }
)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          phone: string | null
          postcode: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
          postcode?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
          postcode?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          type: 'basic_valet' | 'premium_detail' | 'ultimate_package'
          description: string | null
          price: number
          duration_minutes: number
          features: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'basic_valet' | 'premium_detail' | 'ultimate_package'
          description?: string | null
          price: number
          duration_minutes: number
          features?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'basic_valet' | 'premium_detail' | 'ultimate_package'
          description?: string | null
          price?: number
          duration_minutes?: number
          features?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          service_id: string
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          booking_date: string
          booking_time: string
          postcode: string
          travel_fee: number | null
          total_price: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_id: string
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          booking_date: string
          booking_time: string
          postcode: string
          travel_fee?: number | null
          total_price: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_id?: string
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          booking_date?: string
          booking_time?: string
          postcode?: string
          travel_fee?: number | null
          total_price?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rewards: {
        Row: {
          id: string
          user_id: string
          points: number
          total_earned: number
          total_redeemed: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          points?: number
          total_earned?: number
          total_redeemed?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          points?: number
          total_earned?: number
          total_redeemed?: number
          created_at?: string
          updated_at?: string
        }
      }
      reward_transactions: {
        Row: {
          id: string
          reward_id: string
          booking_id: string | null
          points_change: number
          transaction_type: string
          created_at: string
        }
        Insert: {
          id?: string
          reward_id: string
          booking_id?: string | null
          points_change: number
          transaction_type: string
          created_at?: string
        }
        Update: {
          id?: string
          reward_id?: string
          booking_id?: string | null
          points_change?: number
          transaction_type?: string
          created_at?: string
        }
      }
    }
  }
} 