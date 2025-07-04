import { useReducer, useCallback } from 'react';
import { GameState, GameAction, AILevel } from '../types/game';
import { 
  createEmptyBoard, 
  createNewPiece, 
  generateNextPiece, 
  isValidPosition, 
  placePiece, 
  clearLines 
} from '../utils/gameLogic';
import { TETROMINOS } from '../utils/tetrominos';
import { useSound } from './useSound';
import { safeTrackGameEvent } from '../components/GoogleAnalytics';

// 初始游戏状态
const initialState: GameState = {
  board: createEmptyBoard(),
  currentPiece: null,
  nextPiece: generateNextPiece(),
  score: 0,
  level: 1,
  lines: 0,
  status: 'idle',
  dropTime: 0,
  dropSpeed: 1000,
  manualSpeed: 1,
  aiMode: false,
  aiThinking: false,
  aiLevel: 'normal',
  clearingLines: [],
  clearAnimationStep: 0,
};

// 游戏状态更新函数
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME':
      safeTrackGameEvent.gameStart();
      return {
        ...state,
        board: createEmptyBoard(),
        currentPiece: createNewPiece(state.nextPiece),
        nextPiece: generateNextPiece(),
        score: 0,
        level: 1,
        lines: 0,
        status: 'playing',
        dropTime: 0,
        dropSpeed: 1000,
      };

    case 'PAUSE_GAME':
      if (state.status === 'playing') {
        safeTrackGameEvent.gamePause();
      }
      return {
        ...state,
        status: state.status === 'playing' ? 'paused' : state.status,
      };

    case 'RESUME_GAME':
      if (state.status === 'paused') {
        safeTrackGameEvent.gameResume();
      }
      return {
        ...state,
        status: state.status === 'paused' ? 'playing' : state.status,
      };

    case 'RESET_GAME':
      return {
        ...initialState,
        aiMode: state.aiMode,
        aiLevel: state.aiLevel,
      };

    case 'MOVE_PIECE': {
      if (!state.currentPiece || state.status !== 'playing') return state;

      const { direction } = action;
      const newPosition = { ...state.currentPiece.position };

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

      const newPiece = { ...state.currentPiece, position: newPosition };

      if (isValidPosition(newPiece, state.board)) {
        return { ...state, currentPiece: newPiece };
      }

      // 如果是向下移动且无效，则放置方块
      if (direction === 'down') {
        return placeCurrentPiece(state);
      }

      return state;
    }

    case 'ROTATE_PIECE': {
      if (!state.currentPiece || state.status !== 'playing') return state;

      const shapes = TETROMINOS[state.currentPiece.type];
      const currentIndex = shapes.findIndex(shape => 
        JSON.stringify(shape) === JSON.stringify(state.currentPiece!.shape)
      );
      const nextIndex = (currentIndex + 1) % shapes.length;
      const nextShape = shapes[nextIndex];

      const newPiece = { ...state.currentPiece, shape: nextShape };

      if (isValidPosition(newPiece, state.board)) {
        return { ...state, currentPiece: newPiece };
      }

      return state;
    }

    case 'DROP_PIECE': {
      if (!state.currentPiece || state.status !== 'playing') return state;

      // 硬下落：直接移动到底部
      let newPosition = { ...state.currentPiece.position };
      while (isValidPosition({ ...state.currentPiece, position: { ...newPosition, y: newPosition.y + 1 } }, state.board)) {
        newPosition.y += 1;
      }

      const newPiece = { ...state.currentPiece, position: newPosition };
      return placeCurrentPiece({ ...state, currentPiece: newPiece });
    }

    case 'UPDATE_GAME': {
      if (state.status !== 'playing') return state;

      const newDropTime = state.dropTime + state.dropSpeed / state.manualSpeed;

      if (newDropTime >= 1000) {
        return {
          ...state,
          dropTime: 0,
          ...(state.currentPiece ? movePieceDown(state) : spawnNewPiece(state)),
        };
      }

      return { ...state, dropTime: newDropTime };
    }

    case 'GAME_OVER':
      safeTrackGameEvent.gameOver(state.score, state.level, state.lines);
      return { ...state, status: 'gameOver' };

    case 'SET_MANUAL_SPEED':
      safeTrackGameEvent.speedChange(action.speed);
      return { ...state, manualSpeed: action.speed };

    case 'TOGGLE_AI_MODE':
      const newAiMode = !state.aiMode;
      safeTrackGameEvent.aiModeToggle(newAiMode);
      return { ...state, aiMode: newAiMode };

    case 'SET_AI_LEVEL':
      return { ...state, aiLevel: action.level };

    case 'SET_AI_THINKING':
      return { ...state, aiThinking: action.thinking };

    case 'START_CLEAR_ANIMATION':
      return { 
        ...state, 
        status: 'clearingLines' as const,
        clearingLines: action.lines,
        clearAnimationStep: 0
      };

    case 'UPDATE_CLEAR_ANIMATION':
      if (state.status !== 'clearingLines') return state;
      return { 
        ...state, 
        clearAnimationStep: (state.clearAnimationStep + 1) % 4
      };

    case 'FINISH_CLEAR_ANIMATION':
      if (state.status !== 'clearingLines') return state;
      return finishClearAnimation(state);

    default:
      return state;
  }
};

// 移动方块向下
const movePieceDown = (state: GameState): Partial<GameState> => {
  if (!state.currentPiece) return {};

  const newPosition = { ...state.currentPiece.position, y: state.currentPiece.position.y + 1 };
  const newPiece = { ...state.currentPiece, position: newPosition };

  if (isValidPosition(newPiece, state.board)) {
    return { currentPiece: newPiece };
  } else {
    return placeCurrentPiece(state);
  }
};

// 生成新方块
const spawnNewPiece = (state: GameState): Partial<GameState> => {
  const newPiece = createNewPiece(state.nextPiece);
  const nextPiece = generateNextPiece();

  if (!isValidPosition(newPiece, state.board)) {
    // 游戏结束时播放音效
    if (typeof window !== 'undefined') {
      const audio = new Audio('/sounds/gameover.wav');
      audio.volume = 0.5;
      audio.play().catch(() => {}); // 忽略播放错误
    }
    return { status: 'gameOver' as const };
  }

  return {
    currentPiece: newPiece,
    nextPiece,
  };
};

// 放置当前方块
const placeCurrentPiece = (state: GameState): GameState => {
  if (!state.currentPiece) return state;

  const newBoard = placePiece(state.currentPiece, state.board);
  const { linesCleared, linesToClear } = clearLines(newBoard);

  // 播放落地音效
  if (typeof window !== 'undefined') {
    const audio = new Audio('/sounds/land.wav');
    audio.volume = 0.5;
    audio.play().catch(() => {}); // 忽略播放错误
  }

  // 如果有消行，启动消行动画
  if (linesCleared > 0) {
    return {
      ...state,
      board: newBoard, // 使用未清除行的板子
      currentPiece: null,
      status: 'clearingLines' as const,
      clearingLines: linesToClear,
      clearAnimationStep: 0,
    };
  }

  return {
    ...state,
    board: newBoard,
    currentPiece: null,
  };
};

// 完成消行动画
const finishClearAnimation = (state: GameState): GameState => {
  if (state.clearingLines.length === 0) return state;

  // 实际清除行
  const newBoard = state.board.filter((_, index) => !state.clearingLines.includes(index));
  
  // 在顶部添加空行
  while (newBoard.length < 20) { // BOARD_HEIGHT
    newBoard.unshift(Array(10).fill(0)); // BOARD_WIDTH
  }

  const linesCleared = state.clearingLines.length;
  const newLines = state.lines + linesCleared;
  const newLevel = Math.floor(newLines / 10) + 1;
  const newScore = state.score + linesCleared * 100 * newLevel;
  const newDropSpeed = Math.max(100, 1000 - (newLevel - 1) * 100);

  // 播放消行音效
  if (typeof window !== 'undefined') {
    const audio = new Audio('/sounds/clear.wav');
    audio.volume = 0.5;
    audio.play().catch(() => {}); // 忽略播放错误
  }

  return {
    ...state,
    board: newBoard,
    status: 'playing' as const,
    clearingLines: [],
    clearAnimationStep: 0,
    lines: newLines,
    level: newLevel,
    score: newScore,
    dropSpeed: newDropSpeed,
  };
};

// 游戏状态Hook
export const useGameState = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { play } = useSound();

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
    play('start');
  }, [play]);

  const pauseGame = useCallback(() => {
    dispatch({ type: 'PAUSE_GAME' });
    play('pause');
  }, [play]);

  const resumeGame = useCallback(() => {
    dispatch({ type: 'RESUME_GAME' });
    play('resume');
  }, [play]);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const movePiece = useCallback((direction: 'left' | 'right' | 'down') => {
    dispatch({ type: 'MOVE_PIECE', direction });
    play('move');
  }, [play]);

  const rotatePiece = useCallback(() => {
    dispatch({ type: 'ROTATE_PIECE' });
    play('rotate');
  }, [play]);

  const dropPiece = useCallback(() => {
    dispatch({ type: 'DROP_PIECE' });
    play('drop');
  }, [play]);

  const updateGame = useCallback(() => {
    dispatch({ type: 'UPDATE_GAME' });
  }, []);

  const setManualSpeed = useCallback((speed: number) => {
    dispatch({ type: 'SET_MANUAL_SPEED', speed });
  }, []);

  const toggleAIMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_AI_MODE' });
  }, []);

  const setAILevel = useCallback((level: AILevel) => {
    dispatch({ type: 'SET_AI_LEVEL', level });
  }, []);

  const setAIThinking = useCallback((thinking: boolean) => {
    dispatch({ type: 'SET_AI_THINKING', thinking });
  }, []);

  const startClearAnimation = useCallback((lines: number[]) => {
    dispatch({ type: 'START_CLEAR_ANIMATION', lines });
  }, []);

  const updateClearAnimation = useCallback(() => {
    dispatch({ type: 'UPDATE_CLEAR_ANIMATION' });
  }, []);

  const finishClearAnimation = useCallback(() => {
    dispatch({ type: 'FINISH_CLEAR_ANIMATION' });
  }, []);

  return {
    state,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    movePiece,
    rotatePiece,
    dropPiece,
    updateGame,
    setManualSpeed,
    toggleAIMode,
    setAILevel,
    setAIThinking,
    startClearAnimation,
    updateClearAnimation,
    finishClearAnimation,
  };
}; 