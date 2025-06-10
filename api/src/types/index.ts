// Database row interfaces
export interface ImageRow {
  id: number;
  filename: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  image_data: Uint8Array;
  latitude?: number;
  longitude?: number;
  upload_timestamp: Date;
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
