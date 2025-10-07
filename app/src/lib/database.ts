// Database configuration for Next.js
import { Pool, PoolConfig, QueryResult } from "pg";

interface DatabaseConfig extends PoolConfig {
  connectionString?: string;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
}

// Function to get database config (evaluated at runtime)
function getDbConfig(): DatabaseConfig {
  // Use non-pooling connection for Next.js API Routes to avoid PgBouncer issues
  console.log(
    "🔍 POSTGRES_URL_NON_POOLING exists:",
    !!process.env.POSTGRES_URL_NON_POOLING
  );
  console.log("🔍 POSTGRES_URL exists:", !!process.env.POSTGRES_URL);
  let connectionString =
    process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

  // Clean up the connection string - remove all query parameters and handle SSL separately
  if (connectionString) {
    // Remove everything after the first ? (all query parameters)
    connectionString = connectionString.split("?")[0];
  }

  console.log(
    "🔍 Connection string:",
    connectionString
      ? connectionString.replace(/:[^:@]+@/, ":****@")
      : "undefined"
  );

  return connectionString
    ? {
        connectionString,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 60000,
        ssl: {
          rejectUnauthorized: false, // Required for Supabase in development
        },
      }
    : {
        host: process.env.POSTGRES_HOST ?? process.env.DB_HOST ?? "localhost",
        port: Number(process.env.DB_PORT ?? 5432),
        user: process.env.POSTGRES_USER ?? process.env.DB_USER ?? "postgres",
        password:
          process.env.POSTGRES_PASSWORD ??
          process.env.DB_PASSWORD ??
          "postgres",
        database:
          process.env.POSTGRES_DATABASE ?? process.env.DB_NAME ?? "postgres",
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 60000,
        ssl: {
          rejectUnauthorized: false, // Required for Supabase in development
        },
      };
}

class Database {
  private pool: Pool | null = null;

  async connect(): Promise<Pool> {
    if (this.pool) {
      return this.pool;
    }

    try {
      const dbConfig = getDbConfig();
      this.pool = new Pool(dbConfig);

      // Test the connection
      const client = await this.pool.connect();
      console.log("✅ PostgreSQL Database connected successfully");
      client.release();

      return this.pool;
    } catch (error) {
      console.error("❌ Database connection failed:", (error as Error).message);
      throw error;
    }
  }

  async query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    if (!this.pool) {
      await this.connect();
    }

    try {
      // Convert MySQL-style placeholders (?) to PostgreSQL-style ($1, $2, etc.)
      let paramIndex = 1;
      const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);

      const result: QueryResult = await this.pool!.query(
        pgSql,
        params as any[]
      );

      // For INSERT queries, return an object with insertId (PostgreSQL uses RETURNING)
      if (sql.trim().toUpperCase().startsWith("INSERT")) {
        return result.rows as T[];
      }

      // For SELECT queries, return rows array
      return result.rows as T[];
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      console.log("Database connection closed");
    }
  }
}

export const database = new Database();
