import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

/**
 * Security middleware that's compatible with existing functionality
 * - Allows Cal.com iframes
 * - Allows WordPress API calls
 * - Maintains CORS compatibility
 * - Works with Vite HMR in development
 */
export function setupSecurityMiddleware(app: any) {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  // Helmet with CSP that allows necessary external resources
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'", 
          "'unsafe-inline'", // Needed for inline styles and Vite
          "https://fonts.googleapis.com"
        ],
        scriptSrc: [
          "'self'", 
          "'unsafe-inline'", // Needed for Vite in dev mode
          ...(isDevelopment ? ["'unsafe-eval'"] : []), // Vite HMR needs eval in dev
          "https://cal.com",
          "https://*.cal.com",
          "https://embed.cal.com"
        ],
        imgSrc: ["'self'", "data:", "https:", "http:"],
        connectSrc: [
          "'self'",
          "https://api.openai.com",
          "https://*.openai.com",
          "https://*.wordpress.com",
          "https://cal.com",
          "https://*.cal.com",
          ...(isDevelopment ? ["ws://localhost:*", "wss://localhost:*"] : []) // Vite HMR
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        frameSrc: [
          "'self'",
          "https://cal.com",
          "https://*.cal.com",
          "https://embed.cal.com"
        ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: isDevelopment ? null : [],
      },
    },
    crossOriginEmbedderPolicy: false, // Allow iframe embeds (Cal.com)
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow WordPress API
  }));

  // Data sanitization - prevents NoSQL injection
  app.use(mongoSanitize());

  // Prevent HTTP Parameter Pollution
  app.use(hpp());

  // Trust proxy (important for Nginx reverse proxy)
  app.set('trust proxy', 1);
}

/**
 * Input validation middleware for contact forms
 * Compatible with existing Zod validation
 * Removes potential XSS attempts while preserving legitimate content
 */
export function validateContactInput(req: Request, res: Response, next: NextFunction) {
  // Basic sanitization - doesn't interfere with Zod validation
  if (req.body && typeof req.body === 'object') {
    const sanitizeString = (str: string): string => {
      if (typeof str !== 'string') return str;
      // Remove script tags and event handlers while preserving content
      return str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/javascript:/gi, '')
        .trim();
    };

    // Recursively sanitize all string values in the body
    const sanitizeObject = (obj: any): any => {
      if (typeof obj === 'string') {
        return sanitizeString(obj);
      } else if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      } else if (obj && typeof obj === 'object') {
        const sanitized: any = {};
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            sanitized[key] = sanitizeObject(obj[key]);
          }
        }
        return sanitized;
      }
      return obj;
    };

    req.body = sanitizeObject(req.body);
  }
  next();
}

