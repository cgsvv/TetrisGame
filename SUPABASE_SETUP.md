# Supabase Setup Guide

[中文版 / Chinese Version](SUPABASE_SETUP_CN.md)

## 1. Create Supabase Project

1. Visit [supabase.com](https://supabase.com)
2. Register/Login to your account
3. Create a new project
4. Wait for project initialization to complete

## 2. Create Database Table

Run the following SQL in the Supabase SQL Editor:

```sql
-- Create leaderboard table
CREATE TABLE leaderboard (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL,
  level INTEGER NOT NULL,
  lines INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX idx_leaderboard_username ON leaderboard(username);
CREATE INDEX idx_leaderboard_created_at ON leaderboard(created_at DESC);
```

## 3. Get API Keys

1. In your Supabase project dashboard, go to "Settings" > "API"
2. Copy the "Project URL" and "anon public" key

## 4. Configure Environment Variables

1. Copy `env.example` to `.env.local`
2. Fill in your Supabase configuration:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 5. Set Up RLS Policies (Optional)

If you need stricter data access control, you can set up Row Level Security:

```sql
-- Enable RLS
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read leaderboard
CREATE POLICY "Allow public read access" ON leaderboard
  FOR SELECT USING (true);

-- Allow everyone to insert scores
CREATE POLICY "Allow public insert" ON leaderboard
  FOR INSERT WITH CHECK (true);
```

## 6. Test

Start the development server:

```bash
npm run dev
```

Now you can:
- Play the game and submit scores
- View the leaderboard
- Sort data on the leaderboard page 