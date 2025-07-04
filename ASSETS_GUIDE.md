# Visual Assets Guide

[中文版 / Chinese Version](ASSETS_GUIDE_CN.md)

## Overview

This guide explains how to generate and manage visual assets for your Tetris game website.

## Missing Assets

The following assets need to be generated and placed in the `public/` directory:

### ✅ Created Assets
- `favicon.svg` - SVG favicon for the website

### 🔄 Need to Generate
- `icon-192x192.png` - PWA icon (192x192)
- `icon-512x512.png` - PWA icon (512x512)
- `og-image.png` - Open Graph image (1200x630)
- `twitter-image.png` - Twitter Card image (1200x600)
- `screenshot.png` - Game screenshot (1280x720)
- `favicon-32x32.png` - Standard favicon (32x32)
- `favicon-16x16.png` - Standard favicon (16x16)
- `apple-touch-icon.png` - Apple touch icon (180x180)

## How to Generate Assets

### Option 1: Use the Asset Generator (Recommended)

1. Open `generate-assets.html` in your browser
2. The page will automatically generate all assets
3. Click the download links to save each asset
4. Place the downloaded files in the `public/` directory

### Option 2: Manual Creation

#### PWA Icons
- **Size**: 192x192 and 512x512 pixels
- **Format**: PNG with transparency
- **Design**: Tetris-themed with your brand colors
- **Tools**: Figma, Photoshop, or online icon generators

#### Social Media Images
- **OG Image**: 1200x630 pixels
- **Twitter Image**: 1200x600 pixels
- **Content**: Game title, features, and visual appeal
- **Tools**: Canva, Figma, or design software

#### Screenshots
- **Size**: 1280x720 pixels
- **Content**: Game in action with UI visible
- **Quality**: High resolution, clear and appealing

## Asset Specifications

### Favicon
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
```

### PWA Manifest
```json
{
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Open Graph
```html
<meta property="og:image" content="https://tetris-game-sooty.vercel.app/og-image.png" />
```

### Twitter Cards
```html
<meta property="twitter:image" content="https://tetris-game-sooty.vercel.app/twitter-image.png" />
```

## Color Palette

Use these colors for consistency:

### Primary Colors
- **Blue**: `#4A90E2` (Primary brand color)
- **Dark Blue**: `#357ABD` (Hover states)

### Tetris Block Colors
- **Red**: `#FF6B6B`
- **Cyan**: `#4ECDC4`
- **Blue**: `#45B7D1`
- **Green**: `#96CEB4`
- **Yellow**: `#FFEAA7`
- **Purple**: `#DDA0DD`
- **Teal**: `#98D8C8`
- **Orange**: `#F7DC6F`

### Background Colors
- **Dark**: `#1a1a1a`
- **Medium Dark**: `#2a2a2a`
- **Light**: `#ffffff`

## File Structure

```
public/
├── favicon.svg              ✅ Created
├── favicon-32x32.png        🔄 Generate
├── favicon-16x16.png        🔄 Generate
├── apple-touch-icon.png     🔄 Generate
├── icon-192x192.png         🔄 Generate
├── icon-512x512.png         🔄 Generate
├── og-image.png             🔄 Generate
├── twitter-image.png        🔄 Generate
├── screenshot.png           🔄 Generate
├── manifest.json            ✅ Created
├── robots.txt               ✅ Created
├── sitemap.xml              ✅ Created
└── sounds/                  ✅ Complete
```

## Testing Assets

### Favicon Testing
1. Clear browser cache
2. Visit your website
3. Check browser tab for favicon
4. Test on different browsers

### PWA Testing
1. Open Chrome DevTools
2. Go to Application tab
3. Check Manifest section
4. Verify icons are loading

### Social Media Testing
1. Use Facebook Sharing Debugger
2. Use Twitter Card Validator
3. Use LinkedIn Post Inspector
4. Test with actual social media posts

## Optimization Tips

### Image Optimization
- **Compress**: Use tools like TinyPNG or ImageOptim
- **Format**: Use PNG for icons, WebP for photos if supported
- **Size**: Keep files under 100KB when possible
- **Quality**: Balance between file size and visual quality

### Performance
- **Lazy Loading**: Implement for non-critical images
- **CDN**: Consider using a CDN for better performance
- **Caching**: Set proper cache headers for static assets

## Troubleshooting

### Common Issues
1. **Favicon not showing**: Clear browser cache
2. **PWA icons missing**: Check manifest.json paths
3. **Social images not loading**: Verify absolute URLs
4. **File size too large**: Compress images

### Debugging
1. Check browser console for 404 errors
2. Verify file paths in HTML
3. Test with different browsers
4. Use browser dev tools to inspect network requests

## Next Steps

After generating all assets:

1. **Test**: Verify all assets load correctly
2. **Optimize**: Compress images for better performance
3. **Deploy**: Push changes to production
4. **Monitor**: Check analytics for any issues
5. **Update**: Refresh assets periodically

## Resources

- [Favicon Generator](https://realfavicongenerator.net/)
- [PWA Icon Generator](https://www.pwabuilder.com/imageGenerator)
- [Social Media Image Templates](https://www.canva.com/)
- [Image Compression Tools](https://tinypng.com/) 