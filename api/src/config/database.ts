import { Pool, PoolConfig, QueryResult } from "pg";

interface DatabaseConfig extends PoolConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
}

const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASSWORD ?? "postgres",
  database: process.env.DB_NAME ?? "geotag_images",
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 60000, // Return an error after 60 seconds if connection cannot be established
};

class Database {
  private pool: Pool | null = null;

  async connect(): Promise<Pool> {
    try {
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
export { Database, dbConfig };
