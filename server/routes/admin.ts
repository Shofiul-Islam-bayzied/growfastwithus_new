import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { RBACMiddleware, Permission } from '../middleware/rbac';
import { logAuditEvent } from '../utils/audit';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createRoleSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  permissions: z.array(z.string())
});

const updateRoleSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  isActive: z.boolean().optional()
});

const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  roleId: z.number()
});

// Public routes (no authentication required)
// Session check, login, and logout are handled in routes.ts

// Role Management Routes

// Get all roles
router.get('/roles', RBACMiddleware.requirePermission(Permission.ROLE_READ), async (req: any, res: Response) => {
  try {
    const roles = await storage.getAllRoles();
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

// Get role by ID
router.get('/roles/:id', RBACMiddleware.requirePermission(Permission.ROLE_READ), async (req: any, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const role = await storage.getRoleById(id);
    
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    
    res.json(role);
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({ error: 'Failed to fetch role' });
  }
});

// Create role
router.post('/roles', RBACMiddleware.requirePermission(Permission.ROLE_CREATE), async (req: any, res: Response) => {
  try {
    const roleData = createRoleSchema.parse(req.body);
    
    const existingRole = await storage.getRoleByName(roleData.name);
    if (existingRole) {
      return res.status(400).json({ error: 'Role name already exists' });
    }
    
    const newRole = await storage.createRole({
      name: roleData.name,
      description: roleData.description,
      permissions: roleData.permissions,
      isActive: true
    });
    
    logAuditEvent({
      userId: req.user.id,
      action: 'ROLE_CREATED',
      resourceType: 'role',
      resourceId: newRole.id.toString(),
      newValues: roleData,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      severity: 'info'
    });
    
    res.status(201).json(newRole);
  } catch (error) {
    console.error('Error creating role:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create role' });
    }
  }
});

// Update role
router.put('/roles/:id', RBACMiddleware.requirePermission(Permission.ROLE_UPDATE), async (req: any, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const roleData = updateRoleSchema.parse(req.body);
    
    const existingRole = await storage.getRoleById(id);
    if (!existingRole) {
      return res.status(404).json({ error: 'Role not found' });
    }
    
    // Check if trying to update system role
    if (existingRole.isSystem && roleData.name && roleData.name !== existingRole.name) {
      return res.status(400).json({ error: 'Cannot rename system roles' });
    }
    
    const updatedRole = await storage.updateRole(id, roleData);
    
    logAuditEvent({
      userId: req.user.id,
      action: 'ROLE_UPDATED',
      resourceType: 'role',
      resourceId: id.toString(),
      oldValues: existingRole,
      newValues: roleData,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      severity: 'info'
    });
    
    res.json(updatedRole);
  } catch (error) {
    console.error('Error updating role:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update role' });
    }
  }
});

// Delete role
router.delete('/roles/:id', RBACMiddleware.requirePermission(Permission.ROLE_DELETE), async (req: any, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    const existingRole = await storage.getRoleById(id);
    if (!existingRole) {
      return res.status(404).json({ error: 'Role not found' });
    }
    
    // Prevent deletion of system roles
    if (existingRole.isSystem) {
      return res.status(400).json({ error: 'Cannot delete system roles' });
    }
    
    await storage.deleteRole(id);
    
    logAuditEvent({
      userId: req.user.id,
      action: 'ROLE_DELETED',
      resourceType: 'role',
      resourceId: id.toString(),
      oldValues: existingRole,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      severity: 'warning'
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ error: 'Failed to delete role' });
  }
});

// Permission Management Routes

// Get all permissions
router.get('/permissions', RBACMiddleware.requirePermission(Permission.ROLE_READ), async (req: any, res: Response) => {
  try {
    const permissions = await storage.getAllPermissions();
    res.json(permissions);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ error: 'Failed to fetch permissions' });
  }
});

// Get permissions by resource
router.get('/permissions/resource/:resource', RBACMiddleware.requirePermission(Permission.ROLE_READ), async (req: any, res: Response) => {
  try {
    const { resource } = req.params;
    const permissions = await storage.getPermissionsByResource(resource);
    res.json(permissions);
  } catch (error) {
    console.error('Error fetching permissions by resource:', error);
    res.status(500).json({ error: 'Failed to fetch permissions' });
  }
});

// User Management Routes

// Get all users
router.get('/users', RBACMiddleware.requirePermission(Permission.USER_READ), async (req: any, res: Response) => {
  try {
    // This would need to be implemented in storage
    // For now, return a placeholder
    res.json([]);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create user
router.post('/users', RBACMiddleware.requirePermission(Permission.USER_CREATE), async (req: any, res: Response) => {
  try {
    const userData = createUserSchema.parse(req.body);
    
    const existingUser = await storage.getAdminUser(userData.username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    const existingEmail = await storage.getAdminUserByEmail(userData.email);
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    // Validate password policy
    const passwordValidation = RBACMiddleware.validatePasswordPolicy(userData.password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        error: 'Password does not meet requirements',
        details: passwordValidation.errors 
      });
    }
    
    // Hash password
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const newUser = await storage.createAdminUser({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      roleId: userData.roleId,
      isActive: true
    });
    
    logAuditEvent({
      userId: req.user.id,
      action: 'USER_CREATED',
      resourceType: 'user',
      resourceId: newUser.id.toString(),
      newValues: {
        username: userData.username,
        email: userData.email,
        roleId: userData.roleId
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      severity: 'info'
    });
    
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      roleId: newUser.roleId
    });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
});

// System Configuration Routes

// Get system configuration
router.get('/config', RBACMiddleware.requirePermission(Permission.SYSTEM_CONFIG), async (req: any, res: Response) => {
  try {
    const configs = await storage.getAllSystemConfigs();
    res.json(configs);
  } catch (error) {
    console.error('Error fetching system config:', error);
    res.status(500).json({ error: 'Failed to fetch system configuration' });
  }
});

// Update system configuration
router.put('/config/:key', RBACMiddleware.requirePermission(Permission.SYSTEM_CONFIG), async (req: any, res: Response) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    if (value === undefined) {
      return res.status(400).json({ error: 'Value is required' });
    }
    
    const updatedConfig = await storage.updateSystemConfig(key, value, req.user.id);
    
    logAuditEvent({
      userId: req.user.id,
      action: 'CONFIG_UPDATED',
      resourceType: 'config',
      resourceId: key,
      oldValues: { key },
      newValues: { key, value },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      severity: 'info'
    });
    
    res.json(updatedConfig);
  } catch (error) {
    console.error('Error updating system config:', error);
    res.status(500).json({ error: 'Failed to update system configuration' });
  }
});

// Audit Logs Routes

// Get audit logs
router.get('/audit-logs', RBACMiddleware.requirePermission(Permission.SECURITY_AUDIT), async (req: any, res: Response) => {
  try {
    const filters = {
      userId: req.query.userId ? parseInt(req.query.userId as string) : undefined,
      action: req.query.action as string,
      resourceType: req.query.resourceType as string,
      severity: req.query.severity as string,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0
    };
    
    const logs = await storage.getAuditLogs(filters);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// Get security events
router.get('/security-events', RBACMiddleware.requirePermission(Permission.SECURITY_AUDIT), async (req: any, res: Response) => {
  try {
    const filters = {
      userId: req.query.userId ? parseInt(req.query.userId as string) : undefined,
      eventType: req.query.eventType as string,
      riskScore: req.query.riskScore ? parseInt(req.query.riskScore as string) : undefined,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0
    };
    
    const events = await storage.getSecurityEvents(filters);
    res.json(events);
  } catch (error) {
    console.error('Error fetching security events:', error);
    res.status(500).json({ error: 'Failed to fetch security events' });
  }
});

// Session Management Routes

// Get user sessions
router.get('/sessions', RBACMiddleware.requirePermission(Permission.SECURITY_SESSIONS), async (req: any, res: Response) => {
  try {
    const userId = req.query.userId ? parseInt(req.query.userId as string) : req.user.id;
    const sessions = await storage.getActiveSessions(userId);
    
    res.json(sessions.map(session => ({
      id: session.id,
      userId: session.userId,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      createdAt: session.createdAt,
      lastActivity: session.lastActivity,
      expiresAt: session.expiresAt
    })));
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Revoke session
router.delete('/sessions/:sessionId', RBACMiddleware.requirePermission(Permission.SECURITY_SESSIONS), async (req: any, res: Response) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
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
    console.error('Error revoking session:', error);
    res.status(500).json({ error: 'Failed to revoke session' });
  }
});

export default router; 