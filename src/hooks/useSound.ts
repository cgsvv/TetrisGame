import { useCallback } from 'react';

let globalMute = false;

export const setGlobalMute = (mute: boolean) => {
  globalMute = mute;
};

export const getGlobalMute = () => globalMute;

export function useSound() {
  // 播放指定音效
  const play = useCallback((name: string) => {
    if (globalMute) return;
    const audio = new Audio(`/sounds/${name}.wav`);
    audio.volume = 0.5;
    audio.play();
  }, []);

  return { play };
} 