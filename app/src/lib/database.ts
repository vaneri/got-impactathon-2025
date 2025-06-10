import { Pool, PoolConfig } from "pg";

const dbConfig: PoolConfig = {
  connectionString: process.env.POSTGRES_URL
    ? process.env.POSTGRES_URL
    : "postgresql://geotag_user:geotag_password@localhost:5555/geotag_images",
};

// For Supabase or other remote databases, SSL is often required.
// We avoid enforcing it for local connections to prevent issues.
if (
  dbConfig.connectionString &&
  !dbConfig.connectionString.includes("localhost")
) {
  dbConfig.ssl = { rejectUnauthorized: false };
}

dbConfig.connectionTimeoutMillis = 5000;
dbConfig.idleTimeoutMillis = 10000;
dbConfig.max = 10;

class Database {
  private pool: Pool | null = null;

  async connect(): Promise<Pool> {
    try {
      this.pool = new Pool(dbConfig);

      // Test the connection
      const client = await this.pool.connect();
      console.log("✅ Database connected successfully");
      client.release();

      return this.pool;
    } catch (error) {
      console.error("❌ Database connection failed:", (error as Error).message);
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async query(sql: string, params: any[] = []): Promise<any[]> {
    if (!this.pool) {
      throw new Error("Database not connected");
    }

    try {
      const result = await this.pool.query(sql, params);
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
