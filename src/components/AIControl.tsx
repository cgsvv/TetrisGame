import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/AIControl.module.css';
import { AILevel } from '../types/game';

interface AIControlProps {
  aiMode: boolean;
  aiLevel: AILevel;
  aiThinking: boolean;
  onToggleAIMode: () => void;
  onSetAILevel: (level: AILevel) => void;
}

export const AIControl: React.FC<AIControlProps> = ({
  aiMode,
  aiLevel,
  aiThinking,
  onToggleAIMode,
  onSetAILevel,
}) => {
  const { t } = useTranslation();
  return (
    <div className={styles.aiControl}>
      <div className={styles.header}>
        <span>{t('AI助手')}</span>
        <label className={styles.switch}>
          <input type="checkbox" checked={aiMode} onChange={onToggleAIMode} />
          <span className={styles.slider}></span>
        </label>
      </div>
      <div className={styles.levelSelect}>
        <span>{t('难度')}:</span>
        <select value={aiLevel} onChange={e => onSetAILevel(e.target.value as AILevel)}>
          <option value="easy">{t('简单')}</option>
          <option value="normal">{t('普通')}</option>
          <option value="hard">{t('困难')}</option>
        </select>
      </div>
      {aiThinking && <div className={styles.thinking}>{t('AI思考中...')}</div>}
    </div>
  );
}; 