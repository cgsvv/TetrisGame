import React, { useState, ReactNode } from 'react';
import styles from '../styles/CollapsePanel.module.css';

interface CollapsePanelProps {
  title: ReactNode;
  defaultCollapsed?: boolean;
  children: ReactNode;
}

export const CollapsePanel: React.FC<CollapsePanelProps> = ({
  title,
  defaultCollapsed = true,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <div className={styles.panel}>
      <div
        className={styles.header}
        onClick={() => setCollapsed((c) => !c)}
        tabIndex={0}
        role="button"
        aria-expanded={!collapsed}
      >
        <span className={styles.title}>{title}</span>
        <span className={styles.icon}>{collapsed ? '▼' : '▲'}</span>
      </div>
      {!collapsed && <div className={styles.content}>{children}</div>}
    </div>
  );
}; 