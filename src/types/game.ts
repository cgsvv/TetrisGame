// 方块类型
export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

// 方块形状定义
export type TetrominoShape = number[][];

// 游戏状态
export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameOver';

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
  | { type: 'GAME_OVER' }; 