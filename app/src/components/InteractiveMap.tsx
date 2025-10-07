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
  const [L, setL] = useState<any>(null);

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

  // Create professional government-style icon
  const createProfessionalIcon = () => {
    return L.divIcon({
      html: `
        <div style="position: relative; width: 32px; height: 42px;">
          <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.163 0 0 7.163 0 16C0 28 16 42 16 42C16 42 32 28 32 16C32 7.163 24.837 0 16 0Z" fill="#1e40af"/>
            <path d="M16 0C7.163 0 0 7.163 0 16C0 28 16 42 16 42C16 42 32 28 32 16C32 7.163 24.837 0 16 0Z" fill="url(#gradient)" fill-opacity="0.2"/>
            <circle cx="16" cy="16" r="6" fill="white"/>
            <circle cx="16" cy="16" r="3" fill="#1e40af"/>
            <defs>
              <linearGradient id="gradient" x1="16" y1="0" x2="16" y2="42" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="white" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="black" stop-opacity="0.3"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      `,
      className: "professional-map-marker",
      iconSize: [32, 42],
      iconAnchor: [16, 42],
      popupAnchor: [0, -42],
    });
  };

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
            icon={createProfessionalIcon()}
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
            <Popup closeButton={true} autoClose={false} closeOnClick={false} className="professional-popup">
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-gray-200">
                  <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="font-semibold text-sm text-gray-900">
                    {marker.title}
                  </h3>
                </div>
                {marker.description && (
                  <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                    {marker.description}
                  </p>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    ID: {marker.id.toString().padStart(4, '0')}
                  </span>
                  <button 
                    onClick={() => onMarkerClick(marker)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
                  >
                    <span>View Details</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
