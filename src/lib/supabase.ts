import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 排行榜数据类型
export interface LeaderboardEntry {
  id: number;
  username: string;
  score: number;
  level: number;
  lines: number;
  created_at: string;
}

// 提交分数类型
export interface ScoreSubmission {
  username: string;
  score: number;
  level: number;
  lines: number;
} 