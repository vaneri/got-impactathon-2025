"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapMarker, MapData } from "../types/map";

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface InteractiveMapProps {
  mapData: MapData;
  onMarkerClick: (marker: MapMarker) => void;
}

export default function InteractiveMap({
  mapData,
  onMarkerClick,
}: InteractiveMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render map on server side
  if (!isClient) {
    return (
      <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[mapData.center.latitude, mapData.center.longitude]}
        zoom={mapData.zoom}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mapData.markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.latitude, marker.longitude]}
            eventHandlers={{
              click: () => onMarkerClick(marker),
            }}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-1">{marker.title}</h3>
                {marker.description && (
                  <p className="text-sm text-gray-600 mb-2">
                    {marker.description}
                  </p>
                )}
                <button
                  onClick={() => onMarkerClick(marker)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  View Image
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
