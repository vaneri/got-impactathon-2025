import {
  ApiImageResponse,
  ApiImagesResponse,
  ApiUploadResponse,
  HeatmapResponse,
  MapData,
  MapMarker,
} from "../types/map";

// Use the same origin for API calls when running in production/development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

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
   * Get user's current location
   */
  private static getUserLocation(): Promise<{
    latitude: number;
    longitude: number;
  }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Failed to get user location:", error);
          reject(error);
        },
        {
          enableHighAccuracy: false, // Use network-based location for speed
          timeout: 5000, // 5 second timeout
          maximumAge: 300000, // 5 minutes cache
        }
      );
    });
  }

  /**
   * Group markers that are very close to each other and apply slight offsets
   */
  private static groupAndOffsetMarkers(markers: MapMarker[]): MapMarker[] {
    const PROXIMITY_THRESHOLD = 0.0001; // ~10 meters
    const OFFSET_AMOUNT = 0.0002; // Small offset to separate markers

    const processedMarkers: MapMarker[] = [];
    const processed = new Set<number>();

    markers.forEach((marker, index) => {
      if (processed.has(index)) return;

      // Find all markers within proximity threshold
      const nearbyMarkers = markers.filter((otherMarker, otherIndex) => {
        if (index === otherIndex || processed.has(otherIndex)) return false;

        const distance = Math.sqrt(
          Math.pow(marker.latitude - otherMarker.latitude, 2) +
            Math.pow(marker.longitude - otherMarker.longitude, 2)
        );

        return distance <= PROXIMITY_THRESHOLD;
      });

      if (nearbyMarkers.length === 0) {
        // Single marker at this location
        processedMarkers.push(marker);
        processed.add(index);
      } else {
        // Multiple markers at similar location - offset them in a circle pattern
        const allMarkersAtLocation = [marker, ...nearbyMarkers];

        allMarkersAtLocation.forEach((markerToOffset, offsetIndex) => {
          if (offsetIndex === 0) {
            // Keep the first marker at original position but update title
            processedMarkers.push({
              ...markerToOffset,
              title: `${markerToOffset.title} (1/${allMarkersAtLocation.length})`,
              description: `${markerToOffset.description} - Part of ${allMarkersAtLocation.length} reports at this location.`,
            });
          } else {
            // Offset other markers in a circle pattern
            const angle =
              ((offsetIndex - 1) * 2 * Math.PI) /
              (allMarkersAtLocation.length - 1);
            const offsetLat = Math.cos(angle) * OFFSET_AMOUNT;
            const offsetLng = Math.sin(angle) * OFFSET_AMOUNT;

            processedMarkers.push({
              ...markerToOffset,
              latitude: markerToOffset.latitude + offsetLat,
              longitude: markerToOffset.longitude + offsetLng,
              title: `${markerToOffset.title} (${offsetIndex + 1}/${
                allMarkersAtLocation.length
              })`,
              description: `${markerToOffset.description} - Part of ${allMarkersAtLocation.length} reports at this location.`,
            });
          }
        });

        // Mark all as processed
        processed.add(index);
        nearbyMarkers.forEach((_, nearbyIndex) => {
          const originalIndex = markers.findIndex(
            (m) => m === nearbyMarkers[nearbyIndex]
          );
          processed.add(originalIndex);
        });
      }
    });

    return processedMarkers;
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

      // Group and offset markers that are too close to each other
      const processedMarkers = this.groupAndOffsetMarkers(markers);

      // Try to center on user's location first, with fallbacks
      let center = {
        latitude: 40.7128, // Default to NYC
        longitude: -74.006,
      };
      let locationStatus: "user" | "markers" | "default" = "default";

      try {
        // First priority: User's current location
        const userLocation = await this.getUserLocation();
        center = userLocation;
        locationStatus = "user";
        console.log("Map centered on user location:", center);
      } catch {
        console.log(
          "Could not get user location, falling back to marker-based centering"
        );

        // Second priority: Average of all markers
        if (processedMarkers.length > 0) {
          const avgLat =
            processedMarkers.reduce((sum, marker) => sum + marker.latitude, 0) /
            processedMarkers.length;
          const avgLng =
            processedMarkers.reduce(
              (sum, marker) => sum + marker.longitude,
              0
            ) / processedMarkers.length;

          // Validate calculated center
          if (!isNaN(avgLat) && !isNaN(avgLng)) {
            center = {
              latitude: avgLat,
              longitude: avgLng,
            };
            locationStatus = "markers";
            console.log("Map centered on marker average:", center);
          }
        } else {
          locationStatus = "default";
          console.log(
            "No markers available, using default center (NYC):",
            center
          );
        }
      }

      console.log("Final map center:", center);
      console.log("Final processed markers:", processedMarkers);

      // Set zoom level based on how the center was determined
      let zoom: number;
      switch (locationStatus) {
        case "user":
          zoom = 15; // Close zoom for user location to see immediate area
          break;
        case "markers":
          zoom = 12; // Medium zoom to see all markers in the area
          break;
        case "default":
          zoom = 10; // Wide zoom for default location
          break;
        default:
          zoom = processedMarkers.length > 0 ? 12 : 10;
      }

      return {
        center,
        zoom,
        markers: processedMarkers,
        locationStatus,
      };
    } catch (error) {
      console.error("Failed to load map data from API:", error);

      // Fallback to mock data if API fails
      return {
        center: {
          latitude: 40.7128,
          longitude: -74.006,
        },
        zoom: 10, // Wide zoom for fallback default location
        markers: [],
        locationStatus: "default",
      };
    }
  }

  /**
   * Check API health
   */
  static async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${API_BASE_URL}/api/health`);

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }

    return response.json();
  }
}
