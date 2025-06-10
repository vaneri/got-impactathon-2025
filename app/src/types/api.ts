export interface ImageRow {
  id: number;
  filename: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  image_data?: Buffer;
  latitude?: number;
  longitude?: number;
  upload_timestamp: Date;
}

export interface ImageStats {
  totalImages: number;
  imagesWithCoordinates: number;
  avgFileSize: number;
}

export interface HeatmapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  count: number;
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