import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  email: string;
  is_pro: boolean;
  created_at: string;
}

export interface RoastRecord {
  id: string;
  user_id: string | null;
  overall_score: number;
  grade: string;
  roast_headline: string;
  badges: string[];
  categories: any;
  created_at: string;
}

export interface Stats {
  id: string;
  roast_count: number;
  updated_at: string;
}
