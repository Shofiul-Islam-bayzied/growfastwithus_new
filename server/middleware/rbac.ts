import { Request, Response, NextFunction, RequestHandler } from 'express';
import { storage } from '../storage';
import { logAuditEvent, logSecurityEvent } from '../utils/audit';
import { generateSessionToken, validateSessionToken } from '../utils/session';
import { verifyPassword, hashPassword } from '../utils/crypto';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    roleId: number;
    role: {
      name: string;
      permissions: string[];
    };
    permissions: string[];
  };
}

// RBAC Permission Types
export enum Permission {
  // User Management
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  USER_MANAGE = 'user:manage',

  // Role Management
  ROLE_CREATE = 'role:create',
  ROLE_READ = 'role:read',
  ROLE_UPDATE = 'role:update',
  ROLE_DELETE = 'role:delete',
  ROLE_MANAGE = 'role:manage',

  // Content Management
  CONTENT_CREATE = 'content:create',
  CONTENT_READ = 'content:read',
  CONTENT_UPDATE = 'content:update',
  CONTENT_DELETE = 'content:delete',
  CONTENT_PUBLISH = 'content:publish',

  // System Administration
  SYSTEM_CONFIG = 'system:config',
  SYSTEM_BACKUP = 'system:backup',
  SYSTEM_RESTORE = 'system:restore',
  SYSTEM_LOGS = 'system:logs',

  // Security
  SECURITY_AUDIT = 'security:audit',
  SECURITY_SESSIONS = 'security:sessions',

  // Analytics
  ANALYTICS_VIEW = 'analytics:view',
  ANALYTICS_EXPORT = 'analytics:export',

  // Super Admin
  SUPER_ADMIN = 'super:admin'
}

// Default Roles and Permissions
export const DEFAULT_ROLES = {
  SUPER_ADMIN: {
    name: 'Super Administrator',
    description: 'Full system access with all permissions',
    permissions: Object.values(Permission)
  },
  ADMIN: {
    name: 'Administrator',
    description: 'System administration with most permissions',
    permissions: [
      Permission.USER_CREATE, Permission.USER_READ, Permission.USER_UPDATE,
      Permission.CONTENT_CREATE, Permission.CONTENT_READ, Permission.CONTENT_UPDATE, Permission.CONTENT_DELETE, Permission.CONTENT_PUBLISH,
      Permission.SYSTEM_CONFIG, Permission.SYSTEM_LOGS,
      Permission.ANALYTICS_VIEW, Permission.ANALYTICS_EXPORT,
      Permission.SECURITY_AUDIT
    ]
  },
  MANAGER: {
    name: 'Manager',
    description: 'Content and user management',
    permissions: [
      Permission.USER_READ, Permission.USER_UPDATE,
      Permission.CONTENT_CREATE, Permission.CONTENT_READ, Permission.CONTENT_UPDATE, Permission.CONTENT_PUBLISH,
      Permission.ANALYTICS_VIEW
    ]
  },
  EDITOR: {
    name: 'Editor',
    description: 'Content creation and editing',
    permissions: [
      Permission.CONTENT_CREATE, Permission.CONTENT_READ, Permission.CONTENT_UPDATE,
      Permission.ANALYTICS_VIEW
    ]
  },
  VIEWER: {
    name: 'Viewer',
    description: 'Read-only access to content and analytics',
    permissions: [
      Permission.CONTENT_READ,
      Permission.ANALYTICS_VIEW
    ]
  }
};

// Authentication Middleware
export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const sessionToken = req.cookies?.sessionToken || req.headers.authorization?.replace('Bearer ', '');
    
    if (!sessionToken) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const session = await validateSessionToken(sessionToken);
    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    const user = await storage.getAdminUserById(session.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    const role = await storage.getRoleById(user.roleId);
    if (!role || !role.isActive) {
      return res.status(403).json({ error: 'Invalid role assignment' });
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      roleId: user.roleId,
      role: {
        name: role.name,
        permissions: role.permissions as string[]
      },
      permissions: role.permissions as string[]
    };

    // Update session activity
    await storage.updateSessionActivity(session.userId);
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Permission-based Authorization Middleware
export const requirePermission = (permission: Permission) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!req.user.permissions.includes(permission) && !req.user.permissions.includes(Permission.SUPER_ADMIN)) {
      logAuditEvent({
        userId: req.user.id,
        action: 'PERMISSION_DENIED',
        resourceType: 'permission',
        resourceId: permission,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        severity: 'warning'
      });

      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Role-based Authorization Middleware
export const requireRole = (roleName: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.role.name !== roleName && !req.user.permissions.includes(Permission.SUPER_ADMIN)) {
      logAuditEvent({
        userId: req.user.id,
        action: 'ROLE_DENIED',
        resourceType: 'role',
        resourceId: roleName,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        severity: 'warning'
      });

      return res.status(403).json({ error: 'Insufficient role privileges' });
    }

    next();
  };
};



// Rate Limiting Middleware
export const rateLimit = (maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const userAttempts = attempts.get(key);

    if (!userAttempts || now > userAttempts.resetTime) {
      attempts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (userAttempts.count >= maxAttempts) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    userAttempts.count++;
    next();
  };
};

// Session Management Middleware
export const sessionManagement = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next();
    }

    // Check for concurrent sessions limit
    const activeSessions = await storage.getActiveSessions(req.user.id);
    const maxSessions = await storage.getSystemConfig('max_concurrent_sessions') || 3;

    if (activeSessions.length >= maxSessions) {
      // Revoke oldest session
      const oldestSession = activeSessions.sort((a, b) => {
        const aTime = a.lastActivity ? new Date(a.lastActivity).getTime() : 0;
        const bTime = b.lastActivity ? new Date(b.lastActivity).getTime() : 0;
        return aTime - bTime;
      })[0];
      
      await storage.revokeSession(oldestSession.id);
    }

    next();
  } catch (error) {
    console.error('Session management error:', error);
    next();
  }
};

// Audit Logging Middleware
export const auditLog = (action: string, resourceType?: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      const responseData = typeof data === 'string' ? data : JSON.stringify(data);
      
      logAuditEvent({
        userId: req.user?.id,
        sessionId: req.session?.sessionToken,
        action,
        resourceType,
        resourceId: req.params.id,
        oldValues: req.body.oldValues,
        newValues: req.body.newValues,
        metadata: {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          responseSize: responseData.length
        },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        severity: res.statusCode >= 400 ? 'warning' : 'info',
        status: res.statusCode < 400 ? 'success' : 'failure'
      });

      return originalSend.call(this, data);
    };

    next();
  };
};

// Security Headers Middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
  
  next();
};

// IP Whitelist Middleware
export const ipWhitelist = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (clientIP && !allowedIPs.includes(clientIP) && !allowedIPs.includes('*')) {
      logSecurityEvent({
        eventType: 'IP_BLOCKED',
        description: `Access denied from IP: ${clientIP}`,
        ipAddress: clientIP,
        userAgent: req.get('User-Agent'),
        riskScore: 100,
        isBlocked: true
      });

      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
};

// Password Policy Middleware
export const validatePasswordPolicy = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Export middleware functions
export const RBACMiddleware = {
  authenticate,
  requirePermission,
  requireRole,
  rateLimit,
  sessionManagement,
  auditLog,
  securityHeaders,
  ipWhitelist,
  validatePasswordPolicy
}; 