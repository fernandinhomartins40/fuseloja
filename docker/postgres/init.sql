-- FuseLoja PostgreSQL Initialization Script
-- This script runs when the PostgreSQL container is first created

-- Set timezone
SET timezone = 'America/Sao_Paulo';

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_trgm for text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create database (if it doesn't exist - handled by POSTGRES_DB env var)
-- Additional configurations can go here

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE fuseloja TO fuseloja;

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'FuseLoja database initialized successfully';
END $$;
