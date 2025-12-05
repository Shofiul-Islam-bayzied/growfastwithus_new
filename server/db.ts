import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

let pool: Pool | null = null;
let db: any = null;

// Build database configuration from environment variables
function getDatabaseConfig() {
  // Option 1: Use DATABASE_URL if available (preferred method)
  if (process.env.DATABASE_URL) {
    console.log('🔗 Using DATABASE_URL for PostgreSQL connection');
    return { connectionString: process.env.DATABASE_URL };
  }
  
  // Option 2: Build from individual PostgreSQL variables (EasyPanel/Railway fallback)
  if (process.env.PGHOST && process.env.PGDATABASE) {
    console.log('🔗 Using individual PostgreSQL environment variables');
    return {
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT || '5432'),
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      ssl: process.env.PGSSLMODE !== 'disable' ? { rejectUnauthorized: false } : false
    };
  }
  
  return null;
}

const dbConfig = getDatabaseConfig();

if (!dbConfig) {
  console.warn("⚠️  No database configuration found. Running without database.");
  console.warn("💡 To set up PostgreSQL:");
  console.warn("   Option 1: Set DATABASE_URL environment variable");
  console.warn("   Option 2: Set PGHOST, PGDATABASE, PGUSER, PGPASSWORD");
  console.warn("   Example: DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require");
} else {
  try {
    // Create connection pool for PostgreSQL
    pool = new Pool({
      ...dbConfig,
      // Connection pool settings - OPTIMIZED FOR PERFORMANCE
      max: 20, // Maximum number of clients in the pool
      min: 2, // Keep minimum 2 connections alive for faster response
      idleTimeoutMillis: 60000, // Keep connections alive longer (60s)
      connectionTimeoutMillis: 10000, // Allow more time to connect (10s)
      allowExitOnIdle: false, // Prevent pool from closing on idle
      statement_timeout: 5000, // Prevent queries from hanging forever
    });
    
    db = drizzle(pool, { schema });
    
    // Test the connection
    pool.connect()
      .then(client => {
        console.log('✅ PostgreSQL connection successful!');
        console.log('📊 Database:', dbConfig.connectionString ? 'connected via URL' : `${(dbConfig as any).database}@${(dbConfig as any).host}`);
        client.release();
      })
      .catch(err => {
        console.error('❌ PostgreSQL connection failed:', err.message);
        console.error('💡 Check your database credentials and network connectivity');
      });
    
    // Handle connection errors
    pool.on('error', (err) => {
      console.error('❌ Unexpected PostgreSQL pool error:', err);
    });
    
    console.log('🔗 PostgreSQL connection pool created');
  } catch (error) {
    console.error('❌ Failed to create PostgreSQL pool:', error);
  }
}

export { pool, db };