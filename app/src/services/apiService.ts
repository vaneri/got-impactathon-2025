// API Service for Gothenburg CityReport
// Using relative URLs since API routes are in the same Next.js app
const API_BASE_URL = "";

export interface Category {
  id: number;
  nameEn: string;
  nameSv: string;
  descriptionEn?: string;
  descriptionSv?: string;
}

export interface ImageData {
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
  uploadTimestamp: string;
}

export class ApiService {
  // Health check
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }

  // Get all categories
  static async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
  }

  // Get all images with coordinates
  static async getImages(): Promise<ImageData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/images`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.images || [];
    } catch (error) {
      console.error("Failed to fetch images:", error);
      return [];
    }
  }

  // Get image data (binary) by filename
  static getImageUrl(filename: string): string {
    return `${API_BASE_URL}/api/images/${filename}/data`;
  }

  // Upload image with location
  static async uploadImage(
    imageBlob: Blob,
    latitude: number,
    longitude: number,
    category?: string,
    description?: string
  ): Promise<ImageData | null> {
    try {
      const formData = new FormData();

      // Convert blob to file
      const file = new File([imageBlob], `report-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      formData.append("image", file);
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());

      if (category) {
        formData.append("category", category);
      }

      if (description) {
        formData.append("description", description);
      }

      const response = await fetch(`${API_BASE_URL}/api/images/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data.image;
    } catch (error) {
      console.error("Failed to upload image:", error);
      throw error;
    }
  }

  // Get heatmap data
  static async getHeatmapData(bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  }): Promise<Array<{ lat: number; lng: number; intensity: number }>> {
    try {
      let url = `${API_BASE_URL}/api/heatmap`;

      if (bounds) {
        const params = new URLSearchParams({
          north: bounds.north.toString(),
          south: bounds.south.toString(),
          east: bounds.east.toString(),
          west: bounds.west.toString(),
        });
        url += `?${params}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.heatmap || [];
    } catch (error) {
      console.error("Failed to fetch heatmap data:", error);
      return [];
    }
  }
}
