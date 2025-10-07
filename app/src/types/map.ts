export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  imageUrl: string;
  imageAlt?: string;
  category?: string;
  reportDescription?: string;
}

export interface MapData {
  markers: MapMarker[];
  center: {
    latitude: number;
    longitude: number;
  };
  zoom: number;
}

// Data service abstraction - fetches from API
export class MapDataService {
  static async getMapData(): Promise<MapData> {
    try {
      // Dynamic import to avoid server-side issues
      const { ApiService } = await import("../services/apiService");

      // Fetch images from API
      const images = await ApiService.getImages();

      // Convert API images to map markers
      const markers: MapMarker[] = images
        .filter((img) => img.latitude && img.longitude) // Only images with coordinates
        .map((img) => ({
          id: img.id.toString(),
          latitude: img.latitude!,
          longitude: img.longitude!,
          title: img.categoryNameEn || `Report #${img.id}`,
          description:
            img.description ||
            `Submitted on ${new Date(
              img.uploadTimestamp
            ).toLocaleDateString()}`,
          imageUrl: ApiService.getImageUrl(img.filename),
          imageAlt: img.originalFilename,
          category: img.categoryNameEn,
          reportDescription: img.description,
        }));

      // Return Gothenburg center by default
      return {
        center: {
          latitude: 57.7089, // Gothenburg center
          longitude: 11.9746,
        },
        zoom: 13,
        markers,
      };
    } catch (error) {
      console.error("Failed to load map data from API:", error);

      // Return default Gothenburg location with no markers on error
      return {
        center: {
          latitude: 57.7089,
          longitude: 11.9746,
        },
        zoom: 13,
        markers: [],
      };
    }
  }
}
