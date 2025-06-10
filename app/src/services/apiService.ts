import {
  ApiImageResponse,
  ApiImagesResponse,
  ApiUploadResponse,
  HeatmapResponse,
  MapData,
  MapMarker,
} from "../types/map";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export class ApiService {
  /**
   * Upload a new image with coordinates
   */
  static async uploadImage(
    imageFile: File,
    latitude: number,
    longitude: number
  ): Promise<ApiUploadResponse> {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("latitude", latitude.toString());
    formData.append("longitude", longitude.toString());

    const response = await fetch(`${API_BASE_URL}/api/images/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Upload a base64 image with coordinates
   */
  static async uploadBase64Image(
    base64Data: string,
    latitude: number,
    longitude: number,
    filename: string = "camera-capture.png"
  ): Promise<ApiUploadResponse> {
    // Convert base64 to blob
    const response = await fetch(base64Data);
    const blob = await response.blob();
    const file = new File([blob], filename, { type: "image/png" });

    return this.uploadImage(file, latitude, longitude);
  }

  /**
   * Get all images metadata
   */
  static async getImages(
    limit: number = 50,
    offset: number = 0
  ): Promise<ApiImagesResponse> {
    const response = await fetch(
      `${API_BASE_URL}/api/images?limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get heatmap coordinates for map
   */
  static async getHeatmapCoordinates(): Promise<HeatmapResponse> {
    const response = await fetch(`${API_BASE_URL}/api/heatmap/coordinates`);

    if (!response.ok) {
      throw new Error(`Failed to fetch coordinates: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get image file URL for display
   */
  static getImageUrl(imageId: number): string {
    return `${API_BASE_URL}/api/images/${imageId}/file`;
  }

  /**
   * Get specific image metadata
   */
  static async getImageById(id: number): Promise<ApiImageResponse> {
    const response = await fetch(`${API_BASE_URL}/api/images/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Convert API images to map markers
   */
  static async getMapData(): Promise<MapData> {
    try {
      const imagesResponse = await this.getImages(100); // Get more images for map

      console.log("Raw API response:", imagesResponse);

      // Filter images that have valid coordinates
      const imagesWithCoords = imagesResponse.images.filter((image) => {
        const hasCoords =
          image.latitude !== null &&
          image.longitude !== null &&
          image.latitude !== undefined &&
          image.longitude !== undefined &&
          !isNaN(Number(image.latitude)) &&
          !isNaN(Number(image.longitude));

        console.log(`Image ${image.id} coords check:`, {
          lat: image.latitude,
          lng: image.longitude,
          hasCoords,
          uploadTimestamp: image.uploadTimestamp,
        });

        return hasCoords;
      });

      console.log(
        `Found ${imagesWithCoords.length} images with valid coordinates`
      );

      const markers: MapMarker[] = imagesWithCoords.map((image) => {
        // Parse date more safely
        let uploadDate: Date | undefined;
        try {
          if (image.uploadTimestamp) {
            // Handle different timestamp formats
            const timestamp =
              typeof image.uploadTimestamp === "string"
                ? image.uploadTimestamp
                : image.uploadTimestamp.toString();

            uploadDate = new Date(timestamp);

            // Check if date is valid
            if (isNaN(uploadDate.getTime())) {
              console.warn(`Invalid date for image ${image.id}:`, timestamp);
              uploadDate = undefined;
            }
          }
        } catch (error) {
          console.warn(`Error parsing date for image ${image.id}:`, error);
          uploadDate = undefined;
        }

        return {
          id: image.id,
          latitude: Number(image.latitude),
          longitude: Number(image.longitude),
          title: `Trash Report #${image.id} 🗑️`,
          description: `Reported on ${
            uploadDate ? uploadDate.toLocaleDateString() : "Unknown date"
          }`,
          imageUrl: this.getImageUrl(image.id),
          imageAlt: `Trash report image ${image.originalFilename}`,
          filename: image.filename,
          uploadTimestamp: uploadDate,
        };
      });

      // Calculate center from available markers or use default
      let center = {
        latitude: 40.7128, // Default to NYC
        longitude: -74.006,
      };

      if (markers.length > 0) {
        const avgLat =
          markers.reduce((sum, marker) => sum + marker.latitude, 0) /
          markers.length;
        const avgLng =
          markers.reduce((sum, marker) => sum + marker.longitude, 0) /
          markers.length;

        // Validate calculated center
        if (!isNaN(avgLat) && !isNaN(avgLng)) {
          center = {
            latitude: avgLat,
            longitude: avgLng,
          };
        }
      }

      console.log("Final map center:", center);
      console.log("Final markers:", markers);

      return {
        center,
        zoom: markers.length > 0 ? 12 : 10,
        markers,
      };
    } catch (error) {
      console.error("Failed to load map data from API:", error);

      // Fallback to mock data if API fails
      return {
        center: {
          latitude: 40.7128,
          longitude: -74.006,
        },
        zoom: 12,
        markers: [],
      };
    }
  }

  /**
   * Check API health
   */
  static async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }

    return response.json();
  }
}
