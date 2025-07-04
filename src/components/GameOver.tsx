import React from 'react';
import { useTranslation } from 'react-i18next';
import { GameState } from '../types/game';

interface GameOverProps {
  gameState: GameState;
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ gameState, onRestart }) => {
  const { t } = useTranslation();
  const { score, level, lines } = gameState;

  return (
    <div className="game-over">
      <div className="game-over-content">
        <h2>{t('gameOver')}</h2>
        <p>{t('finalScore')}: {score.toLocaleString()}</p>
        <p>{t('levelReached')}: {level}</p>
        <p>{t('lines')}: {lines}</p>
        <button onClick={onRestart}>
          {t('restart')}
        </button>
      </div>
    </div>
  );
}; 