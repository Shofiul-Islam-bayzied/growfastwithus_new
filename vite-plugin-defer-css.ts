import type { Plugin } from 'vite';

/**
 * Vite plugin to defer non-critical CSS loading
 * This prevents CSS from blocking the initial render
 */
export function deferCSS(): Plugin {
  return {
    name: 'defer-css',
    transformIndexHtml(html) {
      // Find all CSS link tags and make them load asynchronously
      return html.replace(
        /<link([^>]*rel=["']stylesheet["'][^>]*)>/gi,
        (match, attrs) => {
          // Skip if it's already deferred or is a font stylesheet
          if (attrs.includes('media="print"') || attrs.includes('fonts.googleapis.com')) {
            return match;
          }
          // Add media="print" and onload to defer loading
          return `<link${attrs} media="print" onload="this.media='all'; this.onload=null;"><noscript>${match}</noscript>`;
        }
      );
    },
  };
}

