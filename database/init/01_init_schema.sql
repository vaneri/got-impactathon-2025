-- PostgreSQL initialization script for geotag_images database
-- This script is executed automatically by Docker when the container starts

-- Create the images table for storing image metadata and binary data
CREATE TABLE IF NOT EXISTS images (
    id BIGSERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    image_data BYTEA NOT NULL,
    
    -- Geographic coordinates (allowing NULL values)
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Timestamp with timezone support, defaulting to current time
    upload_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_coordinates ON images (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_filename ON images (filename);
CREATE INDEX IF NOT EXISTS idx_upload_timestamp ON images (upload_timestamp);

-- Insert sample data for testing (using proper PostgreSQL bytea format)
INSERT INTO images (filename, original_filename, mime_type, file_size, image_data, latitude, longitude) VALUES
('example1.jpg', 'vacation_photo.jpg', 'image/jpeg', 2048576, E'\\xDEADBEEF'::bytea, 40.7589, -73.9851),
('example2.jpg', 'city_skyline.jpg', 'image/jpeg', 1536768, E'\\xCAFEBABE'::bytea, 51.5074, -0.1278),
('example3.jpg', 'beach_sunset.jpg', 'image/jpeg', 1828576, E'\\xFEEDFACE'::bytea, 34.0522, -118.2437);

-- Create additional indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_file_size ON images (file_size);
CREATE INDEX IF NOT EXISTS idx_mime_type ON images (mime_type);

-- Add comments to document the table structure
COMMENT ON TABLE images IS 'Stores uploaded images with geographic coordinates and metadata';
COMMENT ON COLUMN images.id IS 'Auto-incrementing primary key';
COMMENT ON COLUMN images.filename IS 'Generated unique filename for storage';
COMMENT ON COLUMN images.original_filename IS 'Original filename as uploaded by user';
COMMENT ON COLUMN images.mime_type IS 'MIME type of the image (e.g., image/jpeg)';
COMMENT ON COLUMN images.file_size IS 'Size of the image file in bytes';
COMMENT ON COLUMN images.image_data IS 'Binary data of the image file';
COMMENT ON COLUMN images.latitude IS 'Geographic latitude coordinate (WGS84)';
COMMENT ON COLUMN images.longitude IS 'Geographic longitude coordinate (WGS84)';
COMMENT ON COLUMN images.upload_timestamp IS 'Timestamp when the image was uploaded'; 