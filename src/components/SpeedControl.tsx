import React from 'react';
import { useTranslation } from 'react-i18next';

interface SpeedControlProps {
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
  actualDropSpeed: number;
}

export const SpeedControl: React.FC<SpeedControlProps> = ({ currentSpeed, onSpeedChange, actualDropSpeed }) => {
  const { t } = useTranslation();
  return (
    <div className="info-panel">
      <label className="label">{t('速度控制')}</label>
      <input
        type="range"
        min={1}
        max={10}
        value={currentSpeed}
        onChange={e => onSpeedChange(Number(e.target.value))}
        className="slider"
      />
      <span className="value">{currentSpeed}</span>
      <div className="actual-speed">
        {t('实际下落速度')}: {actualDropSpeed}ms
      </div>
    </div>
  );
}; 