export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          service_type: string
          vehicle_size: string
          date: string
          time: string
          status: string
          created_at: string
          updated_at: string
        }
      }
      vehicle_gallery: {
        Row: {
          id: string
          user_id: string
          image_url: string
          description: string | null
          created_at: string
        }
      }
      rewards: {
        Row: {
          id: string
          user_id: string
          points: number
          type: string
          created_at: string
        }
      }
      working_hours: {
        Row: {
          id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_closed: boolean
        }
      }
      admin_settings: {
        Row: {
          id: string
          booking_interval: number
          max_bookings_per_day: number
          updated_at: string
        }
      }
    }
  }
} 