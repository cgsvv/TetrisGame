import React, { useState, useEffect } from 'react';
import { setGlobalMute, getGlobalMute } from '../hooks/useSound';
import styles from '../styles/SoundToggle.module.css';
import { useTranslation } from 'react-i18next';
import { safeTrackGameEvent } from './GoogleAnalytics';

export const SoundToggle: React.FC = () => {
  const { t } = useTranslation();
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
          onChange={() => {
            const newMuted = !muted;
            setMuted(newMuted);
            safeTrackGameEvent.soundToggle(!newMuted);
          }}
          className={styles.toggleInput}
        />
        <span className={styles.toggleSlider}></span>
        <span className={styles.toggleText}>
          {muted ? t('soundOff') : t('soundOn')}
        </span>
      </label>
    </div>
  );
}; 