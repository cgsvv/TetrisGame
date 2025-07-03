import React from 'react';
import { GameState } from '../types/game';

interface GameOverProps {
  gameState: GameState;
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ gameState, onRestart }) => {
  const { score, level, lines } = gameState;

  return (
    <div className="game-over">
      <div className="game-over-content">
        <h2>游戏结束</h2>
        <p>最终分数: {score.toLocaleString()}</p>
        <p>达到等级: {level}</p>
        <p>消除行数: {lines}</p>
        <button onClick={onRestart}>
          重新开始
        </button>
      </div>
    </div>
  );
}; 