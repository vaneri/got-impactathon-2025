# PostgreSQL Database Setup

## Environment Variables

Create a `.env` file in the root directory with the following variables:

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

## Local Development with Docker

### Start PostgreSQL and pgAdmin:

```bash
docker-compose up -d
```

This will start:
- **PostgreSQL 16** on port `5432`
- **pgAdmin** on port `8080` (http://localhost:8080)

### pgAdmin Credentials:
- Email: `admin@gothenburg.se`
- Password: `admin`

### Database Connection in pgAdmin:
1. Open http://localhost:8080
2. Add New Server:
   - **Name**: Gothenburg CityReport
   - **Host**: postgres (or localhost if connecting from host machine)
   - **Port**: 5432
   - **Username**: postgres
   - **Password**: postgres
   - **Database**: geotag_images

### Stop Services:

```bash
docker-compose down
```

### Reset Database (Delete all data):

```bash
docker-compose down -v
docker-compose up -d
```

## Remote PostgreSQL Database

If you're using a remote PostgreSQL database (e.g., from a cloud provider), update your `.env` file:

```env
DB_HOST=your-remote-host.com
DB_PORT=5432
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=your-database-name
```

### Run Schema Initialization

The schema in `/database/init/01_init_schema.sql` will automatically run on first startup for Docker.

For remote databases, manually run:

```bash
psql -h your-remote-host.com -U your-username -d your-database-name -f database/init/01_init_schema.sql
```

## Database Schema

The schema includes:

### Tables:
1. **categories** - Report categories (bilingual: English & Swedish)
2. **images** - Image reports with geographic coordinates

### Pre-populated Categories (19):
- Belysning / Lighting
- Buller / Noise
- Cykelbana / Bike Path
- Brunn / Well
- Gatuunderhåll / Street Maintenance
- Hål i gatan / Pothole
- Gräs / Grass
- Klotter / Graffiti
- Lekplats / Playground
- Motionsspår / Exercise Trail
- Nedskräpning / Littering
- Papperskorgar / Trash Bins
- Sand och grus / Sand and Gravel
- Skyltar och vägmärken / Signs and Road Marks
- Trafiksignaler / Traffic Signals
- Träd och buskar / Trees and Shrubs
- Utegym / Outdoor Gym
- Vinterväghållning / Winter Road Maintenance
- Vägarbeten / Roadwork

## Testing the Connection

```bash
cd api
pnpm install
pnpm dev
```

The API will connect to PostgreSQL and log:
```
✅ PostgreSQL Database connected successfully
```

## Troubleshooting

### Connection Refused
- Ensure PostgreSQL is running: `docker ps`
- Check port 5432 is not in use: `lsof -i :5432` (macOS/Linux)
- Verify environment variables in `.env`

### Authentication Failed
- Double-check `DB_USER` and `DB_PASSWORD` in `.env`
- For remote databases, ensure your IP is whitelisted

### Schema Not Created
- For Docker: Delete volume and restart: `docker-compose down -v && docker-compose up -d`
- For remote: Manually run the SQL file

## Migration from MySQL

If you were previously using MySQL:

1. Stop MySQL containers: `docker-compose down -v`
2. Update `docker-compose.yml` (already done)
3. Update `.env` file with PostgreSQL settings
4. Update API dependencies (already done)
5. Start PostgreSQL: `docker-compose up -d`
6. The schema will auto-initialize

**Note**: The API code automatically converts MySQL-style placeholders (`?`) to PostgreSQL-style (`$1`, `$2`, etc.) in the Database class.

