import dotenv from "dotenv";
import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";

// Load .env from project root
const envPath = "/home/vaneri/got-impactathon-2025/.env";
dotenv.config({ path: envPath });

console.log("📂 Loading .env from:", envPath);
console.log(
  "🔍 POSTGRES_HOST:",
  process.env.POSTGRES_HOST ? "✓ Found" : "✗ Not found"
);

async function initializeDatabase() {
  console.log("🔄 Initializing Supabase PostgreSQL Database...");

  // Use pooler URL and limit connections to 1 for initialization
  // Remove sslmode from connection string and handle SSL separately
  let connectionString = process.env.POSTGRES_URL;
  if (connectionString) {
    connectionString = connectionString.replace(/[?&]sslmode=[^&]+/, "");
    // Remove trailing ? if it exists
    connectionString = connectionString.replace(/\?$/, "");
  }

  const pool = connectionString
    ? new Pool({
        connectionString,
        max: 1, // Limit to 1 connection for initialization
        ssl: {
          rejectUnauthorized: false, // Required for Supabase with self-signed certs
        },
      })
    : new Pool({
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.DB_PORT ?? 5432),
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
        max: 1,
        ssl: {
          rejectUnauthorized: false, // Required for Supabase
        },
      });

  const method = process.env.POSTGRES_URL_NON_POOLING
    ? "Connection String (Non-Pooling)"
    : process.env.POSTGRES_URL
    ? "Connection String (Pooler)"
    : "Direct Connection";
  console.log("Connection method:", method);
  console.log("");

  try {
    // Test connection
    const client = await pool.connect();
    console.log("✅ Connected to database successfully!");
    client.release();

    // Check if tables already exist
    console.log("\n📊 Checking existing tables...");
    const existingTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    if (existingTables.rows.length > 0) {
      console.log("Existing tables found:");
      existingTables.rows.forEach((row: any) => {
        console.log(`  - ${row.table_name}`);
      });

      console.log("\n✅ Database already initialized!");
      console.log("\n📋 Checking categories...");
      const categoriesResult = await pool.query(
        "SELECT COUNT(*) as count FROM categories;"
      );
      console.log(`Categories count: ${categoriesResult.rows[0].count}`);

      await pool.end();
      return;
    }

    console.log("No tables found. Initializing database...\n");

    // Read the SQL schema file
    const schemaPath = path.join(
      __dirname,
      "../../../database/init/01_init_schema.sql"
    );
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");

    console.log("📄 Executing schema SQL...");

    // Split SQL into individual statements and execute them
    // PgBouncer (Supabase pooler) doesn't support multiple statements in one query
    // Remove comments first
    const cleanSql = schemaSql
      .split("\n")
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n");

    const statements = cleanSql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      try {
        const upperStatement = statement.toUpperCase();
        if (upperStatement.includes("CREATE TABLE CATEGORIES")) {
          console.log(`  Creating categories table...`);
        } else if (upperStatement.includes("CREATE TABLE IMAGES")) {
          console.log(`  Creating images table...`);
        } else if (upperStatement.includes("CREATE INDEX")) {
          const match = statement.match(/CREATE INDEX (\w+)/i);
          console.log(`  Creating index ${match ? match[1] : ""}...`);
        } else if (upperStatement.includes("INSERT INTO CATEGORIES")) {
          console.log(`  Inserting categories (19 entries)...`);
        } else if (upperStatement.includes("INSERT INTO IMAGES")) {
          console.log(`  Inserting sample images...`);
        }
        await pool.query(statement);
      } catch (error: any) {
        // Ignore "already exists" errors
        if (error.code === "42P07" || error.code === "42710") {
          console.log(`  ⚠️  Already exists, skipping...`);
        } else {
          console.error(`  ❌ Error executing statement:`, error.message);
          throw error;
        }
      }
    }

    console.log("✅ Schema executed successfully!");

    // Verify tables
    console.log("\n📊 Checking tables...");
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log("Tables created:");
    tablesResult.rows.forEach((row: any) => {
      console.log(`  - ${row.table_name}`);
    });

    // Check categories count
    console.log("\n📋 Checking categories...");
    const categoriesResult = await pool.query(
      "SELECT COUNT(*) as count FROM categories;"
    );
    console.log(`Categories count: ${categoriesResult.rows[0].count}`);

    if (categoriesResult.rows[0].count > 0) {
      console.log("\nSample categories:");
      const sampleResult = await pool.query(
        "SELECT id, name_en, name_sv FROM categories LIMIT 5;"
      );
      sampleResult.rows.forEach((row: any) => {
        console.log(`  ${row.id}. ${row.name_en} / ${row.name_sv}`);
      });
    }

    console.log("\n✅ Database initialization complete!");
  } catch (error) {
    console.error("❌ Database initialization failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initializeDatabase();
