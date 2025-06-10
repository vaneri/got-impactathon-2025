import { Pool, PoolConfig } from "pg";

const dbConfig: PoolConfig = {
  connectionString: process.env.POSTGRES_URL
    ? process.env.POSTGRES_URL
    : "postgresql://geotag_user:geotag_password@localhost:5555/geotag_images",
};

// Configure SSL for Supabase and other cloud providers
/* if (dbConfig.connectionString) {
  const isLocal = dbConfig.connectionString.includes("localhost") || 
                  dbConfig.connectionString.includes("127.0.0.1");
  
  const requiresSSL = dbConfig.connectionString.includes("sslmode=require") ||
                      dbConfig.connectionString.includes("supabase.com") ||
                      dbConfig.connectionString.includes("pooler.supabase.com");

  if (!isLocal && requiresSSL) {
    dbConfig.ssl = {
      rejectUnauthorized: false,
      // Supabase uses self-signed certificates, so we need to allow them
    };
    console.log("🔒 SSL configured for remote database connection");
  }
} */

dbConfig.connectionTimeoutMillis = 10000; // Increased for remote connections
dbConfig.idleTimeoutMillis = 30000;
dbConfig.max = 10;

class Database {
  private pool: Pool | null = null;

  async connect(): Promise<Pool> {
    try {
      this.pool = new Pool(dbConfig);

      // Test the connection with retry logic for remote databases
      const client = await this.pool.connect();
      console.log("✅ Database connected successfully");
      console.log(
        `🌐 Connected to: ${
          dbConfig.connectionString?.includes("supabase.com")
            ? "Supabase"
            : "PostgreSQL"
        }`
      );
      client.release();

      return this.pool;
    } catch (error) {
      console.error("❌ Database connection failed:", (error as Error).message);
      console.error("📋 Connection details:", {
        ssl: dbConfig.ssl,
        connectionTimeoutMillis: dbConfig.connectionTimeoutMillis,
        max: dbConfig.max,
        isSupabase:
          dbConfig.connectionString?.includes("supabase.com") || false,
      });

      // Provide specific help for common SSL issues
      if ((error as Error).message.includes("certificate")) {
        console.error(
          "💡 SSL Certificate Issue - this is common with cloud databases"
        );
        console.error(
          "   Try setting NODE_TLS_REJECT_UNAUTHORIZED=0 in your environment"
        );
      }

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
