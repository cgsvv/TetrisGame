import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { getLeaderboard } from '../lib/leaderboard';
import { LeaderboardEntry } from '../lib/supabase';
import styles from '../styles/Leaderboard.module.css';

export const Leaderboard: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useQuery<LeaderboardEntry[]>(
    ['leaderboard'],
    () => getLeaderboard(20),
    { refetchInterval: 30000 }
  );

  return (
    <div className={styles.leaderboardPage}>
      <h2>{t('排行榜')}</h2>
      {isLoading ? (
        <div>{t('加载中...')}</div>
      ) : error ? (
        <div>
          {t('加载失败')}
          <button onClick={() => refetch()}>{t('重试')}</button>
        </div>
      ) : (
        <table className={styles.leaderboardTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>{t('用户名')}</th>
              <th>{t('分数')}</th>
              <th>{t('等级')}</th>
              <th>{t('消除行数')}</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? data.map((item, idx) => (
              <tr key={item.id}>
                <td className={
                  idx === 0 ? styles['rank-gold'] :
                  idx === 1 ? styles['rank-silver'] :
                  idx === 2 ? styles['rank-bronze'] : ''
                }>
                  {idx + 1}
                </td>
                <td>{item.username}</td>
                <td>{item.score}</td>
                <td>{item.level}</td>
                <td>{item.lines}</td>
              </tr>
            )) : (
              <tr><td colSpan={5}>{t('暂无数据')}</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}; 