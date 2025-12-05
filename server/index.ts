import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import session from 'express-session';
import compression from 'compression';
import { setupSecurityMiddleware } from "./middleware/security";
import { validateAndExitIfInvalid } from "./utils/env-validation";
import { logger } from "./utils/logger";

// Validate environment variables at startup
validateAndExitIfInvalid();

const app = express();

// Enable compression for production performance (gzip/deflate)
// This should come BEFORE other middleware to compress responses
app.use(compression({
  // Only compress responses larger than 1KB
  threshold: 1024,
  // Compression level (0-9, higher = better compression but slower)
  level: 6,
  // Filter function to determine what to compress
  filter: (req, res) => {
    // Don't compress if request includes 'x-no-compression' header
    if (req.headers['x-no-compression']) {
      return false;
    }
    // Use compression filter default
    return compression.filter(req, res);
  }
}));

// Setup security middleware FIRST (before CORS to maintain compatibility)
setupSecurityMiddleware(app);

// CORS Configuration - configurable via environment variable
const getAllowedOrigins = (): (string | RegExp)[] => {
  // If ALLOWED_ORIGINS is set, use it (comma-separated list)
  if (process.env.ALLOWED_ORIGINS) {
    return process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
  }
  
  // Default origins for development and common production domains
  const defaultOrigins: (string | RegExp)[] = [
    'http://localhost:5000',
    'http://localhost:3000',
    'https://growfastwithus.com',
    'https://www.growfastwithus.com',
    /\.easypanel\.host$/,
    /\.easypanel\.io$/
  ];
  
  return defaultOrigins;
};

const allowedOrigins = getAllowedOrigins();

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (origin) {
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin;
      } else {
        return allowed.test(origin);
      }
    });
    
    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(express.json({ limit: '10mb' })); // Add size limit for security
app.use(express.urlencoded({ extended: false, limit: '10mb' })); // Add size limit

// Session middleware - Enhanced for production security
const isProduction = process.env.NODE_ENV === 'production';

// SESSION_SECRET should be validated by env-validation, but provide fallback for development
if (isProduction && !process.env.SESSION_SECRET) {
  console.error('❌ SESSION_SECRET is required in production. This should have been caught by validation.');
  process.exit(1);
}

const sessionConfig: session.SessionOptions = {
  secret: process.env.SESSION_SECRET || 'supersecret', // Fallback only for development
  resave: false,
  saveUninitialized: false,
  name: 'sessionId', // Custom name for security (not default 'connect.sid')
  cookie: { 
    secure: isProduction, // true in production with HTTPS
    httpOnly: true, 
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: isProduction ? 'strict' : 'lax', // CSRF protection
    domain: isProduction && process.env.COOKIE_DOMAIN 
      ? process.env.COOKIE_DOMAIN 
      : undefined
  }
};

// Use PostgreSQL session store in production if standard PostgreSQL connection available
// Note: Neon serverless uses WebSocket, so connect-pg-simple may not work
// IMPORTANT: Memory store will NOT work in multi-instance deployments (sessions won't be shared)
if (isProduction && process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('neon.tech')) {
  try {
    const pgSession = require('connect-pg-simple')(session);
    // Only try to use session store if we have a standard PostgreSQL connection
    // Neon serverless pool won't work with connect-pg-simple
    const dbModule = require('./db');
    const pool = dbModule?.pool;
    
    if (pool && typeof pool.query === 'function') {
      sessionConfig.store = new pgSession({
        pool: pool,
        tableName: 'user_sessions',
        createTableIfMissing: true
      });
      logger.info('✅ Using PostgreSQL session store (sessions will persist across restarts)');
    } else {
      logger.warn('⚠️  WARNING: Using memory session store in production. Sessions will be lost on restart and won\'t work in multi-instance deployments.');
      logger.warn('   Consider using a standard PostgreSQL connection (not Neon serverless) for production.');
    }
  } catch (error) {
    logger.error('⚠️  WARNING: Could not setup PostgreSQL session store, using memory store', error);
    logger.warn('   This is NOT recommended for production multi-instance deployments.');
  }
} else if (isProduction) {
  logger.warn('⚠️  WARNING: Using memory session store in production (Neon serverless database detected).');
  logger.warn('   Sessions will be lost on restart and won\'t work in multi-instance deployments.');
  logger.warn('   For production, consider using a standard PostgreSQL connection with connect-pg-simple.');
}

app.use(session(sessionConfig));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      const context: Record<string, any> = {
        method: req.method,
        path,
        statusCode: res.statusCode,
        duration,
        ip: req.ip
      };
      
      if (capturedJsonResponse) {
        // Truncate large responses for logging
        const responseStr = JSON.stringify(capturedJsonResponse);
        context.response = responseStr.length > 200 ? responseStr.slice(0, 200) + "…" : responseStr;
      }

      logger.request(req.method, path, res.statusCode, duration, context);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log error with context
    logger.error('Unhandled error in request', err, {
      method: req.method,
      path: req.path,
      statusCode: status,
      ip: req.ip
    });

    // Don't expose internal error details in production
    const errorMessage = process.env.NODE_ENV === 'production' && status === 500
      ? "Internal Server Error"
      : message;

    res.status(status).json({ message: errorMessage });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  const nodeEnv = process.env.NODE_ENV || 'development';
  const expressEnv = app.get("env") || 'development';
  const isDevelopment = nodeEnv === "development" || expressEnv === "development";
  
  logger.info(`Environment check: NODE_ENV=${nodeEnv}, Express env=${expressEnv}, isDevelopment=${isDevelopment}`);
  
  if (isDevelopment) {
    logger.info("Starting in DEVELOPMENT mode with Vite dev server");
    // Dynamic import only in development - this won't be bundled by esbuild
    const { setupVite } = await import("./vite");
    await setupVite(app, server);
  } else {
    logger.info("Starting in PRODUCTION mode with static file serving");
    // Use production module that has no vite dependencies
    const { serveStatic } = await import("./production");
    serveStatic(app);
  }

  // Use PORT environment variable or default to 5000
  // For EasyPanel deployment, this will be 3000
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  
  // Windows doesn't support reusePort, so we need to handle this differently
  const isWindows = process.platform === 'win32';
  
  if (isWindows) {
    server.listen(port, () => {
      logger.info(`Server listening on port ${port}`, { port, platform: 'windows' });
    });
  } else {
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      logger.info(`Server listening on port ${port}`, { port, platform: 'unix', reusePort: true });
    });
  }
})();
