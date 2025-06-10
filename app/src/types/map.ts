export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  imageUrl: string;
  imageAlt?: string;
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
          title: "Slottskogen Park",
          description: "Beautiful park in Gothenburg - main entrance",
          imageUrl:
            "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
          imageAlt: "Slottskogen Park entrance",
        },
        {
          id: "2",
          latitude: 57.689,
          longitude: 11.945,
          title: "Slottskogen Zoo Area",
          description: "Zoo area within Slottskogen",
          imageUrl:
            "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop",
          imageAlt: "Slottskogen Zoo area",
        },
        {
          id: "3",
          latitude: 57.686,
          longitude: 11.949,
          title: "Slottskogen Playground",
          description: "Popular playground area in the park",
          imageUrl:
            "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
          imageAlt: "Slottskogen playground area",
        },
      ],
    };
  }
}
