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
  const [L, setL] = useState<typeof import("leaflet") | null>(null);

  // Validate and sanitize map center coordinates
  const safeCenter = {
    latitude: isNaN(mapData.center.latitude)
      ? 40.7128
      : mapData.center.latitude,
    longitude: isNaN(mapData.center.longitude)
      ? -74.006
      : mapData.center.longitude,
  };

  const safeZoom = isNaN(mapData.zoom) ? 12 : mapData.zoom;

  console.log("InteractiveMap received:", {
    originalCenter: mapData.center,
    safeCenter,
    originalZoom: mapData.zoom,
    safeZoom,
    markersCount: mapData.markers.length,
  });

  useEffect(() => {
    setIsClient(true);
    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  // Don't render map on server side
  if (!isClient || !L) {
    return (
      <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
  }

  // Create custom emoji icon
  const createEmojiIcon = (marker: MapMarker) => {
    // Determine if this is a grouped marker or individual marker
    const isGrouped =
      marker.title.includes("reports at this location") ||
      marker.title.includes("/");
    const isMultiple = marker.title.includes("(") && marker.title.includes("/");

    let iconHtml = "";
    let iconSize: [number, number] = [40, 40];

    if (isGrouped && !isMultiple) {
      // This is a main grouped marker representing multiple images
      iconHtml =
        '<div style="font-size: 28px; text-align: center; line-height: 1; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5)); background: rgba(255,255,255,0.9); border-radius: 50%; padding: 6px; border: 2px solid #e74c3c;">🗑️📊</div>';
      iconSize = [50, 50];
    } else if (isMultiple) {
      // This is one of the offset individual markers
      const markerNumber = marker.title.match(/\((\d+)\/\d+\)/)?.[1] || "1";
      iconHtml = `<div style="font-size: 24px; text-align: center; line-height: 1; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5)); background: rgba(255,255,255,0.8); border-radius: 50%; padding: 4px; border: 1px solid #3498db; position: relative;">
        🤢
        <div style="position: absolute; top: -8px; right: -8px; background: #3498db; color: white; border-radius: 50%; width: 18px; height: 18px; font-size: 12px; display: flex; align-items: center; justify-content: center; font-weight: bold;">${markerNumber}</div>
      </div>`;
      iconSize = [44, 44];
    } else {
      // Regular single marker
      iconHtml =
        '<div style="font-size: 32px; text-align: center; line-height: 1; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));">🤢</div>';
    }

    return L.divIcon({
      html: iconHtml,
      className: "custom-emoji-icon",
      iconSize: iconSize,
      iconAnchor: [iconSize[0] / 2, iconSize[1]],
      popupAnchor: [0, -iconSize[1]],
    });
  };

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[safeCenter.latitude, safeCenter.longitude]}
        zoom={safeZoom}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mapData.markers
          .filter(
            (marker) => !isNaN(marker.latitude) && !isNaN(marker.longitude)
          )
          .map((marker) => (
            <Marker
              key={marker.id}
              position={[marker.latitude, marker.longitude]}
              icon={createEmojiIcon(marker)}
              eventHandlers={{
                click: () => onMarkerClick(marker),
                mouseover: (e) => {
                  e.target.openPopup();
                },
                mouseout: (e) => {
                  e.target.closePopup();
                },
              }}
            >
              <Popup closeButton={false} autoClose={false} closeOnClick={false}>
                <div className="text-center p-2">
                  <h3 className="font-bold text-xl mb-2 text-gray-800 flex items-center justify-center gap-2">
                    {marker.title.includes("reports at this location") ? (
                      <>
                        <span className="text-lg">🗑️</span>
                        {marker.title}
                        <span className="text-lg">📊</span>
                      </>
                    ) : marker.title.includes("/") ? (
                      <>
                        <span className="text-lg">🤢</span>
                        {marker.title}
                        <span className="text-lg">✨</span>
                      </>
                    ) : (
                      <>
                        <span className="text-lg">🤢</span>
                        {marker.title}
                        <span className="text-lg">✨</span>
                      </>
                    )}
                  </h3>
                  {marker.description && (
                    <p className="text-sm text-gray-600 mb-3">
                      🍭 {marker.description} 🌈
                    </p>
                  )}
                  <p className="text-xs text-gray-500 italic">
                    {marker.title.includes("reports at this location")
                      ? "Click to view all images at this location! 📸📸"
                      : "Click marker to view image! 📸"}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
