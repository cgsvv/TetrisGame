# Supabase 安全配置指南

## 1. 启用 Row Level Security (RLS)

在 Supabase SQL 编辑器中运行：

```sql
-- 启用 RLS
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取排行榜（只读）
CREATE POLICY "Allow public read access" ON leaderboard
  FOR SELECT USING (true);

-- 允许插入分数，但限制频率
CREATE POLICY "Allow public insert with rate limit" ON leaderboard
  FOR INSERT WITH CHECK (
    -- 可以添加更多验证逻辑
    username IS NOT NULL AND 
    LENGTH(username) <= 50 AND
    score > 0
  );

-- 禁止更新和删除（保护数据完整性）
CREATE POLICY "No updates allowed" ON leaderboard
  FOR UPDATE USING (false);

CREATE POLICY "No deletes allowed" ON leaderboard
  FOR DELETE USING (false);
```

## 2. 添加速率限制

在 Supabase Edge Functions 中实现：

```typescript
// supabase/functions/rate-limit/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { username, score } = await req.json()
  
  // 检查用户提交频率
  const { data: recentSubmissions } = await supabase
    .from('leaderboard')
    .select('created_at')
    .eq('username', username)
    .gte('created_at', new Date(Date.now() - 60000).toISOString()) // 1分钟内
  
  if (recentSubmissions && recentSubmissions.length >= 3) {
    return new Response(
      JSON.stringify({ error: '提交过于频繁，请稍后再试' }),
      { status: 429 }
    )
  }
  
  // 继续处理提交
})
```

## 3. 数据验证

在前端添加验证：

```typescript
// 用户名验证
const validateUsername = (username: string) => {
  if (!username || username.length > 50) {
    throw new Error('用户名长度必须在1-50字符之间')
  }
  if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
    throw new Error('用户名只能包含字母、数字、下划线和中文')
  }
}

// 分数验证
const validateScore = (score: number) => {
  if (score < 0 || score > 999999999) {
    throw new Error('分数无效')
  }
}
```

## 4. 监控和日志

```sql
-- 创建审计日志表
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  action VARCHAR(50) NOT NULL,
  table_name VARCHAR(50) NOT NULL,
  record_id INTEGER,
  username VARCHAR(50),
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创建触发器记录所有操作
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

## 5. 环境变量管理

```bash
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# 生产环境使用不同的 key
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

## 6. 定期安全审查

- 监控 API 调用频率
- 检查异常数据模式
- 定期更新依赖包
- 审查访问日志 