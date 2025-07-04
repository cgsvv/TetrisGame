import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

export const usePageTitle = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    let title = '';
    
    if (location.pathname === '/') {
      title = t('tetris');
    } else if (location.pathname === '/leaderboard') {
      title = `${t('leaderboard')} - ${t('tetris')}`;
    } else {
      title = t('tetris');
    }

    document.title = title;
  }, [location.pathname, t, i18n.language]);
}; 