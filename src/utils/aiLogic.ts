import { TetrominoType, TetrominoShape, Position, AIDecision, AILevel, CurrentPiece } from '../types/game';
import { BOARD_WIDTH, BOARD_HEIGHT } from './constants';
import { TETROMINOS } from './tetrominos';
import { isValidPosition, placePiece, clearLines } from './gameLogic';

// 评估权重配置
const EVALUATION_WEIGHTS = {
  LINES_CLEARED: 1000,
  HEIGHT_PENALTY: -10,
  HOLE_PENALTY: -50,
  BUMPINESS_PENALTY: -5,
  EDGE_TOUCH_BONUS: 20,
};

// 计算游戏板高度
const calculateHeight = (board: number[][]): number => {
  for (let row = 0; row < BOARD_HEIGHT; row++) {
    if (board[row].some(cell => cell !== 0)) {
      return BOARD_HEIGHT - row;
    }
  }
  return 0;
};

// 计算空洞数量
const calculateHoles = (board: number[][]): number => {
  let holes = 0;
  for (let col = 0; col < BOARD_WIDTH; col++) {
    let foundBlock = false;
    for (let row = 0; row < BOARD_HEIGHT; row++) {
      if (board[row][col] !== 0) {
        foundBlock = true;
      } else if (foundBlock) {
        holes++;
      }
    }
  }
  return holes;
};

// 计算平整度
const calculateBumpiness = (board: number[][]): number => {
  const heights: number[] = [];
  
  for (let col = 0; col < BOARD_WIDTH; col++) {
    let height = 0;
    for (let row = 0; row < BOARD_HEIGHT; row++) {
      if (board[row][col] !== 0) {
        height = BOARD_HEIGHT - row;
        break;
      }
    }
    heights.push(height);
  }
  
  let bumpiness = 0;
  for (let i = 0; i < heights.length - 1; i++) {
    bumpiness += Math.abs(heights[i] - heights[i + 1]);
  }
  
  return bumpiness;
};

// 计算边缘贴合度
const calculateEdgeTouch = (board: number[][], piece: { position: Position; shape: TetrominoShape; type: TetrominoType }): number => {
  let touches = 0;
  const { position, shape } = piece;
  
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] !== 0) {
        const boardX = position.x + col;
        const boardY = position.y + row;
        
        // 检查四个方向
        const directions = [
          { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
          { dx: 0, dy: -1 }, { dx: 0, dy: 1 }
        ];
        
        for (const { dx, dy } of directions) {
          const checkX = boardX + dx;
          const checkY = boardY + dy;
          
          if (checkX >= 0 && checkX < BOARD_WIDTH && checkY >= 0 && checkY < BOARD_HEIGHT) {
            if (board[checkY][checkX] !== 0) {
              touches++;
            }
          }
        }
      }
    }
  }
  
  return touches;
};



// 评估单个位置
const evaluatePosition = (
  board: number[][],
  piece: CurrentPiece,
  aiLevel: AILevel
): number => {
  // 模拟放置方块
  const testBoard = placePiece(piece, board);
  const { newBoard: clearedBoard, linesCleared } = clearLines(testBoard);
  
  // 基础评分
  let score = linesCleared * EVALUATION_WEIGHTS.LINES_CLEARED;
  
  // 高度惩罚
  const height = calculateHeight(clearedBoard);
  score += height * EVALUATION_WEIGHTS.HEIGHT_PENALTY;
  
  // 空洞惩罚
  const holes = calculateHoles(clearedBoard);
  score += holes * EVALUATION_WEIGHTS.HOLE_PENALTY;
  
  // 平整度惩罚
  const bumpiness = calculateBumpiness(clearedBoard);
  score += bumpiness * EVALUATION_WEIGHTS.BUMPINESS_PENALTY;
  
  // 边缘贴合奖励
  const edgeTouch = calculateEdgeTouch(board, piece);
  score += edgeTouch * EVALUATION_WEIGHTS.EDGE_TOUCH_BONUS;
  

  
  // 根据AI等级调整评分
  switch (aiLevel) {
    case 'easy':
      score *= 0.7;
      break;
    case 'normal':
      break;
    case 'hard':
      score *= 1.2;
      break;
  }
  
  return score;
};

// 获取所有可能的位置
const getAllPossiblePositions = (
  board: number[][],
  type: TetrominoType
): CurrentPiece[] => {
  const positions: CurrentPiece[] = [];
  const shapes = TETROMINOS[type];
  
  for (const shape of shapes) {
    // 尝试所有可能的X位置
    for (let x = -2; x <= BOARD_WIDTH + 2; x++) {
      // 从顶部开始向下移动
      for (let y = 0; y <= BOARD_HEIGHT; y++) {
        const position = { x, y };
        const piece: CurrentPiece = { type, position, shape };
        
        // 检查位置是否有效
        if (isValidPosition(piece, board)) {
          // 继续向下移动直到不能移动
          let finalY = y;
          while (finalY < BOARD_HEIGHT) {
            const nextPosition = { x, y: finalY + 1 };
            const nextPiece: CurrentPiece = { type, position: nextPosition, shape };
            if (isValidPosition(nextPiece, board)) {
              finalY++;
            } else {
              break;
            }
          }
          
          const finalPosition = { x, y: finalY };
          const finalPiece: CurrentPiece = { type, position: finalPosition, shape };
          
          // 检查最终位置是否有效
          if (isValidPosition(finalPiece, board)) {
            positions.push(finalPiece);
          }
        }
      }
    }
  }
  
  return positions;
};

// AI决策主函数
export const makeAIDecision = (
  board: number[][],
  currentPiece: CurrentPiece,
  aiLevel: AILevel
): AIDecision => {
  const positions = getAllPossiblePositions(board, currentPiece.type);
  let bestDecision: AIDecision | null = null;
  let bestScore = -Infinity;
  
  // 评估所有可能的位置
  for (const position of positions) {
    const score = evaluatePosition(board, position, aiLevel);
    
    if (score > bestScore) {
      bestScore = score;
      bestDecision = {
        position: position.position,
        shape: position.shape,
        score,
      };
    }
  }
  
  // 如果没有找到有效位置，返回当前位置
  if (!bestDecision) {
    return {
      position: currentPiece.position,
      shape: currentPiece.shape,
      score: 0,
    };
  }
  
  // 根据AI等级添加随机性
  const randomFactor = aiLevel === 'easy' ? 0.3 : aiLevel === 'normal' ? 0.1 : 0.05;
  if (Math.random() < randomFactor) {
    // 随机选择一个次优位置
    const randomIndex = Math.floor(Math.random() * Math.min(positions.length, 3));
    const randomPosition = positions[randomIndex];
    return {
      position: randomPosition.position,
      shape: randomPosition.shape,
      score: evaluatePosition(board, randomPosition, aiLevel),
    };
  }
  
  return bestDecision;
};

// 模拟AI思考时间
export const simulateAIThinking = (aiLevel: AILevel): Promise<void> => {
  const thinkingTimes = {
    easy: 300 + Math.random() * 400, // 300-700ms
    normal: 500 + Math.random() * 500, // 500-1000ms
    hard: 800 + Math.random() * 400, // 800-1200ms
  };
  
  return new Promise(resolve => {
    setTimeout(resolve, thinkingTimes[aiLevel]);
  });
}; 