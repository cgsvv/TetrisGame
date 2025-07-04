# Supabase 设置指南

[English Version](SUPABASE_SETUP.md)

## 1. 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com)
2. 注册/登录账户
3. 创建新项目
4. 等待项目初始化完成

## 2. 创建数据库表

在 Supabase SQL 编辑器中运行以下 SQL：

```sql
-- 创建排行榜表
CREATE TABLE leaderboard (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL,
  level INTEGER NOT NULL,
  lines INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX idx_leaderboard_username ON leaderboard(username);
CREATE INDEX idx_leaderboard_created_at ON leaderboard(created_at DESC);
```

## 3. 获取 API 密钥

1. 在 Supabase 项目仪表板中，进入 "Settings" > "API"
2. 复制 "Project URL" 和 "anon public" 密钥

## 4. 配置环境变量

1. 复制 `env.example` 为 `.env.local`
2. 填入你的 Supabase 配置：

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 5. 设置 RLS 策略（可选）

如果需要更严格的数据访问控制，可以设置 Row Level Security：

```sql
-- 启用 RLS
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取排行榜
CREATE POLICY "Allow public read access" ON leaderboard
  FOR SELECT USING (true);

-- 允许所有人插入分数
CREATE POLICY "Allow public insert" ON leaderboard
  FOR INSERT WITH CHECK (true);
```

## 6. 测试

启动开发服务器：

```bash
npm run dev
```

现在你可以：
- 玩游戏并提交分数
- 查看排行榜
- 在排行榜页面排序数据 