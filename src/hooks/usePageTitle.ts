import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

export const usePageTitle = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    let title = '';
    
    if (location.pathname === '/') {
      title = t('俄罗斯方块');
    } else if (location.pathname === '/leaderboard') {
      title = `${t('排行榜')} - ${t('俄罗斯方块')}`;
    } else {
      title = t('俄罗斯方块');
    }

    document.title = title;
  }, [location.pathname, t, i18n.language]);
}; 