# Anti-Cheat Implementation Guide

[中文版 / Chinese Version](../zh/ANTI_CHEAT_GUIDE_CN.md)

## Overview

This document outlines the implementation of server-side piece generation and session management to prevent cheating in the Tetris game. The current client-side architecture is vulnerable to various cheating methods, and this guide provides a roadmap for implementing robust anti-cheat measures.

## Current Vulnerabilities

### 1. Client-Side Piece Generation
```typescript
// Current vulnerable implementation
export const generateNextPiece = (): TetrominoType => {
  return getRandomTetromino(); // Uses Math.random() client-side
};
```

**Vulnerabilities:**
- Players can predict upcoming pieces
- Cheaters can modify piece sequences to favor easy pieces
- Impossible to verify piece distribution fairness
- No way to detect piece manipulation

### 2. Client-Side Session Management
```typescript
// Current vulnerable approach
const clientSession = {
  sessionId: "client-generated-id",
  events: [...], // Client-generated events
  pieces: [...]  // Client-generated pieces
};
```

**Vulnerabilities:**
- Players can fake session data
- Impossible to verify game event authenticity
- No protection against replay attacks
- Client controls all game state

### 3. Score Submission Without Validation
```typescript
// Current vulnerable submission
await submitScore({
  username: "player",
  score: 50000, // No validation of how score was achieved
  level: 10,
  lines: 50
});
```

**Vulnerabilities:**
- No verification of score calculation
- Impossible to detect impossible scores
- No protection against score manipulation
- No session integrity validation

## Proposed Solution: Server-Side Session Management

### Architecture Overview

```
┌─────────────┐    Session Request    ┌─────────────┐
│   Client    │ ────────────────────► │   Server    │
│             │                       │             │
│             │ ◄── Session Data ──── │             │
│             │                       │             │
│             │    Score + SessionId  │             │
│             │ ────────────────────► │             │
│             │                       │             │
│             │ ◄── Validation ────── │             │
└─────────────┘                       └─────────────┘
```

### 1. Server-Side Session Creation

#### Session Manager Class
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
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
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
    
    // Clean up old sessions
    this.cleanupExpiredSessions();
    
    return { sessionId, pieceSequence };
  }

  private generateSecureSessionId(): string {
    return `sess_${crypto.randomUUID()}_${Date.now()}`;
  }

  private generatePieceSequence(): TetrominoType[] {
    const pieces: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    const sequence: TetrominoType[] = [];
    
    // Ensure fair distribution (7-bag system)
    for (let bag = 0; bag < Math.ceil(this.PIECE_SEQUENCE_LENGTH / 7); bag++) {
      const bagPieces = [...pieces];
      // Shuffle bag
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
    
    // Check if session is expired
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

#### API Endpoints
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
      error: 'Failed to create session'
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
      error: 'Session not found or expired'
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

### 2. Client-Side Integration

#### Session Management Hook
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
        throw new Error('Failed to create session');
      }
      
      const { sessionId, pieceSequence } = await response.json();
      
      setSession({
        sessionId,
        pieceSequence,
        currentPieceIndex: 0
      });
      
      return { sessionId, pieceSequence };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getNextPiece = (): TetrominoType | null => {
    if (!session) return null;
    
    if (session.currentPieceIndex >= session.pieceSequence.length) {
      // Request more pieces from server
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
      console.error('Failed to request more pieces:', error);
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

#### Modified Game State Hook
```typescript
// hooks/useGameState.ts (modified)
export const useGameState = () => {
  const { session, startNewSession, getNextPiece } = useGameSession();
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = useCallback(async () => {
    try {
      await startNewSession();
      dispatch({ type: 'START_GAME' });
    } catch (error) {
      console.error('Failed to start game session:', error);
    }
  }, [startNewSession]);

  // Modified piece generation
  const generateNextPiece = useCallback((): TetrominoType => {
    const piece = getNextPiece();
    if (!piece) {
      // Fallback to client-side generation if server fails
      return getRandomTetromino();
    }
    return piece;
  }, [getNextPiece]);

  // ... rest of the hook implementation
};
```

### 3. Score Validation System

#### Server-Side Validation
```typescript
// validation/scoreValidator.ts
interface ScoreValidationResult {
  valid: boolean;
  reason?: string;
  expectedScore?: number;
  actualScore?: number;
}

class ScoreValidator {
  private readonly TOLERANCE = 0.01; // 1% tolerance for floating point errors

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
        reason: 'Session not found or expired'
      };
    }
    
    if (session.finalScore !== null) {
      return {
        valid: false,
        reason: 'Session already submitted'
      };
    }
    
    // Calculate expected score based on piece sequence and game events
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
        reason: 'Score mismatch',
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
    // Implement score calculation logic based on:
    // - Piece types used (I-pieces give more points)
    // - Lines cleared
    // - Level multiplier
    // - Tetris bonuses
    
    let score = 0;
    let linesCleared = 0;
    
    // Simulate game based on piece sequence
    for (const piece of pieceSequence) {
      // Calculate potential lines cleared with this piece
      const potentialLines = this.calculatePotentialLines(piece, level);
      linesCleared += potentialLines;
      
      // Calculate score for this piece
      score += this.calculatePieceScore(piece, potentialLines, level);
      
      if (linesCleared >= lines) break;
    }
    
    return score;
  }

  private calculatePotentialLines(piece: TetrominoType, level: number): number {
    // Implement logic to calculate how many lines a piece can clear
    // This is a simplified version - real implementation would be more complex
    const lineChances = {
      'I': 0.4, // I-piece has higher chance of clearing lines
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
    
    const lineMultipliers = [0, 100, 300, 500, 800]; // 0, 1, 2, 3, 4 lines
    
    const baseScore = baseScores[piece];
    const lineBonus = lineMultipliers[linesCleared] || 0;
    const levelMultiplier = level + 1;
    
    return (baseScore + lineBonus) * levelMultiplier;
  }
}
```

#### Enhanced Score Submission
```typescript
// lib/leaderboard.ts (modified)
export const submitScore = async (scoreData: ScoreSubmission & { sessionId: string }): Promise<LeaderboardEntry> => {
  // First validate the score
  const validator = new ScoreValidator();
  const validation = validator.validateScore(
    scoreData.sessionId,
    scoreData.score,
    scoreData.level,
    scoreData.lines
  );
  
  if (!validation.valid) {
    throw new Error(`Score validation failed: ${validation.reason}`);
  }
  
  // If validation passes, submit to database
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
    throw new Error(`Failed to submit score: ${error.message}`);
  }

  return data;
};
```

### 4. Advanced Anti-Cheat Measures

#### Behavioral Analysis
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
    
    // Detect impossible move speeds
    if (this.hasImpossibleMoveSpeed(session.gameEvents)) {
      patterns.push('impossible_move_speed');
    }
    
    // Detect perfect piece placement
    if (this.hasPerfectPlacement(session.gameEvents)) {
      patterns.push('perfect_placement');
    }
    
    // Detect suspicious timing patterns
    if (this.hasSuspiciousTiming(session.gameEvents)) {
      patterns.push('suspicious_timing');
    }
    
    return patterns;
  }

  private hasImpossibleMoveSpeed(events: GameEvent[]): boolean {
    // Check for moves that are too fast for human players
    const moveEvents = events.filter(e => e.type === 'MOVE_PIECE');
    const moveTimes = moveEvents.map((e, i) => {
      if (i === 0) return 0;
      return e.timestamp - moveEvents[i - 1].timestamp;
    });
    
    const averageMoveTime = moveTimes.reduce((a, b) => a + b, 0) / moveTimes.length;
    return averageMoveTime < 50; // Less than 50ms average is suspicious
  }

  private hasPerfectPlacement(events: GameEvent[]): boolean {
    // Check for too many perfect piece placements
    const placementEvents = events.filter(e => e.type === 'PLACE_PIECE');
    const perfectPlacements = placementEvents.filter(e => e.data?.perfectPlacement);
    
    const perfectRate = perfectPlacements.length / placementEvents.length;
    return perfectRate > 0.9; // More than 90% perfect placement is suspicious
  }

  private hasSuspiciousTiming(events: GameEvent[]): boolean {
    // Check for suspicious timing patterns
    const timestamps = events.map(e => e.timestamp);
    const intervals = timestamps.map((t, i) => {
      if (i === 0) return 0;
      return t - timestamps[i - 1];
    });
    
    // Check for too regular intervals (bot-like behavior)
    const regularIntervals = intervals.filter(i => Math.abs(i - 100) < 10);
    const regularityRate = regularIntervals.length / intervals.length;
    
    return regularityRate > 0.8; // More than 80% regular intervals is suspicious
  }
}
```

#### Rate Limiting and Cooldowns
```typescript
// middleware/rateLimiter.ts
class RateLimiter {
  private submissions = new Map<string, number[]>();
  private readonly MAX_SUBMISSIONS_PER_HOUR = 10;
  private readonly MIN_SUBMISSION_INTERVAL = 60 * 1000; // 1 minute

  canSubmitScore(username: string): boolean {
    const now = Date.now();
    const userSubmissions = this.submissions.get(username) || [];
    
    // Remove old submissions (older than 1 hour)
    const recentSubmissions = userSubmissions.filter(
      timestamp => now - timestamp < 60 * 60 * 1000
    );
    
    // Check rate limit
    if (recentSubmissions.length >= this.MAX_SUBMISSIONS_PER_HOUR) {
      return false;
    }
    
    // Check minimum interval
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

## Implementation Phases

### Phase 1: Basic Server-Side Session Management
- [ ] Create server endpoints for session creation
- [ ] Implement server-side piece generation
- [ ] Modify client to use server-provided pieces
- [ ] Add session validation to score submission

### Phase 2: Enhanced Validation
- [ ] Implement score calculation validation
- [ ] Add behavioral analysis
- [ ] Implement rate limiting
- [ ] Add suspicious pattern detection

### Phase 3: Advanced Anti-Cheat
- [ ] Add real-time monitoring
- [ ] Implement machine learning detection
- [ ] Add cryptographic verification
- [ ] Create admin dashboard for cheat detection

### Phase 4: Performance Optimization
- [ ] Implement caching for session data
- [ ] Add connection pooling
- [ ] Optimize database queries
- [ ] Add CDN for static assets

## Security Considerations

### 1. Session Security
- Use cryptographically secure session IDs
- Implement session expiration
- Prevent session replay attacks
- Validate session ownership

### 2. Data Integrity
- Hash piece sequences for verification
- Sign session data cryptographically
- Validate all client inputs
- Implement checksums for game state

### 3. Rate Limiting
- Limit session creation rate
- Limit score submission rate
- Implement progressive delays
- Add CAPTCHA for suspicious activity

### 4. Monitoring and Detection
- Log all game events
- Monitor for suspicious patterns
- Implement automated flagging
- Create admin alerts for potential cheats

## Performance Impact

### Expected Changes
- **Latency**: +50-100ms per piece request (mitigated by pre-generation)
- **Bandwidth**: +2-5KB per session (minimal impact)
- **Server Load**: +10-20% CPU usage for validation
- **Database**: +5-10% storage for session data

### Mitigation Strategies
- Pre-generate piece sequences
- Implement caching layers
- Use connection pooling
- Optimize validation algorithms

## Testing Strategy

### Unit Tests
- Test piece generation fairness
- Validate score calculation accuracy
- Test session management
- Verify rate limiting

### Integration Tests
- Test end-to-end game flow
- Validate server-client communication
- Test error handling
- Verify security measures

### Load Tests
- Test concurrent session creation
- Validate performance under load
- Test rate limiting effectiveness
- Verify system stability

## Conclusion

Implementing server-side piece generation and session management provides a robust foundation for preventing cheating in the Tetris game. While it requires significant architectural changes, the security benefits far outweigh the implementation complexity.

The phased approach allows for gradual implementation while maintaining game functionality and user experience. The combination of server-side validation, behavioral analysis, and rate limiting creates multiple layers of protection against various cheating methods.

Remember that anti-cheat systems are an ongoing process - new cheating methods will emerge, and the system must be continuously updated and improved to maintain effectiveness. 