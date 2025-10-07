-- Categories table - stores report categories
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL UNIQUE,
    name_sv VARCHAR(100) NOT NULL UNIQUE,
    description_en TEXT NULL,
    description_sv TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes separately (PostgreSQL syntax)
CREATE INDEX idx_name_en ON categories (name_en);
CREATE INDEX idx_name_sv ON categories (name_sv);

-- Insert categories
INSERT INTO categories (name_en, name_sv) VALUES
('Lighting', 'Belysning'),
('Noise', 'Buller'),
('Bike Path', 'Cykelbana'),
('Well', 'Brunn'),
('Street Maintenance', 'Gatuunderhåll'),
('Pothole', 'Hål i gatan'),
('Grass', 'Gräs'),
('Graffiti', 'Klotter'),
('Playground', 'Lekplats'),
('Exercise Trail', 'Motionsspår'),
('Littering', 'Nedskräpning'),
('Trash Bins', 'Papperskorgar'),
('Sand and Gravel', 'Sand och grus'),
('Signs and Road Marks', 'Skyltar och vägmärken'),
('Traffic Signals', 'Trafiksignaler'),
('Trees and Shrubs', 'Träd och buskar'),
('Outdoor Gym', 'Utegym'),
('Winter Road Maintenance', 'Vinterväghållning'),
('Roadwork', 'Vägarbeten');

-- Simplified images table - stores image data with coordinates
CREATE TABLE images (
    id BIGSERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    image_data BYTEA NOT NULL,
    
    -- Geographic coordinates
    latitude DECIMAL(10, 8) NULL,
    longitude DECIMAL(11, 8) NULL,
    
    -- Report details
    category_id INT NULL,
    description TEXT NULL,
    
    upload_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Create indexes separately for PostgreSQL
CREATE INDEX idx_coordinates ON images (latitude, longitude);
CREATE INDEX idx_filename ON images (filename);
CREATE INDEX idx_upload_timestamp ON images (upload_timestamp);
CREATE INDEX idx_category_id ON images (category_id);

-- Insert some example data for testing
INSERT INTO images (filename, original_filename, mime_type, file_size, image_data, latitude, longitude)
VALUES
('example1.jpg', 'vacation_photo.jpg', 'image/jpeg', 2048576, decode('64756d6d795f626c6f625f64617461', 'hex'), 40.7589, -73.9851),
('example2.jpg', 'city_skyline.jpg', 'image/jpeg', 1536768, decode('64756d6d795f626c6f625f64617461', 'hex'), 51.5074, -0.1278);
