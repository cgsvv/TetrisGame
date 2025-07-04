// SEO Configuration
export const SEO_CONFIG = {
  DOMAIN: 'https://tetris-game-sooty.vercel.app',
  SITE_NAME: 'Tetris Game',
  DEFAULT_LANGUAGE: 'en',
  SUPPORTED_LANGUAGES: ['en', 'zh'],
} as const;

// SEO Meta tags configuration
export const SEO_META = {
  TITLE: {
    HOME: 'Tetris Game - Classic Tetris with AI Assistant & Online Leaderboard',
    LEADERBOARD: 'Leaderboard - Tetris Game High Scores',
    DEFAULT: 'Tetris Game',
  },
  DESCRIPTION: {
    HOME: 'Play the classic Tetris game with modern features: AI assistant, adjustable speed, online leaderboard, sound effects, and responsive design. Built with React, TypeScript, and Vite.',
    LEADERBOARD: 'View the top scores and rankings for the Tetris game. Compete with players worldwide and see who has the highest score.',
    DEFAULT: 'Play the classic Tetris game with modern features.',
  },
  KEYWORDS: 'tetris, tetris game, online tetris, classic tetris, tetris with ai, tetris leaderboard, react tetris, typescript tetris, browser game, puzzle game',
  AUTHOR: 'Tetris Game',
  IMAGES: {
    OG: `${SEO_CONFIG.DOMAIN}/og-image.png`,
    TWITTER: `${SEO_CONFIG.DOMAIN}/twitter-image.png`,
    SCREENSHOT: `${SEO_CONFIG.DOMAIN}/screenshot.png`,
  },
} as const; 