import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import session from 'express-session';
import { setupSecurityMiddleware } from "./middleware/security";

const app = express();

// Setup security middleware FIRST (before CORS to maintain compatibility)
setupSecurityMiddleware(app);

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:3000',
  'https://growfastwithus.com',
  'https://www.growfastwithus.com',
  'https://my-personal-sites-grfwu-main.luup7t.easypanel.host',
  /\.easypanel\.host$/,
  /\.easypanel\.io$/
];

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
const sessionConfig: session.SessionOptions = {
  secret: process.env.SESSION_SECRET || 'supersecret',
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
// Falls back to memory store if not available (acceptable for single-instance deployment)
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
      log('✅ Using PostgreSQL session store');
    } else {
      log('ℹ️  Using memory session store (Neon serverless or pool not available)');
    }
  } catch (error) {
    log('⚠️  Could not setup PostgreSQL session store, using memory store: ' + (error instanceof Error ? error.message : String(error)));
  }
} else if (isProduction) {
  log('ℹ️  Using memory session store (Neon serverless database detected)');
}

app.use(session(sessionConfig));

// Simple logging function
function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

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
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  const nodeEnv = process.env.NODE_ENV || 'development';
  const expressEnv = app.get("env") || 'development';
  const isDevelopment = nodeEnv === "development" || expressEnv === "development";
  
  log(`Environment check: NODE_ENV=${nodeEnv}, Express env=${expressEnv}, isDevelopment=${isDevelopment}`);
  
  if (isDevelopment) {
    log("Starting in DEVELOPMENT mode with Vite dev server");
    // Dynamic import only in development - this won't be bundled by esbuild
    const { setupVite } = await import("./vite");
    await setupVite(app, server);
  } else {
    log("Starting in PRODUCTION mode with static file serving");
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
      log(`serving on port ${port}`);
    });
  } else {
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
    });
  }
})();
