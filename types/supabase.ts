export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cards: {
        Row: {
          collection_id: number
          content: string
          explanation: string
          id: number
          inserted_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          collection_id: number
          content: string
          explanation: string
          id?: number
          inserted_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          collection_id?: number
          content?: string
          explanation?: string
          id?: number
          inserted_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      collections: {
        Row: {
          description: string | null
          id: number
          inserted_at: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          description?: string | null
          id?: number
          inserted_at?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          description?: string | null
          id?: number
          inserted_at?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
      }
      feedback: {
        Row: {
          feedback: string | null
          id: number
          inserted_at: string
          rating: number | null
          user_id: string | null
        }
        Insert: {
          feedback?: string | null
          id?: number
          inserted_at?: string
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          feedback?: string | null
          id?: number
          inserted_at?: string
          rating?: number | null
          user_id?: string | null
        }
      }
      profiles: {
        Row: {
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
