import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { logger } from "./utils/logger";

// Export log function for backward compatibility (uses logger internally)
export function log(message: string, source = "express") {
  logger.info(message, { source });
}

export function serveStatic(app: Express) {
  // In production, server runs from dist/index.js, static files are in dist/public
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    logger.error(`Could not find the build directory: ${distPath}`, undefined, {
      path: distPath,
      message: "Make sure to build the client first"
    });
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  logger.info(`Serving static files from: ${distPath}`, { distPath });
  
  // Serve static files with proper caching headers
  app.use(express.static(distPath, {
    maxAge: '1y',
    immutable: true,
    etag: true,
    lastModified: true
  }));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
} 