# 反作弊实现指南

[English Version](../en/ANTI_CHEAT_GUIDE.md)

## 概述

本文档概述了服务器端方块生成和会话管理的实现，以防止俄罗斯方块游戏中的作弊行为。当前客户端架构容易受到各种作弊方法的影响，本指南提供了实现强大反作弊措施的路线图。

## 当前漏洞

### 1. 客户端方块生成
```typescript
// 当前易受攻击的实现
export const generateNextPiece = (): TetrominoType => {
  return getRandomTetromino(); // 使用客户端 Math.random()
};
```

**漏洞：**
- 玩家可以预测即将到来的方块
- 作弊者可以修改方块序列以偏向简单方块
- 无法验证方块分布的公平性
- 无法检测方块操作

### 2. 客户端会话管理
```typescript
// 当前易受攻击的方法
const clientSession = {
  sessionId: "client-generated-id",
  events: [...], // 客户端生成的事件
  pieces: [...]  // 客户端生成的方块
};
```

**漏洞：**
- 玩家可以伪造会话数据
- 无法验证游戏事件的真实性
- 没有防止重放攻击的保护
- 客户端控制所有游戏状态

### 3. 无验证的分数提交
```typescript
// 当前易受攻击的提交
await submitScore({
  username: "player",
  score: 50000, // 没有验证分数是如何获得的
  level: 10,
  lines: 50
});
```

**漏洞：**
- 没有分数计算验证
- 无法检测不可能的分数
- 没有防止分数操作的保护
- 没有会话完整性验证

## 建议解决方案：服务器端会话管理

### 架构概述

```
┌─────────────┐    会话请求    ┌─────────────┐
│   客户端    │ ─────────────► │   服务器    │
│             │                │             │
│             │ ◄── 会话数据 ── │             │
│             │                │             │
│             │    分数+会话ID  │             │
│             │ ─────────────► │             │
│             │                │             │
│             │ ◄── 验证 ────── │             │
└─────────────┘                └─────────────┘
```

### 1. 服务器端会话创建

#### 会话管理器类
```typescript
interface GameSession {
  sessionId: string;
  pieceSequence: TetrominoType[];
  currentPieceIndex: number;
  startTime: number;
  gameEvents: GameEvent[];
  finalScore: number | null;
  username?: string;
}

class GameSessionManager {
  private sessions = new Map<string, GameSession>();
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30分钟
  private readonly PIECE_SEQUENCE_LENGTH = 1000;

  createSession(): { sessionId: string, pieceSequence: TetrominoType[] } {
    const sessionId = this.generateSecureSessionId();
    const pieceSequence = this.generatePieceSequence();
    
    const session: GameSession = {
      sessionId,
      pieceSequence,
      currentPieceIndex: 0,
      startTime: Date.now(),
      gameEvents: [],
      finalScore: null
    };
    
    this.sessions.set(sessionId, session);
    
    // 清理过期会话
    this.cleanupExpiredSessions();
    
    return { sessionId, pieceSequence };
  }

  private generateSecureSessionId(): string {
    return `sess_${crypto.randomUUID()}_${Date.now()}`;
  }

  private generatePieceSequence(): TetrominoType[] {
    const pieces: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    const sequence: TetrominoType[] = [];
    
    // 确保公平分布（7袋系统）
    for (let bag = 0; bag < Math.ceil(this.PIECE_SEQUENCE_LENGTH / 7); bag++) {
      const bagPieces = [...pieces];
      // 洗牌
      for (let i = bagPieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bagPieces[i], bagPieces[j]] = [bagPieces[j], bagPieces[i]];
      }
      sequence.push(...bagPieces);
    }
    
    return sequence.slice(0, this.PIECE_SEQUENCE_LENGTH);
  }

  getSession(sessionId: string): GameSession | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    
    // 检查会话是否过期
    if (Date.now() - session.startTime > this.SESSION_TIMEOUT) {
      this.sessions.delete(sessionId);
      return null;
    }
    
    return session;
  }

  private cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.startTime > this.SESSION_TIMEOUT) {
        this.sessions.delete(sessionId);
      }
    }
  }
}
```

#### API端点
```typescript
// POST /api/game/start-session
app.post('/api/game/start-session', (req, res) => {
  try {
    const sessionManager = new GameSessionManager();
    const { sessionId, pieceSequence } = sessionManager.createSession();
    
    res.json({
      success: true,
      sessionId,
      pieceSequence
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建会话失败'
    });
  }
});

// GET /api/game/session/:sessionId
app.get('/api/game/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const sessionManager = new GameSessionManager();
  const session = sessionManager.getSession(sessionId);
  
  if (!session) {
    return res.status(404).json({
      success: false,
      error: '会话未找到或已过期'
    });
  }
  
  res.json({
    success: true,
    session: {
      sessionId: session.sessionId,
      startTime: session.startTime,
      currentPieceIndex: session.currentPieceIndex
    }
  });
});
```

### 2. 客户端集成

#### 会话管理钩子
```typescript
// hooks/useGameSession.ts
interface GameSession {
  sessionId: string;
  pieceSequence: TetrominoType[];
  currentPieceIndex: number;
}

export const useGameSession = () => {
  const [session, setSession] = useState<GameSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startNewSession = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/game/start-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('创建会话失败');
      }
      
      const { sessionId, pieceSequence } = await response.json();
      
      setSession({
        sessionId,
        pieceSequence,
        currentPieceIndex: 0
      });
      
      return { sessionId, pieceSequence };
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getNextPiece = (): TetrominoType | null => {
    if (!session) return null;
    
    if (session.currentPieceIndex >= session.pieceSequence.length) {
      // 向服务器请求更多方块
      requestMorePieces(session.sessionId);
      return null;
    }
    
    const piece = session.pieceSequence[session.currentPieceIndex];
    setSession(prev => prev ? {
      ...prev,
      currentPieceIndex: prev.currentPieceIndex + 1
    } : null);
    
    return piece;
  };

  const requestMorePieces = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/game/session/${sessionId}/pieces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const { additionalPieces } = await response.json();
        setSession(prev => prev ? {
          ...prev,
          pieceSequence: [...prev.pieceSequence, ...additionalPieces]
        } : null);
      }
    } catch (error) {
      console.error('请求更多方块失败:', error);
    }
  };

  return {
    session,
    loading,
    error,
    startNewSession,
    getNextPiece
  };
};
```

#### 修改后的游戏状态钩子
```typescript
// hooks/useGameState.ts (修改后)
export const useGameState = () => {
  const { session, startNewSession, getNextPiece } = useGameSession();
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = useCallback(async () => {
    try {
      await startNewSession();
      dispatch({ type: 'START_GAME' });
    } catch (error) {
      console.error('启动游戏会话失败:', error);
    }
  }, [startNewSession]);

  // 修改后的方块生成
  const generateNextPiece = useCallback((): TetrominoType => {
    const piece = getNextPiece();
    if (!piece) {
      // 如果服务器失败，回退到客户端生成
      return getRandomTetromino();
    }
    return piece;
  }, [getNextPiece]);

  // ... 钩子的其余实现
};
```

### 3. 分数验证系统

#### 服务器端验证
```typescript
// validation/scoreValidator.ts
interface ScoreValidationResult {
  valid: boolean;
  reason?: string;
  expectedScore?: number;
  actualScore?: number;
}

class ScoreValidator {
  private readonly TOLERANCE = 0.01; // 1% 浮点误差容差

  validateScore(
    sessionId: string,
    submittedScore: number,
    level: number,
    lines: number
  ): ScoreValidationResult {
    const sessionManager = new GameSessionManager();
    const session = sessionManager.getSession(sessionId);
    
    if (!session) {
      return {
        valid: false,
        reason: '会话未找到或已过期'
      };
    }
    
    if (session.finalScore !== null) {
      return {
        valid: false,
        reason: '会话已提交'
      };
    }
    
    // 基于方块序列和游戏事件计算预期分数
    const expectedScore = this.calculateExpectedScore(
      session.pieceSequence,
      level,
      lines
    );
    
    const scoreDifference = Math.abs(expectedScore - submittedScore);
    const tolerance = submittedScore * this.TOLERANCE;
    
    if (scoreDifference > tolerance) {
      return {
        valid: false,
        reason: '分数不匹配',
        expectedScore,
        actualScore: submittedScore
      };
    }
    
    return {
      valid: true,
      expectedScore,
      actualScore: submittedScore
    };
  }

  private calculateExpectedScore(
    pieceSequence: TetrominoType[],
    level: number,
    lines: number
  ): number {
    // 基于以下因素实现分数计算逻辑：
    // - 使用的方块类型（I方块给更多分数）
    // - 消除的行数
    // - 等级倍数
    // - Tetris奖励
    
    let score = 0;
    let linesCleared = 0;
    
    // 基于方块序列模拟游戏
    for (const piece of pieceSequence) {
      // 计算此方块可能消除的行数
      const potentialLines = this.calculatePotentialLines(piece, level);
      linesCleared += potentialLines;
      
      // 计算此方块的分数
      score += this.calculatePieceScore(piece, potentialLines, level);
      
      if (linesCleared >= lines) break;
    }
    
    return score;
  }

  private calculatePotentialLines(piece: TetrominoType, level: number): number {
    // 实现计算方块可以消除多少行的逻辑
    // 这是简化版本 - 实际实现会更复杂
    const lineChances = {
      'I': 0.4, // I方块有更高的消除行机会
      'O': 0.1,
      'T': 0.2,
      'S': 0.2,
      'Z': 0.2,
      'J': 0.15,
      'L': 0.15
    };
    
    return Math.random() < lineChances[piece] ? 1 : 0;
  }

  private calculatePieceScore(
    piece: TetrominoType,
    linesCleared: number,
    level: number
  ): number {
    const baseScores = {
      'I': 100,
      'O': 50,
      'T': 75,
      'S': 75,
      'Z': 75,
      'J': 75,
      'L': 75
    };
    
    const lineMultipliers = [0, 100, 300, 500, 800]; // 0, 1, 2, 3, 4行
    
    const baseScore = baseScores[piece];
    const lineBonus = lineMultipliers[linesCleared] || 0;
    const levelMultiplier = level + 1;
    
    return (baseScore + lineBonus) * levelMultiplier;
  }
}
```

#### 增强的分数提交
```typescript
// lib/leaderboard.ts (修改后)
export const submitScore = async (scoreData: ScoreSubmission & { sessionId: string }): Promise<LeaderboardEntry> => {
  // 首先验证分数
  const validator = new ScoreValidator();
  const validation = validator.validateScore(
    scoreData.sessionId,
    scoreData.score,
    scoreData.level,
    scoreData.lines
  );
  
  if (!validation.valid) {
    throw new Error(`分数验证失败: ${validation.reason}`);
  }
  
  // 如果验证通过，提交到数据库
  const { data, error } = await supabase
    .from('leaderboard')
    .insert([{
      username: scoreData.username,
      score: scoreData.score,
      level: scoreData.level,
      lines: scoreData.lines,
      session_id: scoreData.sessionId,
      validated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    throw new Error(`提交分数失败: ${error.message}`);
  }

  return data;
};
```

### 4. 高级反作弊措施

#### 行为分析
```typescript
// analysis/behaviorAnalyzer.ts
interface BehaviorPattern {
  averageMoveTime: number;
  pieceEfficiency: number;
  lineClearRate: number;
  suspiciousPatterns: string[];
}

class BehaviorAnalyzer {
  analyzeGameSession(sessionId: string): BehaviorPattern {
    const session = this.getSession(sessionId);
    if (!session) return null;
    
    const patterns: BehaviorPattern = {
      averageMoveTime: this.calculateAverageMoveTime(session.gameEvents),
      pieceEfficiency: this.calculatePieceEfficiency(session.pieceSequence, session.gameEvents),
      lineClearRate: this.calculateLineClearRate(session.gameEvents),
      suspiciousPatterns: this.detectSuspiciousPatterns(session)
    };
    
    return patterns;
  }

  private detectSuspiciousPatterns(session: GameSession): string[] {
    const patterns: string[] = [];
    
    // 检测不可能的移动速度
    if (this.hasImpossibleMoveSpeed(session.gameEvents)) {
      patterns.push('impossible_move_speed');
    }
    
    // 检测完美方块放置
    if (this.hasPerfectPlacement(session.gameEvents)) {
      patterns.push('perfect_placement');
    }
    
    // 检测可疑的时间模式
    if (this.hasSuspiciousTiming(session.gameEvents)) {
      patterns.push('suspicious_timing');
    }
    
    return patterns;
  }

  private hasImpossibleMoveSpeed(events: GameEvent[]): boolean {
    // 检查对人类玩家来说太快的移动
    const moveEvents = events.filter(e => e.type === 'MOVE_PIECE');
    const moveTimes = moveEvents.map((e, i) => {
      if (i === 0) return 0;
      return e.timestamp - moveEvents[i - 1].timestamp;
    });
    
    const averageMoveTime = moveTimes.reduce((a, b) => a + b, 0) / moveTimes.length;
    return averageMoveTime < 50; // 平均少于50ms是可疑的
  }

  private hasPerfectPlacement(events: GameEvent[]): boolean {
    // 检查太多完美方块放置
    const placementEvents = events.filter(e => e.type === 'PLACE_PIECE');
    const perfectPlacements = placementEvents.filter(e => e.data?.perfectPlacement);
    
    const perfectRate = perfectPlacements.length / placementEvents.length;
    return perfectRate > 0.9; // 超过90%完美放置是可疑的
  }

  private hasSuspiciousTiming(events: GameEvent[]): boolean {
    // 检查可疑的时间模式
    const timestamps = events.map(e => e.timestamp);
    const intervals = timestamps.map((t, i) => {
      if (i === 0) return 0;
      return t - timestamps[i - 1];
    });
    
    // 检查太规律的时间间隔（机器人行为）
    const regularIntervals = intervals.filter(i => Math.abs(i - 100) < 10);
    const regularityRate = regularIntervals.length / intervals.length;
    
    return regularityRate > 0.8; // 超过80%规律间隔是可疑的
  }
}
```

#### 速率限制和冷却时间
```typescript
// middleware/rateLimiter.ts
class RateLimiter {
  private submissions = new Map<string, number[]>();
  private readonly MAX_SUBMISSIONS_PER_HOUR = 10;
  private readonly MIN_SUBMISSION_INTERVAL = 60 * 1000; // 1分钟

  canSubmitScore(username: string): boolean {
    const now = Date.now();
    const userSubmissions = this.submissions.get(username) || [];
    
    // 移除旧提交（超过1小时）
    const recentSubmissions = userSubmissions.filter(
      timestamp => now - timestamp < 60 * 60 * 1000
    );
    
    // 检查速率限制
    if (recentSubmissions.length >= this.MAX_SUBMISSIONS_PER_HOUR) {
      return false;
    }
    
    // 检查最小间隔
    if (recentSubmissions.length > 0) {
      const lastSubmission = recentSubmissions[recentSubmissions.length - 1];
      if (now - lastSubmission < this.MIN_SUBMISSION_INTERVAL) {
        return false;
      }
    }
    
    return true;
  }

  recordSubmission(username: string): void {
    const now = Date.now();
    const userSubmissions = this.submissions.get(username) || [];
    userSubmissions.push(now);
    this.submissions.set(username, userSubmissions);
  }
}
```

## 实施阶段

### 第一阶段：基本服务器端会话管理
- [ ] 创建会话创建的服务器端点
- [ ] 实现服务器端方块生成
- [ ] 修改客户端使用服务器提供的方块
- [ ] 向分数提交添加会话验证

### 第二阶段：增强验证
- [ ] 实现分数计算验证
- [ ] 添加行为分析
- [ ] 实现速率限制
- [ ] 添加可疑模式检测

### 第三阶段：高级反作弊
- [ ] 添加实时监控
- [ ] 实现机器学习检测
- [ ] 添加加密验证
- [ ] 创建作弊检测管理仪表板

### 第四阶段：性能优化
- [ ] 实现会话数据缓存
- [ ] 添加连接池
- [ ] 优化数据库查询
- [ ] 为静态资源添加CDN

## 安全考虑

### 1. 会话安全
- 使用加密安全的会话ID
- 实现会话过期
- 防止会话重放攻击
- 验证会话所有权

### 2. 数据完整性
- 为验证哈希方块序列
- 加密签名会话数据
- 验证所有客户端输入
- 为游戏状态实现校验和

### 3. 速率限制
- 限制会话创建速率
- 限制分数提交速率
- 实现渐进式延迟
- 为可疑活动添加CAPTCHA

### 4. 监控和检测
- 记录所有游戏事件
- 监控可疑模式
- 实现自动标记
- 为潜在作弊创建管理员警报

## 性能影响

### 预期变化
- **延迟**: 每个方块请求+50-100ms（通过预生成缓解）
- **带宽**: 每个会话+2-5KB（影响最小）
- **服务器负载**: 验证+10-20% CPU使用率
- **数据库**: 会话数据+5-10%存储

### 缓解策略
- 预生成方块序列
- 实现缓存层
- 使用连接池
- 优化验证算法

## 测试策略

### 单元测试
- 测试方块生成公平性
- 验证分数计算准确性
- 测试会话管理
- 验证速率限制

### 集成测试
- 测试端到端游戏流程
- 验证服务器-客户端通信
- 测试错误处理
- 验证安全措施

### 负载测试
- 测试并发会话创建
- 验证负载下的性能
- 测试速率限制有效性
- 验证系统稳定性

## 结论

实现服务器端方块生成和会话管理为俄罗斯方块游戏防止作弊提供了强大的基础。虽然需要重大的架构更改，但安全效益远远超过实施复杂性。

分阶段方法允许在保持游戏功能和用户体验的同时逐步实施。服务器端验证、行为分析和速率限制的组合创建了多层保护，防止各种作弊方法。

请记住，反作弊系统是一个持续的过程 - 新的作弊方法会出现，系统必须不断更新和改进以保持有效性。 