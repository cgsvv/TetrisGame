# Google Analytics 事件跟踪示例

[English Version](../en/ANALYTICS_EXAMPLE.md)

## Google Analytics 如何跟踪您的游戏事件

### 1. **事件流程示例**

当玩家暂停游戏时：

```javascript
// 1. 玩家按下 'P' 键
// 2. 游戏调用: pauseGame()
// 3. Reducer 处理: 'PAUSE_GAME' 动作
// 4. 分析跟踪: safeTrackGameEvent.gamePause()
// 5. Google Analytics 接收:
gtag('event', 'game_pause', {
  event_category: 'game',
  event_label: undefined,
  value: undefined
});
```

### 2. **跟踪的内容**

#### 游戏事件：
- **游戏开始**: 当玩家开始新游戏时
- **游戏暂停**: 当玩家暂停游戏时
- **游戏恢复**: 当玩家恢复游戏时
- **游戏结束**: 当游戏结束时（包含分数、等级、行数）
- **分数提交**: 当玩家向排行榜提交分数时

#### 设置事件：
- **AI 模式切换**: 当玩家启用/禁用 AI 时
- **速度变化**: 当玩家调整游戏速度时
- **声音切换**: 当玩家开启/关闭声音时
- **语言切换**: 当玩家切换语言时

### 3. **真实数据示例**

#### 游戏结束事件：
```javascript
// 当游戏以 12500 分、5 级、23 行结束时
gtag('event', 'game_over', {
  event_category: 'game',
  event_label: 'score_12500',
  value: 12500
});

gtag('event', 'level_reached', {
  event_category: 'game', 
  event_label: 'level_5',
  value: 5
});

gtag('event', 'lines_cleared', {
  event_category: 'game',
  event_label: 'lines_23', 
  value: 23
});
```

#### 分数提交：
```javascript
// 当玩家提交 12500 分时
gtag('event', 'score_submit', {
  event_category: 'leaderboard',
  event_label: 'score_12500',
  value: 12500
});
```

### 4. **在哪里查看数据**

#### 在 Google Analytics 4 中：

1. **前往**: 报告 → 参与度 → 事件
2. **查找事件如**：
   - `game_start` - 开始了多少游戏
   - `game_pause` - 玩家暂停的频率
   - `game_over` - 游戏完成率
   - `score_submit` - 排行榜参与度
   - `ai_mode_toggle` - AI 功能使用情况
   - `sound_toggle` - 声音偏好
   - `language_change` - 语言偏好

#### 实时报告：

1. **前往**: 报告 → 实时 → 事件
2. **实时查看事件**：
   - 观看玩家开始游戏
   - 查看分数提交时间
   - 监控功能使用情况

### 5. **您可以获得的分析洞察**

#### 玩家行为：
- **最受欢迎的功能**: 玩家最常使用哪些设置
- **游戏完成率**: 多少游戏达到结束
- **会话时长**: 玩家保持参与的时间
- **功能采用**: 多少人使用 AI 模式、声音等

#### 性能指标：
- **热门语言**: 最常使用哪些语言
- **速度偏好**: 玩家偏好什么游戏速度
- **声音使用**: 玩家偏好开启还是关闭声音

#### 参与模式：
- **高峰游戏时间**: 玩家最活跃的时间
- **流失点**: 玩家停止游戏的地方
- **功能发现**: 玩家如何发现和使用功能

### 6. **开发环境 vs 生产环境**

#### 开发模式：
```javascript
// 在开发环境中，事件记录到控制台
console.log('🎮 游戏事件: 游戏暂停');
console.log('🎮 游戏事件: 游戏结束', { score: 12500, level: 5, lines: 23 });
```

#### 生产模式：
```javascript
// 在生产环境中，事件发送到 Google Analytics
gtag('event', 'game_pause', { event_category: 'game' });
gtag('event', 'game_over', { 
  event_category: 'game', 
  event_label: 'score_12500', 
  value: 12500 
});
```

### 7. **您可以创建的自定义报告**

#### 游戏性能报告：
- **指标**: `game_over` 的事件计数
- **维度**: 事件标签（分数范围）
- **洞察**: 玩家分数分布

#### 功能使用报告：
- **指标**: `ai_mode_toggle` 的事件计数
- **维度**: 事件标签（启用/禁用）
- **洞察**: AI 功能采用率

#### 用户参与报告：
- **指标**: `game_start` 的事件计数
- **维度**: 日期
- **洞察**: 每日活跃玩家

### 8. **隐私和 GDPR 合规**

#### 我们跟踪的内容：
- ✅ 游戏事件（无个人数据）
- ✅ 功能使用（匿名）
- ✅ 性能指标（聚合）

#### 我们不跟踪的内容：
- ❌ 个人信息
- ❌ 用户名或分数（仅匿名事件）
- ❌ 个人玩家行为模式

### 9. **设置 Google Analytics**

1. **创建 GA4 属性**：
   - 前往 [Google Analytics](https://analytics.google.com)
   - 创建新属性
   - 获取您的跟踪 ID (G-XXXXXXXXXX)

2. **更新环境变量**：
   ```bash
   # .env.local
   VITE_GA_TRACKING_ID=G-XXXXXXXXXX
   VITE_ANALYTICS_ENABLED=true
   ```

3. **验证跟踪**：
   - 打开浏览器开发者工具
   - 检查网络标签中的 gtag 请求
   - 使用 GA4 DebugView 进行实时测试

### 10. **示例仪表板**

#### 要监控的关键指标：
- **每日活跃玩家**: 每天的 `game_start` 事件
- **游戏完成率**: `game_over` / `game_start`
- **功能采用**: `ai_mode_toggle`, `sound_toggle`
- **排行榜参与**: `score_submit` 事件
- **语言分布**: `language_change` 事件

这个跟踪系统为您提供玩家如何与您的俄罗斯方块游戏互动的全面洞察，帮助您做出数据驱动的改进决策！ 