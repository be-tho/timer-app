import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nivpieyyzlochnbtgtir.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseAnonKey) {
  throw new Error('Missing Supabase ANON KEY environment variable')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para TypeScript
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          total_time: number
          rate_per_hour: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          total_time?: number
          rate_per_hour: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          total_time?: number
          rate_per_hour?: number
          created_at?: string
          updated_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          project_id: string
          start_time: string
          end_time: string | null
          duration: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          start_time: string
          end_time?: string | null
          duration?: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          start_time?: string
          end_time?: string | null
          duration?: number
          notes?: string | null
          created_at?: string
        }
      }
    }
  }
}
