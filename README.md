# GOT Impactathon 2025

## Environment Variables

Create a `.env` file in the root directory with the following variables:

### Database Configuration (PostgreSQL)
```bash
# For connecting to a remote PostgreSQL database (e.g., Supabase)
# This will take precedence over the individual variables below.
POSTGRES_URL="your_postgres_connection_string_here"
POSTGRES_PRISMA_URL="your_postgres_prisma_url_here"
POSTGRES_URL_NON_POOLING="your_postgres_non_pooling_url_here"

# Supabase Configuration
SUPABASE_URL="your_supabase_url_here"
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url_here"
SUPABASE_JWT_SECRET="your_supabase_jwt_secret_here"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key_here"

# Database User (for reference)
POSTGRES_USER="your_postgres_user_here"

# For local development with Docker Compose (fallback if POSTGRES_URL is not set)
DB_HOST=localhost
DB_PORT=5432
DB_USER=geotag_user
DB_PASSWORD=geotag_password
DB_NAME=geotag_images

# API Server Configuration
PORT=3000
```

## Getting Started

1. Install dependencies:
   ```bash
   pnpm run install:all
   ```

2. Set up your environment variables (see above)

3. Start the development servers:
   ```bash
   # Start both frontend and backend
   pnpm run dev:all
   
   # Or start individually
   pnpm run app:dev    # Frontend only
   pnpm run api:dev    # Backend only
   ```

## Database Setup

### Using Remote Database (Supabase)
If you're using a remote PostgreSQL database like Supabase, just set the `POSTGRES_URL` environment variable and the app will connect automatically.

### Using Local Database (Docker)
If you want to run a local PostgreSQL database:
```bash
docker-compose up -d
```

This will start a PostgreSQL container with the schema automatically initialized.
