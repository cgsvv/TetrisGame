import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/Navigation.module.css';

export const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        <Link 
          to="/" 
          className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
        >
          🎮 游戏
        </Link>
        <Link 
          to="/leaderboard" 
          className={`${styles.navLink} ${location.pathname === '/leaderboard' ? styles.active : ''}`}
        >
          🏆 排行榜
        </Link>
      </div>
    </nav>
  );
}; 