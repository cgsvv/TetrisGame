import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/LanguageSwitcher.module.css';
import { safeTrackGameEvent } from './GoogleAnalytics';

const LANGS = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
    safeTrackGameEvent.languageChange(lng);
    setOpen(false);
  };

  const current = LANGS.find(l => l.code === i18n.language) || LANGS[0];

  return (
    <div className={styles.langSwitcher} ref={ref}>
      <button className={styles.langBtn} onClick={() => setOpen(v => !v)}>
        {current.label} <span className={styles.arrow}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className={styles.dropdown}>
          {LANGS.map(l => (
            <div
              key={l.code}
              className={
                styles.dropdownItem + (l.code === i18n.language ? ' ' + styles.active : '')
              }
              onClick={() => changeLang(l.code)}
            >
              {l.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 