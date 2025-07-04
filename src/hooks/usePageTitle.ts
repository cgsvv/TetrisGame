import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

export const usePageTitle = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const updatePageTitle = () => {
      let title = '';
      let description = '';

      // Set title and description based on route
      switch (location.pathname) {
        case '/':
          title = t('pageTitle.home', 'Tetris Game - Classic Tetris with AI Assistant & Online Leaderboard');
          description = t('pageDescription.home', 'Play the classic Tetris game with modern features: AI assistant, adjustable speed, online leaderboard, sound effects, and responsive design.');
          break;
        case '/leaderboard':
          title = t('pageTitle.leaderboard', 'Leaderboard - Tetris Game High Scores');
          description = t('pageDescription.leaderboard', 'View the top scores and rankings for the Tetris game. Compete with players worldwide and see who has the highest score.');
          break;
        default:
          title = t('pageTitle.default', 'Tetris Game');
          description = t('pageDescription.default', 'Play the classic Tetris game with modern features.');
      }

      // Update document title
      document.title = title;

      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }

      // Update Open Graph title and description
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', title);
      }

      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', description);
      }

      // Update Twitter title and description
      const twitterTitle = document.querySelector('meta[property="twitter:title"]');
      if (twitterTitle) {
        twitterTitle.setAttribute('content', title);
      }

      const twitterDescription = document.querySelector('meta[property="twitter:description"]');
      if (twitterDescription) {
        twitterDescription.setAttribute('content', description);
      }

      // Update language attribute
      document.documentElement.lang = i18n.language === 'zh' ? 'zh-CN' : 'en';

      // Update Open Graph locale
      const ogLocale = document.querySelector('meta[property="og:locale"]');
      if (ogLocale) {
        ogLocale.setAttribute('content', i18n.language === 'zh' ? 'zh_CN' : 'en_US');
      }
    };

    updatePageTitle();
  }, [location.pathname, t, i18n.language]);
}; 