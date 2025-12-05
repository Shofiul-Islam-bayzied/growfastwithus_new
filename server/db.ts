import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

let pool: Pool | null = null;
let db: any = null;

if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL not set. Using development mode without database.");
  console.warn("💡 To set up a database:");
  console.warn("   1. Ensure PostgreSQL is running on localhost");
  console.warn("   2. Add DATABASE_URL to your .env file");
  console.warn("   3. Restart the server");
} else {
  // Create connection pool for PostgreSQL
  pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    // Connection pool settings
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 5000, // How long to wait when connecting a new client
  });
  
  db = drizzle(pool, { schema });
  
  // Log successful connection
  pool.on('connect', () => {
    console.log('✅ PostgreSQL connection established');
  });
  
  pool.on('error', (err) => {
    console.error('❌ Unexpected PostgreSQL pool error:', err);
  });
  
  console.log('🔗 PostgreSQL connection pool created');
}

export { pool, db };