import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'admin' | 'supervisor' | 'operator' | 'dispatcher' | 'driver' | 'auditor';
          phone?: string;
          truck_assigned?: string;
          avatar?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role: 'admin' | 'supervisor' | 'operator' | 'dispatcher' | 'driver' | 'auditor';
          phone?: string;
          truck_assigned?: string;
          avatar?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: 'admin' | 'supervisor' | 'operator' | 'dispatcher' | 'driver' | 'auditor';
          phone?: string;
          truck_assigned?: string;
          avatar?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      truck_processes: {
        Row: {
          id: string;
          truck_no: string;
          dispatch_id: string;
          is_royalty: boolean;
          current_stage: 'gate' | 'loading' | 'weigh_in' | 'weigh_out' | 'departed' | 'delivered';
          driver_id: string;
          start_time: string;
          estimated_delivery_time?: string;
          actual_delivery_time?: string;
          status: 'in_process' | 'delivered' | 'exception';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          truck_no: string;
          dispatch_id: string;
          is_royalty: boolean;
          current_stage: 'gate' | 'loading' | 'weigh_in' | 'weigh_out' | 'departed' | 'delivered';
          driver_id: string;
          start_time: string;
          estimated_delivery_time?: string;
          actual_delivery_time?: string;
          status: 'in_process' | 'delivered' | 'exception';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          truck_no?: string;
          dispatch_id?: string;
          is_royalty?: boolean;
          current_stage?: 'gate' | 'loading' | 'weigh_in' | 'weigh_out' | 'departed' | 'delivered';
          driver_id?: string;
          start_time?: string;
          estimated_delivery_time?: string;
          actual_delivery_time?: string;
          status?: 'in_process' | 'delivered' | 'exception';
          created_at?: string;
          updated_at?: string;
        };
      };
      truck_stages: {
        Row: {
          id: string;
          truck_process_id: string;
          stage: string;
          timestamp: string;
          operator: string;
          completed: boolean;
          royalty_code?: string;
          video_url?: string;
          notes?: string;
          media?: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          truck_process_id: string;
          stage: string;
          timestamp: string;
          operator: string;
          completed: boolean;
          royalty_code?: string;
          video_url?: string;
          notes?: string;
          media?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          truck_process_id?: string;
          stage?: string;
          timestamp?: string;
          operator?: string;
          completed?: boolean;
          royalty_code?: string;
          video_url?: string;
          notes?: string;
          media?: string[];
          created_at?: string;
        };
      };
      delivery_proofs: {
        Row: {
          id: string;
          truck_process_id: string;
          photo_url: string;
          video_url?: string;
          timestamp: string;
          location?: string;
          notes?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          truck_process_id: string;
          photo_url: string;
          video_url?: string;
          timestamp: string;
          location?: string;
          notes?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          truck_process_id?: string;
          photo_url?: string;
          video_url?: string;
          timestamp?: string;
          location?: string;
          notes?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
