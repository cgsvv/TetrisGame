import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/CollapsePanel.module.css';

interface CollapsePanelProps {
  title: string;
  defaultCollapsed?: boolean;
  children: React.ReactNode;
}

export const CollapsePanel: React.FC<CollapsePanelProps> = ({ title, defaultCollapsed = false, children }) => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <div className={styles.panel}>
      <div className={styles.header} onClick={() => setCollapsed(!collapsed)}>
        <span>{t(title)}</span>
        <span className={styles.arrow}>{collapsed ? '▼' : '▲'}</span>
      </div>
      {!collapsed && <div className={styles.content}>{children}</div>}
    </div>
  );
}; 