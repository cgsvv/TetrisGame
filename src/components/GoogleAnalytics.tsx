import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ANALYTICS_CONFIG } from '../config/analytics';

// Google Analytics 4 Configuration
const GA_TRACKING_ID = ANALYTICS_CONFIG.GA_TRACKING_ID;

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Initialize Google Analytics
const initializeGA = () => {
  if (typeof window !== 'undefined' && !window.gtag) {
    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script1);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track page views
const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
      page_title: document.title,
    });
  }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track game events
export const trackGameEvent = {
  gameStart: () => trackEvent('game_start', 'game'),
  gamePause: () => trackEvent('game_pause', 'game'),
  gameResume: () => trackEvent('game_resume', 'game'),
  gameOver: (score: number, level: number, lines: number) => {
    trackEvent('game_over', 'game', `score_${score}`, score);
    trackEvent('level_reached', 'game', `level_${level}`, level);
    trackEvent('lines_cleared', 'game', `lines_${lines}`, lines);
  },
  scoreSubmit: (score: number) => trackEvent('score_submit', 'leaderboard', `score_${score}`, score),
  aiModeToggle: (enabled: boolean) => trackEvent('ai_mode_toggle', 'game', enabled ? 'enabled' : 'disabled'),
  speedChange: (speed: number) => trackEvent('speed_change', 'game', `speed_${speed}`, speed),
  soundToggle: (enabled: boolean) => trackEvent('sound_toggle', 'settings', enabled ? 'enabled' : 'disabled'),
  languageChange: (language: string) => trackEvent('language_change', 'settings', language),
};

export const GoogleAnalytics: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize GA on component mount
    initializeGA();
  }, []);

  useEffect(() => {
    // Track page views on route changes
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      trackPageView(location.pathname);
    }
  }, [location]);

  return null; // This component doesn't render anything
};

// Development mode check
export const isDevelopment = ANALYTICS_CONFIG.IS_DEVELOPMENT;

// Conditional tracking - only track in production and when enabled
export const safeTrackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (!isDevelopment && ANALYTICS_CONFIG.ENABLED) {
    trackEvent(action, category, label, value);
  } else {
    console.log('📊 Analytics Event:', { action, category, label, value });
  }
};

export const safeTrackGameEvent = {
  gameStart: () => {
    if (!isDevelopment) {
      trackGameEvent.gameStart();
    } else {
      console.log('🎮 Game Event: Game Started');
    }
  },
  gamePause: () => {
    if (!isDevelopment) {
      trackGameEvent.gamePause();
    } else {
      console.log('🎮 Game Event: Game Paused');
    }
  },
  gameResume: () => {
    if (!isDevelopment) {
      trackGameEvent.gameResume();
    } else {
      console.log('🎮 Game Event: Game Resumed');
    }
  },
  gameOver: (score: number, level: number, lines: number) => {
    if (!isDevelopment) {
      trackGameEvent.gameOver(score, level, lines);
    } else {
      console.log('🎮 Game Event: Game Over', { score, level, lines });
    }
  },
  scoreSubmit: (score: number) => {
    if (!isDevelopment) {
      trackGameEvent.scoreSubmit(score);
    } else {
      console.log('🏆 Game Event: Score Submitted', { score });
    }
  },
  aiModeToggle: (enabled: boolean) => {
    if (!isDevelopment) {
      trackGameEvent.aiModeToggle(enabled);
    } else {
      console.log('🤖 Game Event: AI Mode Toggle', { enabled });
    }
  },
  speedChange: (speed: number) => {
    if (!isDevelopment) {
      trackGameEvent.speedChange(speed);
    } else {
      console.log('⚡ Game Event: Speed Change', { speed });
    }
  },
  soundToggle: (enabled: boolean) => {
    if (!isDevelopment) {
      trackGameEvent.soundToggle(enabled);
    } else {
      console.log('🔊 Game Event: Sound Toggle', { enabled });
    }
  },
  languageChange: (language: string) => {
    if (!isDevelopment) {
      trackGameEvent.languageChange(language);
    } else {
      console.log('🌐 Game Event: Language Change', { language });
    }
  },
}; 