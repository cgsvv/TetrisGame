import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError(t('请输入用户名'));
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      // 假设有 submitScore API
      // await submitScore({ username, score, level, lines });
      onSubmitted();
    } catch (err) {
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
            />
          </div>
          <div className={styles.formGroup}>
            <span>{t('分数')}: {score}</span>
            <span>{t('等级')}: {level}</span>
            <span>{t('消除行数')}: {lines}</span>
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.actions}>
            <button type="submit" disabled={submitting}>{t('提交分数')}</button>
            <button type="button" onClick={onClose} disabled={submitting}>{t('关闭')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}; 