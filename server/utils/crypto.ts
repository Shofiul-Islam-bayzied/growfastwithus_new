import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateRandomString = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

export const generateSecureToken = (): string => {
  return crypto.randomBytes(32).toString('base64url');
};

export const hashData = (data: string): string => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

export const encryptData = (data: string, key: string): string => {
  const algorithm = 'aes-256-cbc';
  const iv = crypto.randomBytes(16);
  
  // Create a 32-byte key from the provided key string
  const keyBuffer = crypto.createHash('sha256').update(key).digest();
  
  const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
};

export const decryptData = (encryptedData: string, key: string): string => {
  const algorithm = 'aes-256-cbc';
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  
  // Create a 32-byte key from the provided key string
  const keyBuffer = crypto.createHash('sha256').update(key).digest();
  
  const decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}; 