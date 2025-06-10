import mysql from "mysql2/promise";

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  charset: string;
  timezone: string;
  connectionLimit: number;
  acquireTimeout: number;
  timeout: number;
  reconnect: boolean;
}
const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "geotag_user",
  password: process.env.DB_PASSWORD ?? "geotag_password",
  database: process.env.DB_NAME ?? "geotag_images",
  charset: "utf8mb4",
  timezone: "+00:00",
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
};

class Database {
  private pool: mysql.Pool | null = null;

  async connect(): Promise<mysql.Pool> {
    try {
      this.pool = mysql.createPool(dbConfig);

      // Test the connection
      const connection = await this.pool.getConnection();
      console.log("✅ Database connected successfully");
      connection.release();

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
      const [results] = await this.pool.execute(sql, params);
      return results;
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
