import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };
  return (
    <select value={i18n.language} onChange={e => changeLang(e.target.value)} style={{ marginLeft: 8, borderRadius: 4, padding: '2px 6px' }}>
      <option value="zh">中文</option>
      <option value="en">English</option>
    </select>
  );
};

export default LanguageSwitcher; 