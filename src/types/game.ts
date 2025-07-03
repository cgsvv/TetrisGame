// 方块类型
export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

// 方块形状定义
export type TetrominoShape = number[][];

// 游戏状态
export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameOver';

// AI等级
export type AILevel = 'easy' | 'normal' | 'hard';

// 方块位置
export interface Position {
  x: number;
  y: number;
}

// 当前方块状态
export interface CurrentPiece {
  type: TetrominoType;
  position: Position;
  shape: TetrominoShape;
}

// AI决策结果
export interface AIDecision {
  position: Position;
  shape: TetrominoShape;
  score: number;
}

// 游戏状态
export interface GameState {
  board: number[][];
  currentPiece: CurrentPiece | null;
  nextPiece: TetrominoType;
  score: number;
  level: number;
  lines: number;
  status: GameStatus;
  dropTime: number;
  dropSpeed: number;
  manualSpeed: number; // 手动调整的速度
  aiMode: boolean; // AI模式开关
  aiThinking: boolean; // AI是否正在思考
  aiLevel: AILevel; // AI等级
}

// 游戏动作类型
export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'MOVE_PIECE'; direction: 'left' | 'right' | 'down' }
  | { type: 'ROTATE_PIECE' }
  | { type: 'DROP_PIECE' }
  | { type: 'UPDATE_GAME' }
  | { type: 'GAME_OVER' }
  | { type: 'SET_MANUAL_SPEED'; speed: number }
  | { type: 'TOGGLE_AI_MODE' }
  | { type: 'SET_AI_LEVEL'; level: AILevel }
  | { type: 'SET_AI_THINKING'; thinking: boolean }; 