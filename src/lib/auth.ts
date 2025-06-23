import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'

export type AuthUser = {
  id: string
  email: string
  full_name: string
  created_at: string
}

export type AuthState = {
  user: AuthUser | null
  isLoading: boolean
}

export async function signUp(email: string, password: string, full_name: string) {
  try {
    // First check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.error('Error checking existing user:', checkError)
      throw checkError
    }

    if (existingUser) {
      return { 
        data: null, 
        error: new Error('An account with this email already exists') 
      }
    }

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('Sign up error:', error)
      throw error
    }

    if (!data.user) {
      throw new Error('No user returned from sign up')
    }

    // Wait a moment for the trigger to complete
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Ensure profile exists (fallback if trigger failed)
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', data.user.id)
      .single()

    if (profileCheckError && profileCheckError.code === 'PGRST116') {
      // Profile doesn't exist, create it manually
      console.log('Creating profile manually as trigger may have failed')
      const { error: profileCreateError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          full_name,
          email,
        })

      if (profileCreateError) {
        console.error('Error creating profile manually:', profileCreateError)
        // Don't throw here, as auth user was created successfully
      }
    }

    // Ensure rewards record exists (fallback if trigger failed)
    const { data: existingRewards, error: rewardsCheckError } = await supabase
      .from('rewards')
      .select('id')
      .eq('user_id', data.user.id)
      .single()

    if (rewardsCheckError && rewardsCheckError.code === 'PGRST116') {
      // Rewards record doesn't exist, create it manually
      console.log('Creating rewards record manually as trigger may have failed')
      const { error: rewardsCreateError } = await supabase
        .from('rewards')
        .insert({
          user_id: data.user.id,
          points: 0,
          total_saved: 0.00,
        })

      if (rewardsCreateError) {
        console.error('Error creating rewards manually:', rewardsCreateError)
        // Don't throw here, as auth user was created successfully
      }
    }

    // Link any existing bookings by email
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ user_id: data.user.id })
      .eq('email', email)
      .is('user_id', null)

    if (bookingError) {
      console.error('Booking link error:', bookingError)
      // Don't throw here, as this is not critical
    }

    // Create bookings from localStorage (pending bookings from before signup)
    if (typeof window !== 'undefined') {
      const pendingBookings = JSON.parse(localStorage.getItem('pendingBookings') || '[]')
      const userBookings = pendingBookings.filter((booking: any) => booking.email === email)
      
      if (userBookings.length > 0) {
        // Create booking records for each pending booking
        const bookingInserts = userBookings.map((booking: any) => ({
          user_id: data.user!.id, // We know data.user is not null due to check above
          email: booking.email,
          booking_date: booking.date,
          booking_time: booking.time,
          postcode: booking.postcode,
          total_price: booking.total,
          status: booking.status || 'pending',
          notes: booking.notes || `Customer: ${booking.customer}\\nService: ${booking.service}\\nAdd-ons: ${booking.addOns?.join(', ') || 'None'}`,
          service_id: booking.service, // Use service type as identifier
          created_at: booking.created_at || new Date().toISOString()
        }))

        const { error: createBookingError } = await supabase
          .from('bookings')
          .insert(bookingInserts)

        if (createBookingError) {
          console.error('Error creating bookings from localStorage:', createBookingError)
          // Don't throw here, as this is not critical for account creation
        } else {
          // Clear pending bookings for this email after successful creation
          const remainingBookings = pendingBookings.filter((booking: any) => booking.email !== email)
          localStorage.setItem('pendingBookings', JSON.stringify(remainingBookings))
          
          // Also clear lastBooking if it matches this email
          const lastBooking = JSON.parse(localStorage.getItem('lastBooking') || '{}')
          if (lastBooking.email === email) {
            localStorage.removeItem('lastBooking')
          }
        }
      }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error in signUp function:', error)
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('An unexpected error occurred during sign up') 
    }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error signing in:', error)
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('An unexpected error occurred') 
    }
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
  })
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Fetch user profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (error) {
              console.error('Error fetching profile:', error)
            }
            setAuthState({
              user: profile,
              isLoading: false,
            })
          })
      } else {
        setAuthState({
          user: null,
          isLoading: false,
        })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Fetch user profile from profiles table
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (error) {
            console.error('Error fetching profile:', error)
          }

          setAuthState({
            user: profile,
            isLoading: false,
          })
        } else {
          setAuthState({
            user: null,
            isLoading: false,
          })
        }

        // Refresh server-side data
        router.refresh()
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  return authState
}

export async function requireAuth() {
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error || !session) {
    throw new Error('Unauthorized')
  }
  
  return session
}

export function useProtectedRoute() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this page",
        variant: "destructive",
      })
      router.push('/')
    }
  }, [user, isLoading, router])

  return { user, isLoading }
} 