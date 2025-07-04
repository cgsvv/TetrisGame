import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SEO_CONFIG } from '../config/seo';

interface SEOStructuredDataProps {
  type: 'game' | 'leaderboard' | 'webapp';
  data?: any;
}

export const SEOStructuredData: React.FC<SEOStructuredDataProps> = ({ type, data }) => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const createStructuredData = () => {
      let structuredData: any = {};

      switch (type) {
        case 'game':
          structuredData = {
            "@context": "https://schema.org",
            "@type": "Game",
            "name": t('tetris'),
            "description": t('pageDescription.home'),
            "genre": "Puzzle",
            "gamePlatform": "Web Browser",
            "applicationCategory": "Game",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "inLanguage": i18n.language === 'zh' ? "zh-CN" : "en-US"
          };
          break;

        case 'leaderboard':
          structuredData = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": t('leaderboard'),
            "description": t('pageDescription.leaderboard'),
            "numberOfItems": data?.length || 0,
            "itemListElement": data?.map((item: any, index: number) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Person",
                "name": item.username,
                "description": `${t('score')}: ${item.score}, ${t('level')}: ${item.level}, ${t('lines')}: ${item.lines}`
              }
            })) || [],
            "inLanguage": i18n.language === 'zh' ? "zh-CN" : "en-US"
          };
          break;

        case 'webapp':
          structuredData = {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": t('tetris'),
            "description": t('pageDescription.home'),
            "url": SEO_CONFIG.DOMAIN,
            "applicationCategory": "Game",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "author": {
              "@type": "Organization",
              "name": SEO_CONFIG.SITE_NAME
            },
            "featureList": [
              t('classicGameModernExperience'),
              t('aiAssistant'),
              t('leaderboard'),
              t('soundOn')
            ],
            "softwareVersion": "1.0.0",
            "inLanguage": i18n.language === 'zh' ? "zh-CN" : "en-US"
          };
          break;
      }

      // Remove existing structured data
      const existingScript = document.querySelector('script[data-seo-structured]');
      if (existingScript) {
        existingScript.remove();
      }

      // Add new structured data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-structured', 'true');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    };

    createStructuredData();
  }, [type, data, t, i18n.language]);

  return null;
}; 