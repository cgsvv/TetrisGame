import React from 'react';
import { useTranslation } from 'react-i18next';

export const Controls: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="controls">
              <h3>{t('controls')}</h3>
      <div className="control-item">
                  <span>{t('startGame')}:</span>
        <span className="control-key">Enter</span>
      </div>
      <div className="control-item">
                  <span>{t('pauseResume')}:</span>
        <span className="control-key">P</span>
      </div>
      <div className="control-item">
                  <span>{t('moveLeft')}:</span>
        <span className="control-key">←</span>
      </div>
      <div className="control-item">
                  <span>{t('moveRight')}:</span>
        <span className="control-key">→</span>
      </div>
      <div className="control-item">
                  <span>{t('moveDown')}:</span>
        <span className="control-key">↓</span>
      </div>
      <div className="control-item">
                  <span>{t('rotate')}:</span>
        <span className="control-key">↑</span>
      </div>
      <div className="control-item">
                  <span>{t('hardDrop')}:</span>
        <span className="control-key">{t('space')}</span>
      </div>
    </div>
  );
}; 