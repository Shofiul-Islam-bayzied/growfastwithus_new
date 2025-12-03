#!/usr/bin/env node

/**
 * Sitemap Generator for GrowFastWithUs
 * Automatically generates sitemap.xml based on templates and pages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DOMAIN = 'https://growfastwithus.com';
const OUTPUT_PATH = path.join(__dirname, '../client/public/sitemap.xml');

// Static pages with their priorities and change frequencies
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/templates', priority: '0.9', changefreq: 'weekly' },
  { url: '/packages', priority: '0.9', changefreq: 'weekly' },
  { url: '/services', priority: '0.8', changefreq: 'monthly' },
  { url: '/booking', priority: '0.8', changefreq: 'monthly' },
  { url: '/blog', priority: '0.9', changefreq: 'daily' },
  { url: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
  { url: '/terms-of-service', priority: '0.5', changefreq: 'yearly' },
  { url: '/gdpr', priority: '0.5', changefreq: 'yearly' },
  { url: '/llm.txt', priority: '0.7', changefreq: 'monthly' }
];

// Template IDs (all current templates from templates.ts)
const templateIds = [
  'ai-medical-practice',
  'real-estate-sales-marketing',
  'ecommerce-order-inventory',
  'customer-support-automation',
  'ai-voice-call-assistant',
  'whatsapp-business-automation',
  'social-media-scheduler-analytics',
  'email-marketing-automation',
  'hr-recruitment-automation',
  'restaurant-hospitality-management',
  'financial-services-automation',
  'legal-practice-management',
  'educational-institution-management',
  'fitness-wellness-business-management',
  'manufacturing-supply-chain-management'
];

// Generate current date in ISO format
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

// Generate sitemap XML
function generateSitemap() {
  const currentDate = getCurrentDate();
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Main Pages -->`;

  // Add static pages
  staticPages.forEach(page => {
    sitemap += `
  <url>
    <loc>${DOMAIN}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  sitemap += `

  <!-- Template Pages -->`;

  // Add template pages
  templateIds.forEach(templateId => {
    sitemap += `
  <url>
    <loc>${DOMAIN}/template/${templateId}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  sitemap += `

</urlset>`;

  return sitemap;
}

// Write sitemap to file
function writeSitemap() {
  try {
    const sitemapContent = generateSitemap();
    
    // Ensure the output directory exists
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(OUTPUT_PATH, sitemapContent, 'utf8');
    console.log(`✅ Sitemap generated successfully: ${OUTPUT_PATH}`);
    console.log(`📊 Total URLs: ${staticPages.length + templateIds.length}`);
    console.log(`🗓️  Last modified: ${getCurrentDate()}`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Generate sitemap index file for multiple sitemaps
function generateSitemapIndex() {
  const currentDate = getCurrentDate();
  
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap-templates.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap-pages.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap-blog.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

  const indexPath = path.join(path.dirname(OUTPUT_PATH), 'sitemap-index.xml');
  fs.writeFileSync(indexPath, sitemapIndex, 'utf8');
  console.log(`✅ Sitemap index generated: ${indexPath}`);
}

// CLI interface - run directly for now
console.log('🚀 Generating sitemap for GrowFastWithUs...\n');

writeSitemap();
generateSitemapIndex();

console.log('\n📋 Next steps:');
console.log('1. Submit sitemap to Google Search Console');
console.log('2. Update robots.txt if needed');
console.log('3. Monitor indexing status');
console.log('\n🔗 Sitemap URL: ' + DOMAIN + '/sitemap.xml');

export {
  generateSitemap,
  writeSitemap,
  generateSitemapIndex,
  templateIds,
  staticPages
}; 