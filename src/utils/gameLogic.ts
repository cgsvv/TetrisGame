import { GameState, CurrentPiece, Position, TetrominoType } from '../types/game';
import { BOARD_WIDTH, BOARD_HEIGHT, SPEED_CONFIG, SCORE_CONFIG, LEVEL_CONFIG } from './constants';
import { TETROMINOS, getRandomTetromino, getInitialPosition } from './tetrominos';

// 创建空游戏板
export const createEmptyBoard = (): number[][] => {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
};

// 检查位置是否有效
export const isValidPosition = (
  piece: CurrentPiece,
  board: number[][]
): boolean => {
  const { shape, position } = piece;
  
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] !== 0) {
        const newX = position.x + col;
        const newY = position.y + row;
        
        // 检查边界
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false;
        }
        
        // 检查是否与已有方块重叠
        if (newY >= 0 && board[newY][newX] !== 0) {
          return false;
        }
      }
    }
  }
  
  return true;
};

// 将方块放置到游戏板上
export const placePiece = (piece: CurrentPiece, board: number[][]): number[][] => {
  const newBoard = board.map(row => [...row]);
  const { shape, position } = piece;
  
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] !== 0) {
        const boardX = position.x + col;
        const boardY = position.y + row;
        
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = 1; // 1表示有方块
        }
      }
    }
  }
  
  return newBoard;
};

// 清除完整的行
export const clearLines = (board: number[][]): { newBoard: number[][], linesCleared: number } => {
  const newBoard = board.filter(row => !row.every(cell => cell !== 0));
  const linesCleared = board.length - newBoard.length;
  
  // 在顶部添加空行
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(0));
  }
  
  return { newBoard, linesCleared };
};

// 计算分数
export const calculateScore = (linesCleared: number, level: number): number => {
  let baseScore = 0;
  
  switch (linesCleared) {
    case 1:
      baseScore = SCORE_CONFIG.SINGLE_LINE;
      break;
    case 2:
      baseScore = SCORE_CONFIG.DOUBLE_LINES;
      break;
    case 3:
      baseScore = SCORE_CONFIG.TRIPLE_LINES;
      break;
    case 4:
      baseScore = SCORE_CONFIG.TETRIS;
      break;
    default:
      return 0;
  }
  
  return baseScore * (level + 1);
};

// 计算新等级
export const calculateLevel = (lines: number): number => {
  return Math.min(Math.floor(lines / LEVEL_CONFIG.LINES_PER_LEVEL), LEVEL_CONFIG.MAX_LEVEL);
};

// 计算下落速度
export const calculateDropSpeed = (level: number): number => {
  return Math.max(
    SPEED_CONFIG.INITIAL_DROP_SPEED - (level * SPEED_CONFIG.SPEED_INCREASE),
    SPEED_CONFIG.MIN_DROP_SPEED
  );
};

// 创建新方块
export const createNewPiece = (type: TetrominoType): CurrentPiece => {
  return {
    type,
    position: getInitialPosition(type),
    shape: TETROMINOS[type][0],
  };
};

// 移动方块
export const movePiece = (
  piece: CurrentPiece,
  direction: 'left' | 'right' | 'down',
  board: number[][]
): CurrentPiece | null => {
  const newPosition = { ...piece.position };
  
  switch (direction) {
    case 'left':
      newPosition.x -= 1;
      break;
    case 'right':
      newPosition.x += 1;
      break;
    case 'down':
      newPosition.y += 1;
      break;
  }
  
  const newPiece = { ...piece, position: newPosition };
  
  return isValidPosition(newPiece, board) ? newPiece : null;
};

// 旋转方块
export const rotatePiece = (
  piece: CurrentPiece,
  board: number[][]
): CurrentPiece | null => {
  const shapes = TETROMINOS[piece.type];
  const currentIndex = shapes.findIndex(shape => 
    JSON.stringify(shape) === JSON.stringify(piece.shape)
  );
  
  const nextIndex = (currentIndex + 1) % shapes.length;
  const newShape = shapes[nextIndex];
  
  const newPiece = { ...piece, shape: newShape };
  
  return isValidPosition(newPiece, board) ? newPiece : null;
};

// 硬下落方块
export const hardDropPiece = (
  piece: CurrentPiece,
  board: number[][]
): { newPiece: CurrentPiece; dropDistance: number } => {
  let dropDistance = 0;
  let currentPiece = piece;
  
  while (true) {
    const movedPiece = movePiece(currentPiece, 'down', board);
    if (movedPiece) {
      currentPiece = movedPiece;
      dropDistance++;
    } else {
      break;
    }
  }
  
  return { newPiece: currentPiece, dropDistance };
};

// 检查游戏是否结束
export const isGameOver = (board: number[][]): boolean => {
  // 检查顶部行是否有方块
  return board[0].some(cell => cell !== 0);
};

// 生成下一个方块
export const generateNextPiece = (): TetrominoType => {
  return getRandomTetromino();
}; 