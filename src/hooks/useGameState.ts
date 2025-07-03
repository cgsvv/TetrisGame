import { useReducer, useCallback } from 'react';
import { GameState, GameAction } from '../types/game';
import { 
  createEmptyBoard, 
  createNewPiece, 
  generateNextPiece, 
  isGameOver,
  movePiece as movePieceLogic,
  rotatePiece as rotatePieceLogic,
  hardDropPiece,
  placePiece,
  clearLines,
  calculateScore,
  calculateLevel,
  calculateDropSpeed
} from '../utils/gameLogic';
import { SPEED_CONFIG, SCORE_CONFIG } from '../utils/constants';

// 初始游戏状态
const initialState: GameState = {
  board: createEmptyBoard(),
  currentPiece: null,
  nextPiece: generateNextPiece(),
  score: 0,
  level: 0,
  lines: 0,
  status: 'idle',
  dropTime: 0,
  dropSpeed: SPEED_CONFIG.INITIAL_DROP_SPEED,
};

// 放置当前方块的辅助函数
const placeCurrentPiece = (state: GameState): GameState => {
  if (!state.currentPiece) return state;

  // 放置方块到游戏板
  const newBoard = placePiece(state.currentPiece, state.board);
  
  // 清除完整的行
  const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
  
  // 计算新分数
  const scoreIncrease = calculateScore(linesCleared, state.level);
  const newScore = state.score + scoreIncrease;
  
  // 计算新等级
  const newLines = state.lines + linesCleared;
  const newLevel = calculateLevel(newLines);
  
  // 计算新的下落速度
  const newDropSpeed = calculateDropSpeed(newLevel);
  
  // 创建新方块
  const newCurrentPiece = createNewPiece(state.nextPiece);
  const newNextPiece = generateNextPiece();
  
  // 检查游戏是否结束
  if (isGameOver(clearedBoard)) {
    return {
      ...state,
      board: clearedBoard,
      score: newScore,
      lines: newLines,
      level: newLevel,
      status: 'gameOver',
    };
  }
  
  return {
    ...state,
    board: clearedBoard,
    currentPiece: newCurrentPiece,
    nextPiece: newNextPiece,
    score: newScore,
    lines: newLines,
    level: newLevel,
    dropSpeed: newDropSpeed,
    dropTime: Date.now(),
  };
};

// 游戏状态reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialState,
        status: 'playing',
        currentPiece: createNewPiece(state.nextPiece),
        nextPiece: generateNextPiece(),
      };

    case 'PAUSE_GAME':
      return {
        ...state,
        status: 'paused',
      };

    case 'RESUME_GAME':
      return {
        ...state,
        status: 'playing',
      };

    case 'RESET_GAME':
      return initialState;

    case 'MOVE_PIECE':
      if (state.status !== 'playing' || !state.currentPiece) {
        return state;
      }

      const movedPiece = movePieceLogic(state.currentPiece, action.direction, state.board);
      if (movedPiece) {
        return {
          ...state,
          currentPiece: movedPiece,
        };
      }

      // 如果向下移动失败，尝试放置方块
      if (action.direction === 'down') {
        return placeCurrentPiece(state);
      }

      return state;

    case 'ROTATE_PIECE':
      if (state.status !== 'playing' || !state.currentPiece) {
        return state;
      }

      const rotatedPiece = rotatePieceLogic(state.currentPiece, state.board);
      if (rotatedPiece) {
        return {
          ...state,
          currentPiece: rotatedPiece,
        };
      }

      return state;

    case 'DROP_PIECE':
      if (state.status !== 'playing' || !state.currentPiece) {
        return state;
      }

      const { newPiece, dropDistance } = hardDropPiece(state.currentPiece, state.board);
      const newState = {
        ...state,
        currentPiece: newPiece,
        score: state.score + (dropDistance * SCORE_CONFIG.HARD_DROP),
      };

      return placeCurrentPiece(newState);

    case 'UPDATE_GAME':
      if (state.status !== 'playing' || !state.currentPiece) {
        return state;
      }

      const now = Date.now();
      if (now - state.dropTime > state.dropSpeed) {
        const movedPiece = movePieceLogic(state.currentPiece, 'down', state.board);
        if (movedPiece) {
          return {
            ...state,
            currentPiece: movedPiece,
            dropTime: now,
          };
        } else {
          return placeCurrentPiece({
            ...state,
            dropTime: now,
          });
        }
      }

      return state;

    case 'GAME_OVER':
      return {
        ...state,
        status: 'gameOver',
      };

    default:
      return state;
  }
};

// 游戏状态管理Hook
export const useGameState = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const pauseGame = useCallback(() => {
    dispatch({ type: 'PAUSE_GAME' });
  }, []);

  const resumeGame = useCallback(() => {
    dispatch({ type: 'RESUME_GAME' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const movePiece = useCallback((direction: 'left' | 'right' | 'down') => {
    dispatch({ type: 'MOVE_PIECE', direction });
  }, []);

  const rotatePiece = useCallback(() => {
    dispatch({ type: 'ROTATE_PIECE' });
  }, []);

  const dropPiece = useCallback(() => {
    dispatch({ type: 'DROP_PIECE' });
  }, []);

  const updateGame = useCallback(() => {
    dispatch({ type: 'UPDATE_GAME' });
  }, []);

  const gameOver = useCallback(() => {
    dispatch({ type: 'GAME_OVER' });
  }, []);

  return {
    state,
    actions: {
      startGame,
      pauseGame,
      resumeGame,
      resetGame,
      movePiece,
      rotatePiece,
      dropPiece,
      updateGame,
      gameOver,
    },
  };
}; 