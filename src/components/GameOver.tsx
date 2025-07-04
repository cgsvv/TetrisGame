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
        <h2>{t('游戏结束')}</h2>
        <p>{t('最终分数')}: {score.toLocaleString()}</p>
        <p>{t('达到等级')}: {level}</p>
        <p>{t('消除行数')}: {lines}</p>
        <button onClick={onRestart}>
          {t('重新开始')}
        </button>
      </div>
    </div>
  );
}; 