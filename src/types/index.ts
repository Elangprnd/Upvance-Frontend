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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'organizer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'organizer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'organizer' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      organizers: {
        Row: {
          id: string
          profile_id: string
          org_name: string
          org_logo_url: string | null
          is_verified: boolean
          tier: 'free' | 'pro' | 'enterprise'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          org_name: string
          org_logo_url?: string | null
          is_verified?: boolean
          tier?: 'free' | 'pro' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          org_name?: string
          org_logo_url?: string | null
          is_verified?: boolean
          tier?: 'free' | 'pro' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          organizer_id: string | null
          title: string
          slug: string | null
          category: 'Lomba' | 'Seminar' | 'Workshop' | 'Beasiswa' | 'Magang' | 'Webinar' | 'Lainnya'
          description: string | null
          image_url: string | null
          event_url: string | null
          location: string | null
          is_online: boolean
          is_free: boolean
          price: number
          is_verified: boolean
          is_featured: boolean
          is_published: boolean
          start_date: string | null
          end_date: string | null
          deadline: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organizer_id?: string | null
          title: string
          slug?: string | null
          category: 'Lomba' | 'Seminar' | 'Workshop' | 'Beasiswa' | 'Magang' | 'Webinar' | 'Lainnya'
          description?: string | null
          image_url?: string | null
          event_url?: string | null
          location?: string | null
          is_online?: boolean
          is_free?: boolean
          price?: number
          is_verified?: boolean
          is_featured?: boolean
          is_published?: boolean
          start_date?: string | null
          end_date?: string | null
          deadline?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organizer_id?: string | null
          title?: string
          slug?: string | null
          category?: 'Lomba' | 'Seminar' | 'Workshop' | 'Beasiswa' | 'Magang' | 'Webinar' | 'Lainnya'
          description?: string | null
          image_url?: string | null
          event_url?: string | null
          location?: string | null
          is_online?: boolean
          is_free?: boolean
          price?: number
          is_verified?: boolean
          is_featured?: boolean
          is_published?: boolean
          start_date?: string | null
          end_date?: string | null
          deadline?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bookmarks: {
        Row: { id: string; profile_id: string; event_id: string; created_at: string }
        Insert: { id?: string; profile_id: string; event_id: string; created_at?: string }
        Update: { id?: string; profile_id?: string; event_id?: string; created_at?: string }
      }
      calendar_tokens: {
        Row: { id: string; profile_id: string; access_token: string; refresh_token: string; expires_at: string; created_at: string; updated_at: string }
        Insert: { id?: string; profile_id: string; access_token: string; refresh_token: string; expires_at: string; created_at?: string; updated_at?: string }
        Update: { id?: string; profile_id?: string; access_token?: string; refresh_token?: string; expires_at?: string; created_at?: string; updated_at?: string }
      }
      payments: {
        Row: { id: string; organizer_id: string; amount: number; currency: string; status: 'pending' | 'success' | 'failed' | 'refunded'; payment_method: string | null; gateway_ref: string | null; tier_purchased: 'pro' | 'enterprise'; valid_until: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; organizer_id: string; amount: number; currency?: string; status?: 'pending' | 'success' | 'failed' | 'refunded'; payment_method?: string | null; gateway_ref?: string | null; tier_purchased: 'pro' | 'enterprise'; valid_until?: string | null; created_at?: string; updated_at?: string }
        Update: { id?: string; organizer_id?: string; amount?: number; currency?: string; status?: 'pending' | 'success' | 'failed' | 'refunded'; payment_method?: string | null; gateway_ref?: string | null; tier_purchased?: 'pro' | 'enterprise'; valid_until?: string | null; created_at?: string; updated_at?: string }
      }
    }
  }
}