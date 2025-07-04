#!/usr/bin/env node

/**
 * Script to update domain across all SEO-related files
 * Usage: node scripts/update-domain.js <new-domain>
 * Example: node scripts/update-domain.js https://my-new-domain.com
 */

const fs = require('fs');
const path = require('path');

const NEW_DOMAIN = process.argv[2];

if (!NEW_DOMAIN) {
  console.error('Please provide a new domain as an argument');
  console.error('Usage: node scripts/update-domain.js <new-domain>');
  console.error('Example: node scripts/update-domain.js https://my-new-domain.com');
  process.exit(1);
}

// Remove trailing slash if present
const cleanDomain = NEW_DOMAIN.replace(/\/$/, '');

const filesToUpdate = [
  {
    path: 'src/config/seo.ts',
    patterns: [
      { from: /DOMAIN: 'https:\/\/[^']+'/, to: `DOMAIN: '${cleanDomain}'` }
    ]
  },
  {
    path: 'index.html',
    patterns: [
      { from: /content="https:\/\/[^"]+\//g, to: `content="${cleanDomain}/` },
      { from: /href="https:\/\/[^"]+\//g, to: `href="${cleanDomain}/` },
      { from: /"url": "https:\/\/[^"]+"/g, to: `"url": "${cleanDomain}"` },
      { from: /"screenshot": "https:\/\/[^"]+"/g, to: `"screenshot": "${cleanDomain}/screenshot.png"` }
    ]
  },
  {
    path: 'public/sitemap.xml',
    patterns: [
      { from: /<loc>https:\/\/[^<]+<\/loc>/g, to: `<loc>${cleanDomain}</loc>` }
    ]
  },
  {
    path: 'public/robots.txt',
    patterns: [
      { from: /Sitemap: https:\/\/[^\n]+/, to: `Sitemap: ${cleanDomain}/sitemap.xml` }
    ]
  }
];

console.log(`Updating domain to: ${cleanDomain}`);
console.log('');

filesToUpdate.forEach(({ path: filePath, patterns }) => {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    patterns.forEach(({ from, to }) => {
      const newContent = content.replace(from, to);
      if (newContent !== content) {
        content = newContent;
        updated = true;
      }
    });

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
    } else {
      console.log(`ℹ️  No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
});

console.log('');
console.log('Domain update completed!');
console.log('');
console.log('Next steps:');
console.log('1. Review the changes');
console.log('2. Commit and push the updates');
console.log('3. Deploy to your new domain');
console.log('4. Update your Vercel project settings if needed'); 