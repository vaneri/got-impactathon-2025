-- Create database if not exists
CREATE DATABASE IF NOT EXISTS geotag_images;
USE geotag_images;

-- Simplified images table - stores image data with coordinates
CREATE TABLE images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    image_data LONGBLOB NOT NULL,
    
    -- Geographic coordinates
    latitude DECIMAL(10, 8) NULL,
    longitude DECIMAL(11, 8) NULL,
    
    upload_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes for efficient geospatial queries
    INDEX idx_coordinates (latitude, longitude),
    INDEX idx_filename (filename),
    INDEX idx_upload_timestamp (upload_timestamp)
);

-- Insert some example data for testing
INSERT INTO images (filename, original_filename, mime_type, file_size, image_data, latitude, longitude) VALUES
('example1.jpg', 'vacation_photo.jpg', 'image/jpeg', 2048576, 'dummy_blob_data', 40.7589, -73.9851),
('example2.jpg', 'city_skyline.jpg', 'image/jpeg', 1536768, 'dummy_blob_data', 51.5074, -0.1278); 