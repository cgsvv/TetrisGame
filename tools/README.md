# Development Tools

This directory contains utility tools for development and asset generation.

## 🎵 Sound Generator

**File**: `generate_sounds.html`

A web-based tool to generate sound effects for the Tetris game. Generates WAV files for:

- `move.wav` - Piece movement sound
- `rotate.wav` - Piece rotation sound  
- `drop.wav` - Hard drop sound
- `land.wav` - Piece landing sound
- `clear.wav` - Line clear sound
- `start.wav` - Game start sound
- `pause.wav` - Game pause sound
- `resume.wav` - Game resume sound
- `gameover.wav` - Game over sound

### Usage
1. Open `generate_sounds.html` in a web browser
2. Click the buttons to generate each sound effect
3. WAV files will be downloaded automatically
4. Place the generated files in `public/sounds/` directory

## 🖼️ Asset Generator

**File**: `generate-assets.html`

A web-based tool to generate visual assets for the game:

- PWA icons (192x192, 512x512)
- Social media images (Open Graph, Twitter)
- Screenshots
- Favicon

### Usage
1. Open `generate-assets.html` in a web browser
2. Follow the instructions to generate assets
3. Download and place in appropriate directories

## 📁 File Structure

```
tools/
├── README.md              # This file
├── generate_sounds.html   # Sound effect generator
└── generate-assets.html   # Visual asset generator
```

## 🔧 Development Notes

These tools are for development use only and are not part of the main application. They help generate assets that are then used by the game.

### Sound Requirements
- Format: WAV
- Sample Rate: 44.1kHz
- Duration: 0.5-2 seconds
- Volume: Appropriate for game use

### Asset Requirements
- Icons: PNG format, various sizes
- Social images: 1200x630px recommended
- Screenshots: Game screenshots for marketing 