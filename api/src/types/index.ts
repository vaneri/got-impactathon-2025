// Database row interfaces
export interface CategoryRow {
  id: number;
  name_en: string;
  name_sv: string;
  description_en?: string;
  description_sv?: string;
  created_at: Date;
}

export interface ImageRow {
  id: number;
  filename: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  image_data: Uint8Array;
  latitude?: number;
  longitude?: number;
  category_id?: number;
  description?: string;
  upload_timestamp: Date;
  // Joined fields from categories table
  category_name_en?: string;
  category_name_sv?: string;
}

// API request/response types
export interface ImageMetadata {
  latitude?: number;
  longitude?: number;
  width?: number;
  height?: number;
}

export interface ImageResponse {
  id: number;
  filename: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  latitude?: number;
  longitude?: number;
  categoryId?: number;
  categoryNameEn?: string;
  categoryNameSv?: string;
  description?: string;
  uploadTimestamp: Date;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  count: number;
}

export interface HeatmapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface ImageStats {
  totalImages: number;
  imagesWithCoordinates: number;
  avgFileSize: number;
}
