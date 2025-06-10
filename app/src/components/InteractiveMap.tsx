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
              <div className="text-center p-2">
                <h3 className="font-bold text-xl mb-2 text-gray-800 flex items-center justify-center gap-2">
                  <span className="text-lg">🌟</span>
                  {marker.title}
                  <span className="text-lg">✨</span>
                </h3>
                {marker.description && (
                  <p className="text-sm text-gray-600 mb-3">
                    🍭 {marker.description} 🌈
                  </p>
                )}
                <button
                  onClick={() => onMarkerClick(marker)}
                  className="lollipop-btn text-white px-4 py-2 rounded-full text-sm font-bold hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  ✨ View Sweet Image! 🍦
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
