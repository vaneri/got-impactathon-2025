import { Pool, PoolConfig } from "pg";

const dbConfig: PoolConfig = {
  connectionString: process.env.POSTGRES_URL
    ? process.env.POSTGRES_URL
    : "postgresql://geotag_user:geotag_password@localhost:5555/geotag_images",
};

// For remote databases (Supabase, etc.), SSL is required but may use self-signed certificates
// We need to allow unauthorized certificates to avoid connection errors
if (
  dbConfig.connectionString &&
  !dbConfig.connectionString.includes("localhost") &&
  !dbConfig.connectionString.includes("127.0.0.1")
) {
  dbConfig.ssl = { 
    rejectUnauthorized: false,
    // Allow self-signed certificates
    ca: false
  };
} else if (dbConfig.connectionString && dbConfig.connectionString.includes("sslmode=require")) {
  // If sslmode=require is in the connection string, ensure SSL is configured
  dbConfig.ssl = { 
    rejectUnauthorized: false 
  };
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
      console.error("Database config (connection string hidden):", {
        ssl: dbConfig.ssl,
        connectionTimeoutMillis: dbConfig.connectionTimeoutMillis,
        max: dbConfig.max
      });
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
