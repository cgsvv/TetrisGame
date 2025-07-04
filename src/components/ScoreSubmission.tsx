import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { submitScore, checkUsernameExists, getUserBestScore } from '../lib/leaderboard';
import styles from '../styles/ScoreSubmission.module.css';

interface ScoreSubmissionProps {
  score: number;
  level: number;
  lines: number;
  onClose: () => void;
  onSubmitted: () => void;
}

export const ScoreSubmission: React.FC<ScoreSubmissionProps> = ({ score, level, lines, onClose, onSubmitted }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [existingScore, setExistingScore] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError(t('请输入用户名'));
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      // 检查用户是否已存在
      const userExists = await checkUsernameExists(username.trim());
      
      if (userExists) {
        // 获取用户现有最高分
        const existingUser = await getUserBestScore(username.trim());
        if (existingUser && existingUser.score >= score) {
          setError(t('你的分数没有超过现有记录'));
          setSubmitting(false);
          return;
        }
        setExistingScore(existingUser?.score || null);
      }

      // 提交分数
      await submitScore({
        username: username.trim(),
        score,
        level,
        lines
      });
      
      onSubmitted();
    } catch (err) {
      console.error('Submit score error:', err);
      setError(t('提交失败，请重试'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{t('提交分数')}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>{t('用户名')}</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={submitting}
              maxLength={16}
              placeholder={t('请输入用户名')}
            />
          </div>
          <div className={styles.formGroup}>
            <span>{t('分数')}: {score.toLocaleString()}</span>
            <span>{t('等级')}: {level}</span>
            <span>{t('消除行数')}: {lines}</span>
          </div>
          {existingScore !== null && (
            <div className={styles.existingScore}>
              {t('现有最高分')}: {existingScore.toLocaleString()}
            </div>
          )}
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.actions}>
            <button type="submit" disabled={submitting}>
              {submitting ? t('提交中...') : t('提交分数')}
            </button>
            <button type="button" onClick={onClose} disabled={submitting}>
              {t('关闭')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 