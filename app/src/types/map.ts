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

// Data service abstraction - replace this with your actual data source
export class MapDataService {
  static async getMapData(): Promise<MapData> {
    // This is dummy data - replace with your actual API call or database query
    return {
      center: {
        latitude: 57.6877,
        longitude: 11.9468,
      },
      zoom: 13,
      markers: [
        {
          id: "1",
          latitude: 57.6877,
          longitude: 11.9468,
          title: "Slottskogen Park Bench",
          description: "Trash bag and cleanup gloves ready for action",
          imageUrl: "/cleanup_1.png",
          imageAlt: "Cleanup gloves and trash bag on park bench",
        },
        {
          id: "2",
          latitude: 57.689,
          longitude: 11.945,
          title: "Slottskogen Cleanup Zone",
          description: "Another area needing environmental love",
          imageUrl: "/cleanup_2.png",
          imageAlt: "Trash cleanup supplies on park bench",
        },
        {
          id: "3",
          latitude: 57.686,
          longitude: 11.949,
          title: "Park Maintenance Area",
          description: "Equipment ready for making the park sparkle clean",
          imageUrl: "/cleanup_1.png",
          imageAlt: "Park cleanup equipment and supplies",
        },
      ],
    };
  }
}
