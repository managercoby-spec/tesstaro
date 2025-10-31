// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, key);

export type Database = {
  public: {
    Tables: {
      videos: {
        Row: {
          id: string;
          title: string;
          tags: string[];
          category: string;
          behavior: string;
          env: string;
          time_of_day: string;
          shot: string;
          duration: number;
          resolution: string;
          fps: number;
          url: string;
          thumb: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['videos']['Row'], 'id' | 'created_at'>;
      };
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
      };
      downloads: {
        Row: {
          id: string;
          user_id: string;
          video_id: string;
          created_at: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          status: string;
          plan: string;
          current_period_end: string;
        };
      };
    };
  };
};
