#!/usr/bin/env node

/**
 * SEO Check Script for Tetris Game
 * Run with: node scripts/check-seo.js
 */

import https from 'https';
import http from 'http';

const SITE_URL = 'https://tetris-game-sooty.vercel.app';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function checkSEO() {
  log('🔍 SEO Check for Tetris Game', 'bold');
  log('=' * 50, 'blue');
  
  try {
    // 1. Check if site is accessible
    log('\n1. Checking site accessibility...', 'blue');
    const siteResponse = await makeRequest(SITE_URL);
    if (siteResponse.status === 200) {
      log('✅ Site is accessible', 'green');
    } else {
      log(`❌ Site returned status: ${siteResponse.status}`, 'red');
    }
    
    // 2. Check sitemap
    log('\n2. Checking sitemap...', 'blue');
    try {
      const sitemapResponse = await makeRequest(`${SITE_URL}/sitemap.xml`);
      if (sitemapResponse.status === 200) {
        log('✅ Sitemap is accessible', 'green');
        if (sitemapResponse.data.includes('tetris-game-sooty.vercel.app')) {
          log('✅ Sitemap contains correct URLs', 'green');
        } else {
          log('⚠️  Sitemap might need updating', 'yellow');
        }
      } else {
        log(`❌ Sitemap returned status: ${sitemapResponse.status}`, 'red');
      }
    } catch (error) {
      log('❌ Sitemap not accessible', 'red');
    }
    
    // 3. Check robots.txt
    log('\n3. Checking robots.txt...', 'blue');
    try {
      const robotsResponse = await makeRequest(`${SITE_URL}/robots.txt`);
      if (robotsResponse.status === 200) {
        log('✅ Robots.txt is accessible', 'green');
        if (robotsResponse.data.includes('sitemap')) {
          log('✅ Robots.txt references sitemap', 'green');
        } else {
          log('⚠️  Robots.txt should reference sitemap', 'yellow');
        }
      } else {
        log(`❌ Robots.txt returned status: ${robotsResponse.status}`, 'red');
      }
    } catch (error) {
      log('❌ Robots.txt not accessible', 'red');
    }
    
    // 4. Check manifest.json
    log('\n4. Checking PWA manifest...', 'blue');
    try {
      const manifestResponse = await makeRequest(`${SITE_URL}/manifest.json`);
      if (manifestResponse.status === 200) {
        log('✅ Manifest.json is accessible', 'green');
        const manifest = JSON.parse(manifestResponse.data);
        if (manifest.name && manifest.short_name) {
          log('✅ Manifest has required fields', 'green');
        } else {
          log('⚠️  Manifest missing some fields', 'yellow');
        }
      } else {
        log(`❌ Manifest.json returned status: ${manifestResponse.status}`, 'red');
      }
    } catch (error) {
      log('❌ Manifest.json not accessible', 'red');
    }
    
    // 5. Check Google indexing
    log('\n5. Checking Google indexing...', 'blue');
    try {
      const googleResponse = await makeRequest(`https://www.google.com/search?q=site:${SITE_URL.replace('https://', '')}`);
      if (googleResponse.data.includes('About') && googleResponse.data.includes('results')) {
        log('✅ Site appears to be indexed by Google', 'green');
      } else {
        log('⚠️  Site may not be indexed by Google yet', 'yellow');
        log('   This is normal for new sites. Submit to Google Search Console.', 'yellow');
      }
    } catch (error) {
      log('⚠️  Could not check Google indexing', 'yellow');
    }
    
    // 6. Check meta tags
    log('\n6. Checking meta tags...', 'blue');
    if (siteResponse.data.includes('<title>') && siteResponse.data.includes('<meta name="description"')) {
      log('✅ Basic meta tags are present', 'green');
    } else {
      log('❌ Missing basic meta tags', 'red');
    }
    
    if (siteResponse.data.includes('og:title') && siteResponse.data.includes('og:description')) {
      log('✅ Open Graph tags are present', 'green');
    } else {
      log('❌ Missing Open Graph tags', 'red');
    }
    
    if (siteResponse.data.includes('twitter:card')) {
      log('✅ Twitter Card tags are present', 'green');
    } else {
      log('❌ Missing Twitter Card tags', 'red');
    }
    
    // 7. Check structured data
    log('\n7. Checking structured data...', 'blue');
    if (siteResponse.data.includes('application/ld+json')) {
      log('✅ Structured data is present', 'green');
    } else {
      log('❌ Missing structured data', 'red');
    }
    
    // 8. Recommendations
    log('\n📋 SEO Recommendations:', 'bold');
    log('1. Submit your site to Google Search Console', 'yellow');
    log('2. Request indexing for main pages', 'yellow');
    log('3. Submit your sitemap to Search Console', 'yellow');
    log('4. Share your site on social media', 'yellow');
    log('5. Get backlinks from gaming directories', 'yellow');
    log('6. Create more content (blog, FAQ, etc.)', 'yellow');
    log('7. Monitor your progress in Search Console', 'yellow');
    
    log('\n📚 Resources:', 'bold');
    log('• Google Search Console: https://search.google.com/search-console', 'blue');
    log('• SEO Guide: ./GOOGLE_SEO_GUIDE.md', 'blue');
    log('• Analytics Guide: ./ANALYTICS_EXAMPLE.md', 'blue');
    
  } catch (error) {
    log(`❌ Error during SEO check: ${error.message}`, 'red');
  }
}

// Run the check
checkSEO(); 