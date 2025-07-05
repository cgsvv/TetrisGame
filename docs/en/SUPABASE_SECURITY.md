# Supabase Security Configuration Guide

[中文版 / Chinese Version](../zh/SUPABASE_SECURITY_CN.md)

## 1. Enable Row Level Security (RLS)

Run in the Supabase SQL Editor:

```sql
-- Enable RLS
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read leaderboard (read-only)
CREATE POLICY "Allow public read access" ON leaderboard
  FOR SELECT USING (true);

-- Allow score insertion with rate limiting
CREATE POLICY "Allow public insert with rate limit" ON leaderboard
  FOR INSERT WITH CHECK (
    -- You can add more validation logic
    username IS NOT NULL AND 
    LENGTH(username) <= 50 AND
    score > 0
  );

-- Prevent updates and deletes (protect data integrity)
CREATE POLICY "No updates allowed" ON leaderboard
  FOR UPDATE USING (false);

CREATE POLICY "No deletes allowed" ON leaderboard
  FOR DELETE USING (false);
```

## 2. Add Rate Limiting

Implement in Supabase Edge Functions:

```typescript
// supabase/functions/rate-limit/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { username, score } = await req.json()
  
  // Check user submission frequency
  const { data: recentSubmissions } = await supabase
    .from('leaderboard')
    .select('created_at')
    .eq('username', username)
    .gte('created_at', new Date(Date.now() - 60000).toISOString()) // Within 1 minute
  
  if (recentSubmissions && recentSubmissions.length >= 3) {
    return new Response(
      JSON.stringify({ error: 'Too many submissions, please try again later' }),
      { status: 429 }
    )
  }
  
  // Continue processing submission
})
```

## 3. Data Validation

Add validation on the frontend:

```typescript
// Username validation
const validateUsername = (username: string) => {
  if (!username || username.length > 50) {
    throw new Error('Username must be between 1-50 characters')
  }
  if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
    throw new Error('Username can only contain letters, numbers, underscores, and Chinese characters')
  }
}

// Score validation
const validateScore = (score: number) => {
  if (score < 0 || score > 999999999) {
    throw new Error('Invalid score')
  }
}
```

## 4. Monitoring and Logging

```sql
-- Create audit log table
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  action VARCHAR(50) NOT NULL,
  table_name VARCHAR(50) NOT NULL,
  record_id INTEGER,
  username VARCHAR(50),
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create trigger to log all operations
CREATE OR REPLACE FUNCTION log_leaderboard_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (action, table_name, record_id, username)
  VALUES (TG_OP, TG_TABLE_NAME, COALESCE(NEW.id, OLD.id), COALESCE(NEW.username, OLD.username));
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leaderboard_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON leaderboard
  FOR EACH ROW EXECUTE FUNCTION log_leaderboard_changes();
```

## 5. Environment Variable Management

```bash
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Use different key for production
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

## 6. Regular Security Review

- Monitor API call frequency
- Check for abnormal data patterns
- Regularly update dependencies
- Review access logs 