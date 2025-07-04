import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/Navigation.module.css';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        <Link 
          to="/" 
          className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
        >
          🎮 {t('游戏')}
        </Link>
        <Link 
          to="/leaderboard" 
          className={`${styles.navLink} ${location.pathname === '/leaderboard' ? styles.active : ''}`}
        >
          🏆 {t('排行榜')}
        </Link>
        <div style={{ flex: 1 }} />
        <LanguageSwitcher />
      </div>
    </nav>
  );
}; 