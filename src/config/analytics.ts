// Analytics Configuration
export const ANALYTICS_CONFIG = {
  // Google Analytics 4 Tracking ID
  // Replace with your actual GA4 tracking ID from Google Analytics
  GA_TRACKING_ID: import.meta.env.VITE_GA_TRACKING_ID || 'G-XXXXXXXXXX',
  
  // Enable/disable analytics
  ENABLED: import.meta.env.VITE_ANALYTICS_ENABLED !== 'false',
  
  // Development mode check
  IS_DEVELOPMENT: import.meta.env.DEV,
} as const;

// Analytics event categories
export const ANALYTICS_CATEGORIES = {
  GAME: 'game',
  LEADERBOARD: 'leaderboard',
  SETTINGS: 'settings',
  USER: 'user',
  PERFORMANCE: 'performance',
} as const;

// Analytics event actions
export const ANALYTICS_ACTIONS = {
  // Game events
  GAME_START: 'game_start',
  GAME_PAUSE: 'game_pause',
  GAME_RESUME: 'game_resume',
  GAME_OVER: 'game_over',
  PIECE_MOVE: 'piece_move',
  PIECE_ROTATE: 'piece_rotate',
  LINE_CLEAR: 'line_clear',
  LEVEL_UP: 'level_up',
  
  // Settings events
  AI_MODE_TOGGLE: 'ai_mode_toggle',
  SPEED_CHANGE: 'speed_change',
  SOUND_TOGGLE: 'sound_toggle',
  LANGUAGE_CHANGE: 'language_change',
  
  // Leaderboard events
  SCORE_SUBMIT: 'score_submit',
  LEADERBOARD_VIEW: 'leaderboard_view',
  
  // User events
  PAGE_VIEW: 'page_view',
  SESSION_START: 'session_start',
  SESSION_END: 'session_end',
} as const; 