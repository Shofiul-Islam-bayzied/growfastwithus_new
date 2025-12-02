import { storage } from '../storage';

export interface AuditLogData {
  userId?: number;
  sessionId?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  oldValues?: any;
  newValues?: any;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  severity?: 'info' | 'warning' | 'error' | 'critical';
  status?: 'success' | 'failure' | 'pending';
}

export interface SecurityEventData {
  userId?: number;
  eventType: string;
  description?: string;
  ipAddress?: string;
  userAgent?: string;
  location?: any;
  riskScore?: number;
  isBlocked?: boolean;
}

export const logAuditEvent = async (data: AuditLogData): Promise<void> => {
  try {
    await storage.createAuditLog({
      userId: data.userId,
      sessionId: data.sessionId,
      action: data.action,
      resourceType: data.resourceType,
      resourceId: data.resourceId,
      oldValues: data.oldValues,
      newValues: data.newValues,
      metadata: data.metadata,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      severity: data.severity || 'info',
      status: data.status || 'success'
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
};

export const logSecurityEvent = async (data: SecurityEventData): Promise<void> => {
  try {
    await storage.createSecurityEvent({
      userId: data.userId,
      eventType: data.eventType,
      description: data.description,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      location: data.location,
      riskScore: data.riskScore || 0,
      isBlocked: data.isBlocked || false
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

export const getAuditLogs = async (filters?: {
  userId?: number;
  action?: string;
  resourceType?: string;
  severity?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}): Promise<any[]> => {
  try {
    return await storage.getAuditLogs(filters);
  } catch (error) {
    console.error('Failed to get audit logs:', error);
    return [];
  }
};

export const getSecurityEvents = async (filters?: {
  userId?: number;
  eventType?: string;
  riskScore?: number;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}): Promise<any[]> => {
  try {
    return await storage.getSecurityEvents(filters);
  } catch (error) {
    console.error('Failed to get security events:', error);
    return [];
  }
};

export const exportAuditLogs = async (format: 'csv' | 'json' = 'json'): Promise<string> => {
  try {
    const logs = await getAuditLogs({ limit: 10000 });
    
    if (format === 'csv') {
      const headers = ['ID', 'User ID', 'Action', 'Resource Type', 'Resource ID', 'IP Address', 'Severity', 'Status', 'Created At'];
      const csvRows = [headers.join(',')];
      
      logs.forEach(log => {
        csvRows.push([
          log.id,
          log.userId || '',
          log.action,
          log.resourceType || '',
          log.resourceId || '',
          log.ipAddress || '',
          log.severity,
          log.status,
          log.createdAt
        ].join(','));
      });
      
      return csvRows.join('\n');
    } else {
      return JSON.stringify(logs, null, 2);
    }
  } catch (error) {
    console.error('Failed to export audit logs:', error);
    throw error;
  }
}; 