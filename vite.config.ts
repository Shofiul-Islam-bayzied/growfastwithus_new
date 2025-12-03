import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { deferCSS } from "./vite-plugin-defer-css";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    // Defer CSS loading in production to prevent render blocking
    ...(process.env.NODE_ENV === "production" ? [deferCSS()] : []),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    minify: "esbuild",
    sourcemap: false,
    cssMinify: true,
    // Enable tree shaking
    treeshake: true,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split node_modules into optimized chunks
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            // Router
            if (id.includes('wouter')) {
              return 'router';
            }
            // Query client
            if (id.includes('@tanstack/react-query')) {
              return 'query';
            }
            // Radix UI components
            if (id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            // Three.js - lazy load
            if (id.includes('three')) {
              return 'three';
            }
            // Framer Motion - lazy load
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            // Icons
            if (id.includes('lucide-react') || id.includes('react-icons')) {
              return 'icons';
            }
            // Forms
            if (id.includes('react-hook-form') || id.includes('@hookform')) {
              return 'react-hook-form';
            }
            // Other vendor code
            return 'vendor';
          }
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return 'assets/img/[name]-[hash][extname]';
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[ext]/[name]-[hash].[ext]';
        },
      },
    },
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "growfastwithus.com",
      ".growfastwithus.com",
      "my-personal-sites-grfwu-main.luup7t.easypanel.host",
      ".easypanel.host",
      ".easypanel.io"
    ],
  },
});
