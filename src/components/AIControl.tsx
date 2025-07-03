import React from 'react';
import { AILevel } from '../types/game';
import styles from '../styles/AIControl.module.css';

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
  const levelLabels = {
    easy: '简单',
    normal: '普通',
    hard: '困难',
  };

  const levelDescriptions = {
    easy: '随机性较高，适合初学者',
    normal: '平衡的AI表现',
    hard: '精确计算，挑战性高',
  };

  return (
    <div className={styles.aiControl}>
      <h3 className={styles.title}>AI 助手</h3>
      
      <div className={styles.toggleSection}>
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={aiMode}
            onChange={onToggleAIMode}
            className={styles.toggleInput}
          />
          <span className={styles.toggleSlider}></span>
          <span className={styles.toggleText}>
            {aiMode ? 'AI 已开启' : 'AI 已关闭'}
          </span>
        </label>
        
        {aiThinking && (
          <div className={styles.thinkingIndicator}>
            <div className={styles.spinner}></div>
            <span>AI 正在思考...</span>
          </div>
        )}
      </div>

      {aiMode && (
        <div className={styles.levelSection}>
          <h4 className={styles.levelTitle}>AI 难度</h4>
          <div className={styles.levelButtons}>
            {(['easy', 'normal', 'hard'] as AILevel[]).map((level) => (
              <button
                key={level}
                className={`${styles.levelButton} ${
                  aiLevel === level ? styles.active : ''
                }`}
                onClick={() => onSetAILevel(level)}
                disabled={aiThinking}
              >
                <span className={styles.levelName}>{levelLabels[level]}</span>
                <span className={styles.levelDesc}>{levelDescriptions[level]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {aiMode && (
        <div className={styles.infoSection}>
          <h4 className={styles.infoTitle}>AI 功能说明</h4>
          <ul className={styles.infoList}>
            <li>AI 会自动分析最佳落点</li>
            <li>考虑消行、高度、空洞等因素</li>
            <li>模拟人类操作节奏</li>
            <li>可随时开启/关闭</li>
          </ul>
        </div>
      )}
    </div>
  );
}; 