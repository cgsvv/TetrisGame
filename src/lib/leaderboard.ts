import { supabase, LeaderboardEntry, ScoreSubmission } from './supabase';

// 获取排行榜数据
export const getLeaderboard = async (limit: number = 20): Promise<LeaderboardEntry[]> => {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch leaderboard: ${error.message}`);
  }

  return data || [];
};

// 提交分数
export const submitScore = async (scoreData: ScoreSubmission): Promise<LeaderboardEntry> => {
  const { data, error } = await supabase
    .from('leaderboard')
    .insert([scoreData])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to submit score: ${error.message}`);
  }

  return data;
};

// 检查用户是否已存在
export const checkUsernameExists = async (username: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('id')
    .eq('username', username)
    .limit(1);

  if (error) {
    throw new Error(`Failed to check username: ${error.message}`);
  }

  return data && data.length > 0;
};

// 获取用户最高分
export const getUserBestScore = async (username: string): Promise<LeaderboardEntry | null> => {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('username', username)
    .order('score', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    throw new Error(`Failed to get user best score: ${error.message}`);
  }

  return data;
}; 