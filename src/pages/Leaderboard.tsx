import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { getLeaderboard } from '../lib/leaderboard';
import { LeaderboardEntry } from '../lib/supabase';
import styles from '../styles/Leaderboard.module.css';

type SortField = 'score' | 'level' | 'lines' | 'created_at';
type SortOrder = 'asc' | 'desc';

export const Leaderboard: React.FC = () => {
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const { data: leaderboard, isLoading, error, refetch } = useQuery<LeaderboardEntry[]>(
    ['leaderboard', sortField, sortOrder],
    () => getLeaderboard(50),
    {
      refetchInterval: 30000, // 30秒自动刷新
    }
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedLeaderboard = React.useMemo(() => {
    if (!leaderboard) return [];
    
    return [...leaderboard].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (sortField === 'created_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }, [leaderboard, sortField, sortOrder]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>加载排行榜中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>加载失败</h2>
          <p>无法加载排行榜数据</p>
          <button onClick={() => refetch()} className={styles.retryButton}>
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🏆 排行榜</h1>
        <p>看看谁是最强的俄罗斯方块玩家</p>
        <Link to="/" className={styles.backButton}>
          ← 返回游戏
        </Link>
      </header>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.rankHeader}>排名</th>
              <th className={styles.usernameHeader}>玩家</th>
              <th 
                className={`${styles.sortableHeader} ${styles.scoreHeader}`}
                onClick={() => handleSort('score')}
              >
                分数 {getSortIcon('score')}
              </th>
              <th 
                className={`${styles.sortableHeader} ${styles.levelHeader}`}
                onClick={() => handleSort('level')}
              >
                等级 {getSortIcon('level')}
              </th>
              <th 
                className={`${styles.sortableHeader} ${styles.linesHeader}`}
                onClick={() => handleSort('lines')}
              >
                行数 {getSortIcon('lines')}
              </th>
              <th 
                className={`${styles.sortableHeader} ${styles.dateHeader}`}
                onClick={() => handleSort('created_at')}
              >
                日期 {getSortIcon('created_at')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedLeaderboard.map((entry, index) => (
              <tr key={entry.id} className={styles.row}>
                <td className={styles.rank}>
                  {index + 1}
                  {index < 3 && <span className={styles.medal}>🥇🥈🥉</span>}
                </td>
                <td className={styles.username}>{entry.username}</td>
                <td className={styles.score}>{entry.score.toLocaleString()}</td>
                <td className={styles.level}>{entry.level}</td>
                <td className={styles.lines}>{entry.lines}</td>
                <td className={styles.date}>{formatDate(entry.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedLeaderboard.length === 0 && (
        <div className={styles.empty}>
          <p>暂无排行榜数据</p>
          <p>成为第一个提交分数的玩家吧！</p>
        </div>
      )}
    </div>
  );
}; 