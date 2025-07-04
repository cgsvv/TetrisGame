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
              <h3>{t('gameInfo')}</h3>
      <div className="info-item">
                  <span>{t('score')}:</span>
        <span className="info-value">{score.toLocaleString()}</span>
      </div>
      <div className="info-item">
                  <span>{t('level')}:</span>
        <span className="info-value">{level}</span>
      </div>
      <div className="info-item">
                  <span>{t('lines')}:</span>
        <span className="info-value">{lines}</span>
      </div>
    </div>
  );
}; 