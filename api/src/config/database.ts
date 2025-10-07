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

// Function to get database config (evaluated at runtime, not module load time)
function getDbConfig(): DatabaseConfig {
  // Prefer connection string (works better with Supabase pooler)
  // Remove sslmode from connection string and handle SSL separately
  let connectionString = process.env.POSTGRES_URL;
  if (connectionString) {
    connectionString = connectionString.replace(/[?&]sslmode=[^&]+/, "");
    connectionString = connectionString.replace(/\?$/, ""); // Remove trailing ?
  }

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
    try {
      const dbConfig = getDbConfig(); // Get config at runtime

      console.log("🔄 Connecting to database...");
      console.log(
        "  Using:",
        dbConfig.connectionString ? "Connection String" : "Host/Port"
      );
      if (!dbConfig.connectionString) {
        console.log("  Host:", dbConfig.host);
        console.log("  Port:", dbConfig.port);
        console.log("  Database:", dbConfig.database);
      }

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

  async query(sql: string, params: any[] = []): Promise<any> {
    if (!this.pool) {
      throw new Error("Database not connected");
    }

    try {
      // Convert MySQL-style placeholders (?) to PostgreSQL-style ($1, $2, etc.)
      let paramIndex = 1;
      const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);

      const result: QueryResult = await this.pool.query(pgSql, params);

      // For INSERT queries, return an object with insertId (PostgreSQL uses RETURNING)
      if (sql.trim().toUpperCase().startsWith("INSERT")) {
        return {
          insertId: result.rows[0]?.id || null,
          rowCount: result.rowCount,
          rows: result.rows,
        };
      }

      // For SELECT queries, return rows array
      return result.rows;
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
export { Database };
