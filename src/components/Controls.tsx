import React from 'react';
import { useTranslation } from 'react-i18next';

export const Controls: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="controls">
      <h3>{t('控制说明')}</h3>
      <div className="control-item">
        <span>{t('开始游戏')}:</span>
        <span className="control-key">Enter</span>
      </div>
      <div className="control-item">
        <span>{t('暂停/继续')}:</span>
        <span className="control-key">P</span>
      </div>
      <div className="control-item">
        <span>{t('左移')}:</span>
        <span className="control-key">←</span>
      </div>
      <div className="control-item">
        <span>{t('右移')}:</span>
        <span className="control-key">→</span>
      </div>
      <div className="control-item">
        <span>{t('下移')}:</span>
        <span className="control-key">↓</span>
      </div>
      <div className="control-item">
        <span>{t('旋转')}:</span>
        <span className="control-key">↑</span>
      </div>
      <div className="control-item">
        <span>{t('硬下落')}:</span>
        <span className="control-key">{t('空格') || '空格'}</span>
      </div>
    </div>
  );
}; 