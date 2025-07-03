import React from 'react';
import { GameState } from '../types/game';

interface ScoreBoardProps {
  gameState: GameState;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ gameState }) => {
  const { score, level, lines } = gameState;

  return (
    <div className="info-panel">
      <h3>游戏信息</h3>
      <div className="info-item">
        <span>分数:</span>
        <span className="info-value">{score.toLocaleString()}</span>
      </div>
      <div className="info-item">
        <span>等级:</span>
        <span className="info-value">{level}</span>
      </div>
      <div className="info-item">
        <span>消除行数:</span>
        <span className="info-value">{lines}</span>
      </div>
    </div>
  );
}; 