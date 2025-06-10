"use client";

import { useEffect, useState } from "react";
import InteractiveMap from "../components/InteractiveMap";
import ImageModal from "../components/ImageModal";
import { MapData, MapMarker, MapDataService } from "../types/map";

export default function Home() {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const data = await MapDataService.getMapData();
        setMapData(data);
      } catch (error) {
        console.error("Failed to load map data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMapData();
  }, []);

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMarker(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map data...</p>
        </div>
      </div>
    );
  }

  if (!mapData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load map data</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">GeoTrash!</h1>
          <p className="mt-2 text-gray-600">
            Point the cam, click, and let GeoTrash do the dirty work—so you can
            spend more time picking up trash and less time hunting it down.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Map Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Explore Locations ({mapData.markers.length} markers)
          </h2>
          <InteractiveMap mapData={mapData} onMarkerClick={handleMarkerClick} />
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            How to Use
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">1</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Click Markers</h4>
              <p className="text-sm text-gray-600">
                Click on any map marker to view more information
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">2</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">View Images</h4>
              <p className="text-sm text-gray-600">
                See detailed images and descriptions in the modal
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">3</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Navigate</h4>
              <p className="text-sm text-gray-600">
                Zoom and pan the map to explore different areas
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Image Modal */}
      <ImageModal
        marker={selectedMarker}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
