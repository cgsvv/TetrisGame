import React, { useState, useEffect } from 'react';
import { setGlobalMute, getGlobalMute } from '../hooks/useSound';
import styles from '../styles/SoundToggle.module.css';

export const SoundToggle: React.FC = () => {
  const [muted, setMuted] = useState(getGlobalMute());

  useEffect(() => {
    setGlobalMute(muted);
  }, [muted]);

  return (
    <div className={styles.soundToggle}>
      <label className={styles.toggleLabel}>
        <input
          type="checkbox"
          checked={!muted}
          onChange={() => setMuted((m) => !m)}
          className={styles.toggleInput}
        />
        <span className={styles.toggleSlider}></span>
        <span className={styles.toggleText}>
          {muted ? '音效已关闭' : '音效已开启'}
        </span>
      </label>
    </div>
  );
}; 