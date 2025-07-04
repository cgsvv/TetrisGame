import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/Navigation.module.css';
import LanguageSwitcher from './LanguageSwitcher';
import { SoundToggle } from './SoundToggle';
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
          🎮 {t('game')}
        </Link>
        <Link 
          to="/leaderboard" 
          className={`${styles.navLink} ${location.pathname === '/leaderboard' ? styles.active : ''}`}
        >
          🏆 {t('leaderboard')}
        </Link>
        <div style={{ flex: 1 }} />
        <SoundToggle />
        <LanguageSwitcher />
      </div>
    </nav>
  );
}; 