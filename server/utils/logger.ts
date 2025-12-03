/**
 * Production-ready logging utility
 * Provides structured logging with levels and proper formatting
 * In production, logs are JSON-formatted for log aggregation systems
 */

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

interface LogContext {
  [key: string]: any;
}

class Logger {
  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    
    if (isProduction) {
      // JSON format for production (log aggregation systems)
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...context
      });
    } else {
      // Human-readable format for development
      const formattedTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      return `${formattedTime} [${level.toUpperCase()}] ${message}${contextStr}`;
    }
  }

  info(message: string, context?: LogContext): void {
    console.log(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext: LogContext = { ...context };
    
    if (error instanceof Error) {
      errorContext.error = {
        message: error.message,
        stack: isDevelopment ? error.stack : undefined, // Only include stack in development
        name: error.name
      };
    } else if (error) {
      errorContext.error = String(error);
    }
    
    console.error(this.formatMessage('error', message, errorContext));
  }

  debug(message: string, context?: LogContext): void {
    if (isDevelopment || process.env.DEBUG === 'true') {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  // Helper for request logging
  request(method: string, path: string, statusCode: number, duration: number, context?: LogContext): void {
    this.info(`${method} ${path} ${statusCode} in ${duration}ms`, {
      method,
      path,
      statusCode,
      duration,
      ...context
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export for backward compatibility with existing log function
export function log(message: string, source = "express") {
  logger.info(message, { source });
}

