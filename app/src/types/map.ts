export interface MapMarker {
  id: string | number;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  filename?: string;
  uploadTimestamp?: Date;
  groupedMarkers?: MapMarker[]; // For markers that represent multiple images at the same location
}

export interface MapData {
  center: {
    latitude: number;
    longitude: number;
  };
  zoom: number;
  markers: MapMarker[];
  locationStatus?: "user" | "markers" | "default";
}

// API Types
export interface ApiImageResponse {
  id: number;
  filename: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  latitude?: number;
  longitude?: number;
  uploadTimestamp: Date;
}

export interface ApiImagesResponse {
  images: ApiImageResponse[];
  pagination: {
    limit: number;
    offset: number;
    count: number;
  };
}

export interface ApiUploadResponse {
  message: string;
  image: ApiImageResponse;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  count: number;
}

export interface HeatmapResponse {
  points: HeatmapPoint[];
  total: number;
}

export class MapDataService {
  static async getMapData(): Promise<MapData> {
    // Mock data for now - will be replaced with API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      center: {
        latitude: 40.7128,
        longitude: -74.006,
      },
      zoom: 12,
      markers: [
        {
          id: "1",
          latitude: 40.758,
          longitude: -73.9855,
          title: "Times Square Cleanup 🧹",
          description: "Heavy foot traffic area needs daily attention",
          imageUrl: "/images/trash1.jpg",
          imageAlt: "Trash in Times Square area",
        },
        {
          id: "2",
          latitude: 40.7505,
          longitude: -73.9934,
          title: "Herald Square Spot 🗑️",
          description: "Popular shopping area with litter issues",
          imageUrl: "/images/trash2.jpg",
          imageAlt: "Litter near Herald Square",
        },
        {
          id: "3",
          latitude: 40.7614,
          longitude: -73.9776,
          title: "Central Park South 🌳",
          description: "Park entrance area with scattered waste",
          imageUrl: "/images/trash3.jpg",
          imageAlt: "Waste near Central Park entrance",
        },
        {
          id: "4",
          latitude: 40.7378,
          longitude: -74.0026,
          title: "Financial District 💼",
          description: "Business district with lunch-hour litter",
          imageUrl: "/images/trash4.jpg",
          imageAlt: "Litter in Financial District",
        },
        {
          id: "5",
          latitude: 40.7282,
          longitude: -73.9942,
          title: "Washington Square Park 🎭",
          description: "High-traffic park area needing cleanup",
          imageUrl: "/images/trash5.jpg",
          imageAlt: "Trash around Washington Square Park",
        },
      ],
    };
  }
}
