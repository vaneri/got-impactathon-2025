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
    <div className="min-h-screen">
      {/* Header */}
      <header className="rainbow-bg shadow-lg border-b-4 border-white sparkle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-2 animate-bounce">
            🌈 GeoTrash! ✨
          </h1>
          <p className="text-xl text-white drop-shadow-md leading-relaxed">
            🍭 Point the cam, click, and let GeoTrash do the dirty work—so you
            can spend more time picking up trash and less time hunting it down!
            🌍💚
          </p>
          <div className="mt-4 flex gap-2">
            <span className="text-2xl animate-pulse">🗑️</span>
            <span className="text-2xl animate-pulse">♻️</span>
            <span className="text-2xl animate-pulse">🌱</span>
            <span className="text-2xl animate-pulse">🌸</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Map Section */}
        <div className="ice-cream-bg rounded-3xl shadow-2xl p-8 mb-8 sparkle border-4 border-white">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            🗺️ Explore Sweet Cleanup Spots! 🍦 ({mapData.markers.length} magical
            markers)
          </h2>
          <div className="rounded-2xl overflow-hidden border-4 border-white shadow-xl">
            <InteractiveMap
              mapData={mapData}
              onMarkerClick={handleMarkerClick}
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="ice-cream-bg rounded-3xl shadow-2xl p-8 sparkle border-4 border-white">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            🌟 How to Make Magic Happen! ✨
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-pink-200 to-pink-300 rounded-2xl shadow-lg border-2 border-white transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-4 sparkle">
                <span className="text-white font-bold text-2xl">🎯</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2 text-xl">
                Click Markers
              </h4>
              <p className="text-gray-700">
                Click on any sparkly map marker to discover cleanup treasures!
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-200 to-teal-300 rounded-2xl shadow-lg border-2 border-white transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 sparkle">
                <span className="text-white font-bold text-2xl">📸</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2 text-xl">
                View Sweet Images
              </h4>
              <p className="text-gray-700">
                See delightful images and descriptions in our magical modal!
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-200 to-indigo-300 rounded-2xl shadow-lg border-2 border-white transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 sparkle">
                <span className="text-white font-bold text-2xl">🧭</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2 text-xl">
                Navigate Like a Pro
              </h4>
              <p className="text-gray-700">
                Zoom and pan the rainbow map to explore different cleanup zones!
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-2xl text-gray-800 font-semibold mb-4">
              🌍 Together we make the world sweeter, one cleanup at a time! 🍭
            </p>
            <div className="flex justify-center gap-4 text-3xl">
              <span className="animate-bounce">🌈</span>
              <span className="animate-pulse">💖</span>
              <span className="animate-bounce">🌟</span>
              <span className="animate-pulse">🌍</span>
              <span className="animate-bounce">✨</span>
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
