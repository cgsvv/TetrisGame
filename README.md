# Tetris Game

A modern Tetris game built with React + TypeScript + Vite.

[中文版 / Chinese Version](README_CN.md)

## Features

- 🎮 Classic Tetris gameplay
- 🎨 Modern UI design
- 🤖 AI Assistant mode (multiple difficulty levels)
- ⚡ Adjustable game speed
- 🏆 Online leaderboard system
- 🔊 Sound effects support
- 📱 Responsive design

## Sound Files

The game supports sound effects. Please place the following sound files in the `public/sounds/` directory:

- `move.wav` - Piece movement sound
- `rotate.wav` - Piece rotation sound
- `drop.wav` - Hard drop sound
- `land.wav` - Piece landing sound
- `clear.wav` - Line clear sound
- `start.wav` - Game start sound
- `pause.wav` - Game pause sound
- `resume.wav` - Game resume sound
- `gameover.wav` - Game over sound

Sound files should be in WAV format, 44.1kHz sample rate, with duration between 0.5-2 seconds.

## Installation and Setup

1. Clone the repository
```bash
git clone <repository-url>
cd ChessGame
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp env.example .env.local
```

Edit the `.env.local` file with your Supabase configuration:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser and visit `http://localhost:5173`

## Game Controls

- **Arrow Keys**: Move pieces
- **Space**: Rotate pieces
- **Enter**: Hard drop
- **P**: Pause/Resume game
- **R**: Restart game

## Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: React Hooks + useReducer
- **Styling**: CSS Modules
- **Backend Service**: Supabase
- **Routing**: React Router
- **Data Fetching**: React Query

## Project Structure

```
src/
├── components/          # React components
├── hooks/              # Custom Hooks
├── lib/                # Third-party library configs
├── pages/              # Page components
├── styles/             # Style files
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx             # Main app component
```

## Deployment

The project can be deployed to any static file hosting platform:

- Vercel
- Netlify
- GitHub Pages
- Alibaba Cloud OSS
- Tencent Cloud COS

### Current Deployment
- **Domain**: https://tetris-game-sooty.vercel.app
- **Platform**: Vercel
- **Status**: Live

### Updating Domain
If you need to change the domain, use the provided script:
```bash
node scripts/update-domain.js https://your-new-domain.com
```

This will automatically update all SEO-related files with the new domain.

## License

MIT License 