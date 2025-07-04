import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/SpeedControl.module.css';

interface SpeedControlProps {
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
  actualDropSpeed: number;
}

export const SpeedControl: React.FC<SpeedControlProps> = ({ currentSpeed, onSpeedChange, actualDropSpeed }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.speedControl}>
      <div className={styles.title}>{t('速度控制')}</div>
      <div className={styles.sliderContainer}>
        <input
          type="range"
          min={1}
          max={10}
          value={currentSpeed}
          onChange={e => onSpeedChange(Number(e.target.value))}
          className={styles.slider}
        />
        <span className={styles.value}>{currentSpeed}</span>
      </div>
      <div className={styles.actualSpeed}>
        {t('实际下落速度')}: {actualDropSpeed}ms
      </div>
    </div>
  );
}; 