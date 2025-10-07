#!/bin/bash

# Load environment variables
source .env

# Set PGPASSWORD for non-interactive connection
export PGPASSWORD="$POSTGRES_PASSWORD"

echo "🔄 Initializing Supabase PostgreSQL Database..."
echo "Host: $POSTGRES_HOST"
echo "Database: $POSTGRES_DATABASE"
echo "User: $POSTGRES_USER"
echo ""

# Connect to Supabase and run the initialization script
psql -h "$POSTGRES_HOST" \
     -U "$POSTGRES_USER" \
     -d "$POSTGRES_DATABASE" \
     -f database/init/01_init_schema.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database initialized successfully!"
    echo ""
    echo "📊 Checking tables..."
    psql -h "$POSTGRES_HOST" \
         -U "$POSTGRES_USER" \
         -d "$POSTGRES_DATABASE" \
         -c "\dt"
    
    echo ""
    echo "📋 Checking categories..."
    psql -h "$POSTGRES_HOST" \
         -U "$POSTGRES_USER" \
         -d "$POSTGRES_DATABASE" \
         -c "SELECT COUNT(*) as category_count FROM categories;"
else
    echo ""
    echo "❌ Database initialization failed!"
    exit 1
fi

