import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

let pool: Pool | null = null;
let db: any = null;

if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL not set. Using development mode without database.");
  console.warn("💡 To set up a database:");
  console.warn("   1. Visit https://neon.tech for a free PostgreSQL database");
  console.warn("   2. Copy the connection string to your .env file");
  console.warn("   3. Restart the server");
} else {
  // Only configure WebSocket and create pool if DATABASE_URL is available
  neonConfig.webSocketConstructor = ws;
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { pool, db };