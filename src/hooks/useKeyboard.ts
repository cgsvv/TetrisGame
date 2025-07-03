import { useEffect } from 'react';
import { GameStatus } from '../types/game';
import { KEY_MAPPING } from '../utils/constants';

interface UseKeyboardProps {
  status: GameStatus;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onDrop: () => void;
  onPause: () => void;
  onStart: () => void;
}

export const useKeyboard = ({
  status,
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotate,
  onDrop,
  onPause,
  onStart,
}: UseKeyboardProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;

      // 防止按键重复触发
      if (event.repeat) return;

      // 开始游戏
      if (KEY_MAPPING.START.includes(key)) {
        if (status === 'idle' || status === 'gameOver') {
          event.preventDefault();
          onStart();
        }
        return;
      }

      // 暂停/恢复游戏
      if (KEY_MAPPING.PAUSE.includes(key)) {
        if (status === 'playing' || status === 'paused') {
          event.preventDefault();
          onPause();
        }
        return;
      }

      // 只有在游戏进行中才处理其他按键
      if (status !== 'playing') return;

      // 移动和旋转
      if (KEY_MAPPING.LEFT.includes(key)) {
        event.preventDefault();
        onMoveLeft();
      } else if (KEY_MAPPING.RIGHT.includes(key)) {
        event.preventDefault();
        onMoveRight();
      } else if (KEY_MAPPING.DOWN.includes(key)) {
        event.preventDefault();
        onMoveDown();
      } else if (KEY_MAPPING.ROTATE.includes(key)) {
        event.preventDefault();
        onRotate();
      } else if (KEY_MAPPING.DROP.includes(key)) {
        event.preventDefault();
        onDrop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [status, onMoveLeft, onMoveRight, onMoveDown, onRotate, onDrop, onPause, onStart]);
}; 