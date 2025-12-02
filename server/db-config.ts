import { createHash, randomBytes } from 'crypto';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl?: boolean;
  connectionLimit?: number;
  isActive?: boolean;
}

export interface DatabaseConfigWithMetadata extends DatabaseConfig {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isActive: boolean;
  lastTested?: Date;
  lastTestResult?: {
    success: boolean;
    error?: string;
    responseTime?: number;
  };
}

export interface DatabaseConfigHistory {
  id: string;
  configId: string;
  config: DatabaseConfig;
  changedBy: string;
  changedAt: Date;
  changeType: 'created' | 'updated' | 'activated' | 'deactivated';
  reason?: string;
}

export interface DatabaseTestResult {
  success: boolean;
  error?: string;
  responseTime?: number;
  details?: {
    serverVersion?: string;
    connectionId?: string;
    maxConnections?: number;
  };
}

class DatabaseConfigManager {
  private configPath: string;
  private historyPath: string;
  private encryptionKey: string;

  constructor() {
    this.configPath = join(process.cwd(), '.db-config.json');
    this.historyPath = join(process.cwd(), '.db-config-history.json');
    this.encryptionKey = process.env.DB_CONFIG_ENCRYPTION_KEY || 
                         process.env.SESSION_SECRET || 
                         'fallback-key-for-development';
  }

  private encrypt(text: string): string {
    const hash = createHash('sha256');
    hash.update(this.encryptionKey);
    const key = hash.digest('hex').slice(0, 32);
    
    const iv = randomBytes(16);
    const cipher = require('crypto').createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }

  private decrypt(encryptedText: string): string {
    const hash = createHash('sha256');
    hash.update(this.encryptionKey);
    const key = hash.digest('hex').slice(0, 32);
    
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = require('crypto').createDecipher('aes-256-cbc', key);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  private loadConfigs(): DatabaseConfigWithMetadata[] {
    if (!existsSync(this.configPath)) {
      return [];
    }
    
    try {
      const data = readFileSync(this.configPath, 'utf8');
      const configs = JSON.parse(data);
      
      // Decrypt passwords
      return configs.map((config: any) => ({
        ...config,
        password: this.decrypt(config.password),
        createdAt: new Date(config.createdAt),
        updatedAt: new Date(config.updatedAt),
        lastTested: config.lastTested ? new Date(config.lastTested) : undefined
      }));
    } catch (error) {
      console.error('Error loading database configs:', error);
      return [];
    }
  }

  private saveConfigs(configs: DatabaseConfigWithMetadata[]): void {
    try {
      // Encrypt passwords before saving
      const configsToSave = configs.map(config => ({
        ...config,
        password: this.encrypt(config.password),
        createdAt: config.createdAt.toISOString(),
        updatedAt: config.updatedAt.toISOString(),
        lastTested: config.lastTested?.toISOString()
      }));
      
      writeFileSync(this.configPath, JSON.stringify(configsToSave, null, 2));
    } catch (error) {
      console.error('Error saving database configs:', error);
      throw new Error('Failed to save database configuration');
    }
  }

  private loadHistory(): DatabaseConfigHistory[] {
    if (!existsSync(this.historyPath)) {
      return [];
    }
    
    try {
      const data = readFileSync(this.historyPath, 'utf8');
      const history = JSON.parse(data);
      
      return history.map((entry: any) => ({
        ...entry,
        changedAt: new Date(entry.changedAt)
      }));
    } catch (error) {
      console.error('Error loading database config history:', error);
      return [];
    }
  }

  private saveHistory(history: DatabaseConfigHistory[]): void {
    try {
      const historyToSave = history.map(entry => ({
        ...entry,
        changedAt: entry.changedAt.toISOString()
      }));
      
      writeFileSync(this.historyPath, JSON.stringify(historyToSave, null, 2));
    } catch (error) {
      console.error('Error saving database config history:', error);
    }
  }

  private addHistoryEntry(
    configId: string,
    config: DatabaseConfig,
    changedBy: string,
    changeType: DatabaseConfigHistory['changeType'],
    reason?: string
  ): void {
    const history = this.loadHistory();
    const entry: DatabaseConfigHistory = {
      id: randomBytes(16).toString('hex'),
      configId,
      config,
      changedBy,
      changedAt: new Date(),
      changeType,
      reason
    };
    
    history.push(entry);
    this.saveHistory(history);
  }

  validateConfig(config: DatabaseConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.host || config.host.trim() === '') {
      errors.push('Host is required');
    }

    if (!config.port || config.port < 1 || config.port > 65535) {
      errors.push('Port must be between 1 and 65535');
    }

    if (!config.user || config.user.trim() === '') {
      errors.push('Username is required');
    }

    if (!config.password) {
      errors.push('Password is required');
    }

    if (!config.database || config.database.trim() === '') {
      errors.push('Database name is required');
    }

    // Validate host format
    const hostRegex = /^[a-zA-Z0-9.-]+$/;
    if (config.host && !hostRegex.test(config.host)) {
      errors.push('Host contains invalid characters');
    }

    // Validate database name format
    const dbRegex = /^[a-zA-Z0-9_]+$/;
    if (config.database && !dbRegex.test(config.database)) {
      errors.push('Database name contains invalid characters');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  async testConnection(config: DatabaseConfig): Promise<DatabaseTestResult> {
    const startTime = Date.now();
    
    try {
      // Import mysql2 dynamically to avoid issues if not installed
      const mysql = require('mysql2/promise');
      
      const connection = await mysql.createConnection({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        ssl: config.ssl ? { rejectUnauthorized: false } : false,
        connectTimeout: 10000,
        acquireTimeout: 10000,
        timeout: 10000
      });

      // Test basic query
      const [rows] = await connection.execute('SELECT 1 as test, VERSION() as version, CONNECTION_ID() as connection_id');
      
      await connection.end();
      
      const responseTime = Date.now() - startTime;
      
      return {
        success: true,
        responseTime,
        details: {
          serverVersion: (rows as any)[0]?.version,
          connectionId: (rows as any)[0]?.connection_id?.toString()
        }
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      return {
        success: false,
        error: error.message || 'Unknown connection error',
        responseTime
      };
    }
  }

  getConfigs(): DatabaseConfigWithMetadata[] {
    return this.loadConfigs();
  }

  getActiveConfig(): DatabaseConfigWithMetadata | undefined {
    const configs = this.loadConfigs();
    return configs.find(config => config.isActive);
  }

  getConfig(id: string): DatabaseConfigWithMetadata | undefined {
    const configs = this.loadConfigs();
    return configs.find(config => config.id === id);
  }

  createConfig(
    config: DatabaseConfig,
    createdBy: string,
    reason?: string
  ): DatabaseConfigWithMetadata {
    const validation = this.validateConfig(config);
    if (!validation.valid) {
      throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
    }

    const configs = this.loadConfigs();
    
    // Deactivate all existing configs if this one should be active
    if (configs.length === 0) {
      config.isActive = true;
    }

    const newConfig: DatabaseConfigWithMetadata = {
      ...config,
      id: randomBytes(16).toString('hex'),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy,
      isActive: config.isActive || false
    };

    configs.push(newConfig);
    this.saveConfigs(configs);
    
    this.addHistoryEntry(newConfig.id, config, createdBy, 'created', reason);
    
    return newConfig;
  }

  updateConfig(
    id: string,
    updates: Partial<DatabaseConfig>,
    updatedBy: string,
    reason?: string
  ): DatabaseConfigWithMetadata {
    const configs = this.loadConfigs();
    const configIndex = configs.findIndex(config => config.id === id);
    
    if (configIndex === -1) {
      throw new Error('Configuration not found');
    }

    const oldConfig = configs[configIndex];
    const updatedConfig = { ...oldConfig, ...updates, updatedAt: new Date() };

    // Validate the updated config
    const validation = this.validateConfig(updatedConfig);
    if (!validation.valid) {
      throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
    }

    configs[configIndex] = updatedConfig;
    this.saveConfigs(configs);
    
    this.addHistoryEntry(id, updatedConfig, updatedBy, 'updated', reason);
    
    return updatedConfig;
  }

  deleteConfig(id: string, deletedBy: string, reason?: string): void {
    const configs = this.loadConfigs();
    const config = configs.find(c => c.id === id);
    
    if (!config) {
      throw new Error('Configuration not found');
    }

    if (config.isActive) {
      throw new Error('Cannot delete active configuration');
    }

    const filteredConfigs = configs.filter(c => c.id !== id);
    this.saveConfigs(filteredConfigs);
    
    this.addHistoryEntry(id, config, deletedBy, 'deactivated', reason);
  }

  activateConfig(id: string, activatedBy: string, reason?: string): DatabaseConfigWithMetadata {
    const configs = this.loadConfigs();
    const configIndex = configs.findIndex(config => config.id === id);
    
    if (configIndex === -1) {
      throw new Error('Configuration not found');
    }

    // Deactivate all other configs
    configs.forEach((config, index) => {
      if (index !== configIndex) {
        config.isActive = false;
      }
    });

    // Activate the selected config
    configs[configIndex].isActive = true;
    configs[configIndex].updatedAt = new Date();

    this.saveConfigs(configs);
    
    this.addHistoryEntry(id, configs[configIndex], activatedBy, 'activated', reason);
    
    return configs[configIndex];
  }

  updateTestResult(
    id: string,
    testResult: DatabaseTestResult
  ): DatabaseConfigWithMetadata {
    const configs = this.loadConfigs();
    const configIndex = configs.findIndex(config => config.id === id);
    
    if (configIndex === -1) {
      throw new Error('Configuration not found');
    }

    configs[configIndex].lastTested = new Date();
    configs[configIndex].lastTestResult = testResult;
    configs[configIndex].updatedAt = new Date();

    this.saveConfigs(configs);
    
    return configs[configIndex];
  }

  getHistory(configId?: string): DatabaseConfigHistory[] {
    const history = this.loadHistory();
    
    if (configId) {
      return history.filter(entry => entry.configId === configId);
    }
    
    return history;
  }

  exportConfig(id: string): string {
    const config = this.getConfig(id);
    if (!config) {
      throw new Error('Configuration not found');
    }

    // Export without sensitive data
    const exportData = {
      host: config.host,
      port: config.port,
      user: config.user,
      database: config.database,
      ssl: config.ssl,
      connectionLimit: config.connectionLimit
    };

    return JSON.stringify(exportData, null, 2);
  }

  importConfig(
    configData: string,
    importedBy: string,
    reason?: string
  ): DatabaseConfigWithMetadata {
    try {
      const config = JSON.parse(configData);
      
      // Validate required fields
      if (!config.host || !config.port || !config.user || !config.database) {
        throw new Error('Invalid configuration format');
      }

      return this.createConfig(config, importedBy, reason);
    } catch (error: any) {
      throw new Error(`Failed to import configuration: ${error.message}`);
    }
  }
}

export const dbConfigManager = new DatabaseConfigManager(); 