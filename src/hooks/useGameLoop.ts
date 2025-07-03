import { useEffect, useRef } from 'react';
import { GameStatus } from '../types/game';

interface UseGameLoopProps {
  status: GameStatus;
  onUpdate: () => void;
  dropSpeed: number;
}

export const useGameLoop = ({ status, onUpdate, dropSpeed }: UseGameLoopProps) => {
  const frameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (status !== 'playing') {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = undefined;
      }
      return;
    }

    const gameLoop = (currentTime: number) => {
      if (currentTime - lastTimeRef.current >= dropSpeed) {
        onUpdate();
        lastTimeRef.current = currentTime;
      }
      
      frameRef.current = requestAnimationFrame(gameLoop);
    };

    frameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [status, onUpdate, dropSpeed]);
}; 