# PostgreSQL Migration Summary

## ✅ Complete Migration from MySQL to PostgreSQL

This document summarizes all changes made to migrate the Gothenburg CityReport application from MySQL to PostgreSQL.

---

## 📊 Changes Overview

### 1. **Database Schema** (`/database/init/01_init_schema.sql`)

#### Changed Database Types:
- `INT AUTO_INCREMENT PRIMARY KEY` → `SERIAL PRIMARY KEY`
- `BIGINT AUTO_INCREMENT PRIMARY KEY` → `BIGSERIAL PRIMARY KEY`
- `LONGBLOB` → `BYTEA` (for binary image data)
- `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` → unchanged (compatible)

#### Changed Index Syntax:
```sql
-- MySQL (inline):
INDEX idx_name (column)

-- PostgreSQL (separate statements):
CREATE INDEX idx_name ON table (column);
```

#### Binary Data Insertion:
```sql
-- MySQL:
INSERT INTO images (..., image_data, ...) VALUES (..., 'dummy_blob_data', ...);

-- PostgreSQL:
INSERT INTO images (..., image_data, ...) VALUES (..., decode('64756d6d795f626c6f625f64617461', 'hex'), ...);
```

---

### 2. **Database Configuration** (`/api/src/config/database.ts`)

#### Replaced MySQL with PostgreSQL Driver:

**Before (MySQL):**
```typescript
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "geotag_user",
  password: process.env.DB_PASSWORD ?? "geotag_password",
  database: process.env.DB_NAME ?? "geotag_images",
  charset: "utf8mb4",
  timezone: "+00:00",
});
```

**After (PostgreSQL):**
```typescript
import { Pool, PoolConfig, QueryResult } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASSWORD ?? "postgres",
  database: process.env.DB_NAME ?? "geotag_images",
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 60000,
});
```

#### Key Changes:

1. **Placeholder Conversion**: MySQL uses `?`, PostgreSQL uses `$1`, `$2`, etc.
   ```typescript
   // Automatic conversion in query method
   let paramIndex = 1;
   const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
   ```

2. **Result Handling**: 
   - MySQL returns `[results, fields]`
   - PostgreSQL returns `QueryResult` with `rows` property
   ```typescript
   // PostgreSQL
   const result: QueryResult = await this.pool.query(pgSql, params);
   return result.rows; // Return rows directly
   ```

3. **INSERT with RETURNING**:
   ```typescript
   // For INSERT queries
   if (sql.trim().toUpperCase().startsWith("INSERT")) {
     return {
       insertId: result.rows[0]?.id || null,
       rowCount: result.rowCount,
       rows: result.rows,
     };
   }
   ```

---

### 3. **Image Model** (`/api/src/models/Image.ts`)

#### Added `RETURNING` clause for INSERT:

**Before:**
```sql
INSERT INTO images (...) VALUES (?, ?, ?, ...)
```

**After:**
```sql
INSERT INTO images (...) VALUES (?, ?, ?, ...)
RETURNING id
```

**ID Retrieval:**
```typescript
const result = await database.query(sql, params);
this.id = result.insertId || result.rows?.[0]?.id;
```

---

### 4. **Package Dependencies** (`/api/package.json`)

#### Replaced MySQL with PostgreSQL:

**Before:**
```json
{
  "dependencies": {
    "mysql2": "^3.14.1"
  }
}
```

**After:**
```json
{
  "dependencies": {
    "pg": "^8.13.1"
  },
  "devDependencies": {
    "@types/pg": "^8.11.10"
  }
}
```

---

### 5. **Docker Compose** (`/docker-compose.yml`)

#### Complete Service Replacement:

**Before (MySQL + phpMyAdmin):**
```yaml
services:
  mysql:
    image: mysql:8.0
    container_name: trash_network
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: geotag_images
      MYSQL_USER: geotag_user
      MYSQL_PASSWORD: geotag_password

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    ports:
      - "8080:80"
```

**After (PostgreSQL + pgAdmin):**
```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: gothenburg_postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_USER: postgres
      POSTGRES_DB: geotag_images
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: gothenburg_pgadmin
    ports:
      - "8080:80"
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@gothenburg.se
      PGADMIN_DEFAULT_PASSWORD: admin
```

---

## 🔧 Key Differences: MySQL vs PostgreSQL

| Feature | MySQL | PostgreSQL |
|---------|-------|------------|
| **Port** | 3306 | 5432 |
| **Auto Increment** | `AUTO_INCREMENT` | `SERIAL`, `BIGSERIAL` |
| **Binary Data** | `BLOB`, `LONGBLOB` | `BYTEA` |
| **Placeholders** | `?` | `$1`, `$2`, `$3`, ... |
| **Result Format** | `[rows, fields]` | `{ rows, rowCount, ... }` |
| **INSERT ID** | `result.insertId` | `RETURNING id` clause |
| **Index Creation** | Inline in `CREATE TABLE` | Separate `CREATE INDEX` |
| **Admin Tool** | phpMyAdmin | pgAdmin |
| **Default User** | `root` / custom | `postgres` |

---

## 🚀 Benefits of PostgreSQL

1. **Better Standards Compliance**: More SQL standard compliant
2. **Advanced Features**: Better support for complex queries, CTEs, window functions
3. **PostGIS Ready**: Can easily add geospatial extensions for advanced location queries
4. **JSON Support**: Native JSON/JSONB data types with indexing
5. **Better Concurrency**: MVCC (Multi-Version Concurrency Control)
6. **Open Source**: Truly open source with no commercial version
7. **Scalability**: Better performance for complex queries
8. **Data Integrity**: Stronger enforcement of data types and constraints

---

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=geotag_images

# API Configuration
PORT=3001
NODE_ENV=development
```

**For Remote PostgreSQL:**
```env
DB_HOST=your-remote-host.example.com
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_secure_password
DB_NAME=your_database
```

---

## 🧪 Testing the Migration

### 1. Start PostgreSQL:
```bash
docker-compose up -d
```

### 2. Verify Database:
```bash
docker exec -it gothenburg_postgres psql -U postgres -d geotag_images -c "\dt"
```

Expected output:
```
              List of relations
 Schema |    Name    | Type  |  Owner   
--------+------------+-------+----------
 public | categories | table | postgres
 public | images     | table | postgres
```

### 3. Check Categories:
```bash
docker exec -it gothenburg_postgres psql -U postgres -d geotag_images -c "SELECT COUNT(*) FROM categories;"
```

Expected output: `19` (categories)

### 4. Start API:
```bash
cd api
pnpm install
pnpm dev
```

Expected log:
```
✅ PostgreSQL Database connected successfully
```

### 5. Test API Endpoints:
```bash
# Health check
curl http://localhost:3001/health

# Get categories
curl http://localhost:3001/api/categories

# Upload test (requires multipart form data)
```

---

## 🔍 Backward Compatibility

The migration maintains **API compatibility**:

- ✅ All API endpoints remain the same
- ✅ Request/response formats unchanged
- ✅ Frontend code requires **no changes**
- ✅ Category foreign key relationships preserved
- ✅ Automatic MySQL `?` to PostgreSQL `$1` conversion

---

## 📦 Files Modified

1. ✅ `/database/init/01_init_schema.sql` - PostgreSQL syntax
2. ✅ `/api/src/config/database.ts` - PostgreSQL driver
3. ✅ `/api/src/models/Image.ts` - RETURNING clause
4. ✅ `/api/package.json` - pg dependency
5. ✅ `/docker-compose.yml` - PostgreSQL services
6. ✅ `/README.md` - Updated documentation
7. ✅ `/DATABASE_SETUP.md` - New setup guide
8. ✅ `/POSTGRESQL_MIGRATION.md` - This file

---

## 🎯 Next Steps (Optional Enhancements)

1. **PostGIS Extension**: Add geospatial capabilities
   ```sql
   CREATE EXTENSION postgis;
   ALTER TABLE images ADD COLUMN geom GEOMETRY(Point, 4326);
   ```

2. **Full-Text Search**: Enhance description search
   ```sql
   ALTER TABLE images ADD COLUMN description_tsv tsvector;
   CREATE INDEX idx_description_fts ON images USING gin(description_tsv);
   ```

3. **Partitioning**: Split large tables by date/region

4. **Read Replicas**: Scale read operations

5. **Connection Pooling**: PgBouncer for production

---

## ✅ Migration Complete!

The application is now fully migrated to PostgreSQL 16 with:
- ✅ Categories table with 19 bilingual entries
- ✅ Images table with foreign key to categories
- ✅ Docker Compose setup with PostgreSQL + pgAdmin
- ✅ API fully adapted to PostgreSQL
- ✅ Backward-compatible query interface
- ✅ All models and routes updated
- ✅ No frontend changes required

**Test Status**: Ready for testing
**Production Ready**: Yes (after environment configuration)

---

© 2025 Gothenburg FaultReport. City of Gothenburg.

