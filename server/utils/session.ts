import jwt from 'jsonwebtoken';
import { storage } from '../storage';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('❌ FATAL ERROR: JWT_SECRET environment variable is required in production!');
  console.error('   Please set JWT_SECRET to a secure random string (at least 32 characters)');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET not set. Using default (insecure for production)');
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
const SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export interface SessionData {
  userId: number;
  sessionId: string;
  expiresAt: Date;
}

export const generateSessionToken = (userId: number): string => {
  const payload = {
    userId,
    sessionId: Math.random().toString(36).substring(2),
    exp: Math.floor(Date.now() / 1000) + (SESSION_EXPIRY / 1000)
  };
  
  return jwt.sign(payload, JWT_SECRET);
};

export const validateSessionToken = async (token: string): Promise<SessionData | null> => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Check if session exists in database
    const session = await storage.getSessionByToken(token);
    if (!session || !session.isActive || new Date() > new Date(session.expiresAt)) {
      return null;
    }
    
    return {
      userId: decoded.userId,
      sessionId: decoded.sessionId,
      expiresAt: new Date(session.expiresAt)
    };
  } catch (error) {
    return null;
  }
};

export const createUserSession = async (userId: number, ipAddress?: string, userAgent?: string): Promise<string> => {
  const sessionToken = generateSessionToken(userId);
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY);
  
  await storage.createUserSession({
    userId,
    sessionToken,
    ipAddress,
    userAgent,
    expiresAt,
    isActive: true
  });
  
  return sessionToken;
};

export const revokeSession = async (sessionToken: string): Promise<void> => {
  await storage.revokeSessionByToken(sessionToken);
};

export const revokeAllUserSessions = async (userId: number): Promise<void> => {
  await storage.revokeAllUserSessions(userId);
};

export const refreshSession = async (sessionToken: string): Promise<string | null> => {
  const session = await storage.getSessionByToken(sessionToken);
  if (!session || !session.isActive) {
    return null;
  }
  
  const newSessionToken = generateSessionToken(session.userId);
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY);
  
  await storage.updateSessionToken(session.id, newSessionToken, expiresAt);
  
  return newSessionToken;
};

export const getActiveSessions = async (userId: number): Promise<any[]> => {
  return await storage.getActiveSessions(userId);
};

export const cleanupExpiredSessions = async (): Promise<void> => {
  await storage.cleanupExpiredSessions();
}; 