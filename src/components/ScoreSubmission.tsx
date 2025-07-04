import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { submitScore } from '../lib/leaderboard';
import { ScoreSubmission as ScoreSubmissionType } from '../lib/supabase';
import styles from '../styles/ScoreSubmission.module.css';

interface ScoreSubmissionProps {
  score: number;
  level: number;
  lines: number;
  onClose: () => void;
  onSubmitted: () => void;
}

export const ScoreSubmission: React.FC<ScoreSubmissionProps> = ({
  score,
  level,
  lines,
  onClose,
  onSubmitted,
}) => {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submitMutation = useMutation(submitScore, {
    onSuccess: () => {
      setIsSubmitting(false);
      onSubmitted();
    },
    onError: (error: Error) => {
      setIsSubmitting(false);
      setError(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }

    if (username.length > 20) {
      setError('用户名不能超过20个字符');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const scoreData: ScoreSubmissionType = {
      username: username.trim(),
      score,
      level,
      lines,
    };

    submitMutation.mutate(scoreData);
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>🎉 恭喜！</h2>
          <p>你的游戏成绩很棒！</p>
        </div>

        <div className={styles.scoreInfo}>
          <div className={styles.scoreItem}>
            <span className={styles.label}>分数:</span>
            <span className={styles.value}>{score.toLocaleString()}</span>
          </div>
          <div className={styles.scoreItem}>
            <span className={styles.label}>等级:</span>
            <span className={styles.value}>{level}</span>
          </div>
          <div className={styles.scoreItem}>
            <span className={styles.label}>消除行数:</span>
            <span className={styles.value}>{lines}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">用户名:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="输入你的用户名"
              maxLength={20}
              disabled={isSubmitting}
              className={styles.input}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.buttons}>
            <button
              type="button"
              onClick={handleSkip}
              disabled={isSubmitting}
              className={styles.skipButton}
            >
              跳过
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !username.trim()}
              className={styles.submitButton}
            >
              {isSubmitting ? '提交中...' : '提交分数'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 