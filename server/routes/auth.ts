import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { RBACMiddleware, Permission, DEFAULT_ROLES } from '../middleware/rbac';
import { logAuditEvent, logSecurityEvent } from '../utils/audit';
import { createUserSession, revokeSession, revokeAllUserSessions } from '../utils/session';
import { hashPassword, verifyPassword, generateSecureToken } from '../utils/crypto';
import { authRateLimiter } from '../middleware/rate-limit';

import { z } from 'zod';

const router = Router();

// Validation schemas
const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  roleId: z.number().optional()
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

// Initialize default roles and permissions
const initializeRBAC = async () => {
  try {
    // Check if database is available
    if (!process.env.DATABASE_URL) {
      console.warn('⚠️  Skipping RBAC initialization - no database available');
      return;
    }

    // Create default roles
    for (const [roleKey, roleData] of Object.entries(DEFAULT_ROLES)) {
      const existingRole = await storage.getRoleByName(roleData.name);
      if (!existingRole) {
        await storage.createRole({
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permissions,
          isSystem: true,
          isActive: true
        });
      }
    }

    // Create default permissions
    const defaultPermissions = Object.values(Permission).map(permission => ({
      name: permission,
      description: `Permission to ${permission.split(':')[1]} ${permission.split(':')[0]}`,
      resource: permission.split(':')[0],
      action: permission.split(':')[1],
      isActive: true
    }));

    for (const permission of defaultPermissions) {
      const existingPermission = await storage.getPermissionByName(permission.name);
      if (!existingPermission) {
        await storage.createPermission(permission);
      }
    }

    console.log('RBAC system initialized successfully');
  } catch (error) {
    console.error('Failed to initialize RBAC:', error);
    console.warn('⚠️  Continuing without RBAC - some features may not work properly');
  }
};

// Initialize RBAC on startup
initializeRBAC();

// Authentication Routes

// Login
router.post('/login', authRateLimiter, async (req: Request, res: Response) => {
  try {
    const { username, password } = loginSchema.parse(req.body);
    
    const user = await storage.getAdminUser(username);
    if (!user || !user.isActive) {
      logSecurityEvent({
        eventType: 'LOGIN_FAILED',
        description: `Failed login attempt for username: ${username}`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        riskScore: 30
      });
      
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.isLocked) {
      logSecurityEvent({
        userId: user.id,
        eventType: 'LOGIN_BLOCKED',
        description: 'Login attempt on locked account',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        riskScore: 80
      });
      
      return res.status(423).json({ error: 'Account is locked' });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      // Increment failed login attempts
      const newFailedAttempts = (user.failedLoginAttempts || 0) + 1;
      await storage.updateAdminUserFailedAttempts(user.id, newFailedAttempts);
      
      // Lock account after 5 failed attempts
      if (newFailedAttempts >= 5) {
        await storage.updateAdminUserLocked(user.id, true);
      }
      
      logSecurityEvent({
        userId: user.id,
        eventType: 'LOGIN_FAILED',
        description: 'Invalid password provided',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        riskScore: 50
      });
      
      return res.status(401).json({ error: 'Invalid credentials' });
    }



    // Reset failed login attempts
    await storage.updateAdminUserFailedAttempts(user.id, 0);
    await storage.updateAdminUserLocked(user.id, false);
    await storage.updateAdminUserLastLogin(user.id);

    // Create session
    const sessionToken = await createUserSession(user.id, req.ip, req.get('User-Agent'));
    
    // Set session cookie
    res.cookie('sessionToken', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict'
    });

    logAuditEvent({
      userId: user.id,
      action: 'LOGIN_SUCCESS',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      severity: 'info'
    });

    res.json({ 
      success: true, 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout
router.post('/logout', RBACMiddleware.authenticate, async (req: any, res: Response) => {
  try {
    const sessionToken = req.cookies?.sessionToken || req.headers.authorization?.replace('Bearer ', '');
    
    if (sessionToken) {
      await revokeSession(sessionToken);
    }
    
    res.clearCookie('sessionToken');
    
    logAuditEvent({
      userId: req.user?.id,
      action: 'LOGOUT',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      severity: 'info'
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Register (admin only)
router.post('/register', RBACMiddleware.authenticate, RBACMiddleware.requirePermission(Permission.USER_CREATE), async (req: any, res: Response) => {
  try {
    const { username, email, password, firstName, lastName, roleId } = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await storage.getAdminUser(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    const existingEmail = await storage.getAdminUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    // Validate password policy
    const passwordValidation = RBACMiddleware.validatePasswordPolicy(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        error: 'Password does not meet requirements',
        details: passwordValidation.errors 
      });
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user with default role if not specified
    const defaultRole = await storage.getRoleByName('Editor');
    const userRoleId = roleId || defaultRole?.id || 1;
    
    const newUser = await storage.createAdminUser({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      roleId: userRoleId,
      isActive: true
    });
    
    logAuditEvent({
      userId: req.user.id,
      action: 'USER_CREATED',
      resourceType: 'user',
      resourceId: newUser.id.toString(),
      newValues: { username, email, roleId: userRoleId },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      severity: 'info'
    });
    
    res.status(201).json({ 
      success: true, 
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
    } else {
      res.status(500).json({ error: 'Registration failed' });
    }
  }
});

// Change Password
router.post('/change-password', RBACMiddleware.authenticate, async (req: any, res: Response) => {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    
    const user = await storage.getAdminUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify current password
    const isValidPassword = await verifyPassword(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Validate new password
    const passwordValidation = RBACMiddleware.validatePasswordPolicy(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        error: 'Password does not meet requirements',
        details: passwordValidation.errors 
      });
    }
    
    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update password
    await storage.updateAdminUserPassword(user.id, hashedPassword);
    
    // Send email confirmation
    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { 
          user: process.env.SMTP_USER || '90e6e5001@smtp-brevo.com', 
          pass: process.env.SMTP_PASS || 'OBZJD06dUHnKbWhP' 
        }
      });

      await transporter.sendMail({
        from: 'GrowFastWithUs <no-reply@growfastwithus.com>',
        to: user.email,
        subject: 'Password Successfully Changed',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Changed Successfully</h2>
            <p>Hello ${user.firstName || user.username},</p>
            <p>Your admin password has been successfully changed at <strong>${new Date().toLocaleString()}</strong>.</p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Security Notice:</strong></p>
              <ul style="margin: 10px 0;">
                <li>If you did not request this change, please contact support immediately</li>
                <li>All active sessions have been logged out for security</li>
                <li>You will need to log in again with your new password</li>
              </ul>
            </div>
            <p>If you have any concerns about this change, please contact our support team.</p>
            <p>Best regards,<br>The GrowFastWithUs Team</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Failed to send password change confirmation email:', emailError);
      // Continue with password change even if email fails
    }
    
    // Revoke all sessions to force re-login
    await revokeAllUserSessions(user.id);
    
    logAuditEvent({
      userId: user.id,
      action: 'PASSWORD_CHANGED',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      severity: 'info'
    });
    
    res.json({ success: true, message: 'Password changed successfully. Confirmation email sent.' });
  } catch (error) {
    console.error('Change password error:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
    } else {
      res.status(500).json({ error: 'Password change failed' });
    }
  }
});



// Get current user info
router.get('/me', RBACMiddleware.authenticate, async (req: any, res: Response) => {
  try {
    const user = await storage.getAdminUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const role = await storage.getRoleById(user.roleId);
    
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: role ? {
          id: role.id,
          name: role.name,
          permissions: role.permissions
        } : null,
        lastLogin: user.lastLogin,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

// Get user sessions
router.get('/sessions', RBACMiddleware.authenticate, async (req: any, res: Response) => {
  try {
    const sessions = await storage.getActiveSessions(req.user.id);
    
    res.json({
      sessions: sessions.map(session => ({
        id: session.id,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        createdAt: session.createdAt,
        lastActivity: session.lastActivity,
        expiresAt: session.expiresAt
      }))
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Failed to get sessions' });
  }
});

// Revoke session
router.delete('/sessions/:sessionId', RBACMiddleware.authenticate, async (req: any, res: Response) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
    const sessions = await storage.getActiveSessions(req.user.id);
    
    const session = sessions.find(s => s.id === sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    await storage.revokeSession(sessionId);
    
    logAuditEvent({
      userId: req.user.id,
      action: 'SESSION_REVOKED',
      resourceType: 'session',
      resourceId: sessionId.toString(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      severity: 'info'
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Revoke session error:', error);
    res.status(500).json({ error: 'Failed to revoke session' });
  }
});

export default router; 