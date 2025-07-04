import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { submitScore, checkUsernameExists, getUserBestScore } from '../lib/leaderboard';
import styles from '../styles/ScoreSubmission.module.css';
import { safeTrackGameEvent } from './GoogleAnalytics';

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
      setError(t('pleaseEnterUsername'));
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
          setError(t('scoreDoesntBeatRecord'));
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
      
      // Track score submission
      safeTrackGameEvent.scoreSubmit(score);
      
      onSubmitted();
    } catch (err) {
      console.error('Submit score error:', err);
              setError(t('submissionFailedPleaseRetry'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{t('submitScore')}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>{t('username')}</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={submitting}
              maxLength={16}
                              placeholder={t('pleaseEnterUsername')}
            />
          </div>
          <div className={styles.formGroup}>
            <span>{t('score')}: {score.toLocaleString()}</span>
            <span>{t('level')}: {level}</span>
            <span>{t('lines')}: {lines}</span>
          </div>
          {existingScore !== null && (
            <div className={styles.existingScore}>
              {t('currentBestScore')}: {existingScore.toLocaleString()}
            </div>
          )}
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.actions}>
            <button type="submit" disabled={submitting}>
              {submitting ? t('submitting') : t('submitScore')}
            </button>
            <button type="button" onClick={onClose} disabled={submitting}>
                              {t('close')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 