import React from 'react';
import { useTranslation } from 'react-i18next';
import { GameState } from '../types/game';

interface ScoreBoardProps {
  gameState: GameState;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ gameState }) => {
  const { t } = useTranslation();
  const { score, level, lines } = gameState;

  return (
    <div className="info-panel">
      <h3>{t('游戏信息')}</h3>
      <div className="info-item">
        <span>{t('分数')}:</span>
        <span className="info-value">{score.toLocaleString()}</span>
      </div>
      <div className="info-item">
        <span>{t('等级')}:</span>
        <span className="info-value">{level}</span>
      </div>
      <div className="info-item">
        <span>{t('消除行数')}:</span>
        <span className="info-value">{lines}</span>
      </div>
    </div>
  );
}; 