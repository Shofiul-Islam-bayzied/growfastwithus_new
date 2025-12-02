import { dbConfigManager } from './db-config';
import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getMariaDbPool() {
  if (pool) return pool;
  const activeConfig = dbConfigManager.getActiveConfig();
  if (!activeConfig) {
    throw new Error('No active MariaDB configuration found. Please set up and activate a DB config.');
  }
  pool = mysql.createPool({
    host: activeConfig.host,
    port: activeConfig.port,
    user: activeConfig.user,
    password: activeConfig.password,
    database: activeConfig.database,
    ssl: activeConfig.ssl ? { rejectUnauthorized: false } : undefined,
    connectionLimit: activeConfig.connectionLimit || 10,
    connectTimeout: 10000,
    waitForConnections: true,
    queueLimit: 0
  });
  console.log('[MariaDB] Connection pool created for', activeConfig.host, activeConfig.database);
  return pool;
}

export async function testMariaDbConnection() {
  try {
    const pool = getMariaDbPool();
    const [rows] = await pool.query('SELECT 1 as test');
    return rows;
  } catch (err) {
    console.error('[MariaDB] Connection test failed:', err);
    throw err;
  }
} 