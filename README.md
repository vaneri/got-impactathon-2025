# GOT Impactathon 2025

## Architecture

This is a **consolidated Next.js application** that includes both the frontend and API routes in a single codebase. The API is built using Next.js API routes with PostgreSQL as the database.

## Environment Variables

Create a `.env.local` file in the `app` directory with the following variables:

### Database Configuration (PostgreSQL)
```bash
# For connecting to a remote PostgreSQL database (e.g., Supabase)
# This will take precedence over the local fallback.
POSTGRES_URL="your_postgres_connection_string_here"

# Supabase Configuration (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url_here"
SUPABASE_JWT_SECRET="your_supabase_jwt_secret_here"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key_here"

# Additional environment variables (for reference)
POSTGRES_PRISMA_URL="your_postgres_prisma_url_here"
POSTGRES_URL_NON_POOLING="your_postgres_non_pooling_url_here"
POSTGRES_USER="your_postgres_user_here"
```

## Getting Started

1. Install dependencies:
   ```bash
   pnpm run install:all
   ```

2. Set up your environment variables (see above)

3. Start the application:
   ```bash
   # Start the consolidated app (frontend + API)
   pnpm dev
   # or
   pnpm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

The following API endpoints are available at `/api/`:

### Images
- `GET /api/images` - Get all images with pagination
- `POST /api/images/upload` - Upload a new image with coordinates
- `GET /api/images/{id}` - Get specific image metadata
- `GET /api/images/{id}/file` - Get image file data
- `DELETE /api/images/{id}` - Delete an image
- `GET /api/images/stats/summary` - Get image statistics

### Heatmap
- `GET /api/heatmap/coordinates` - Get all coordinates for heatmap
- `GET /api/heatmap/bounds` - Get coordinates within bounds
- `GET /api/heatmap/density` - Get density data with grid grouping

### Health
- `GET /api/health` - Health check endpoint

## Database Setup

### Using Remote Database (Recommended)
If you're using a remote PostgreSQL database like Supabase, just set the `POSTGRES_URL` environment variable and the app will connect automatically.

### Using Local Database (Development)
If you want to run a local PostgreSQL database for development:
```bash
docker-compose up -d postgres
```

This will start a PostgreSQL container with the schema automatically initialized.

## Features

- ✅ **Consolidated Architecture** - Single Next.js app with integrated API
- ✅ **Real-time Image Upload** - Camera capture and file upload
- ✅ **Interactive Map** - Display uploaded images with geolocation
- ✅ **PostgreSQL Database** - Robust data storage with PostGIS support
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Error Handling** - Comprehensive error handling and user feedback

## Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start:prod

# Lint code
pnpm app:lint
```
