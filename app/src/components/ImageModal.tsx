"use client";

import { useEffect } from "react";
import Image from "next/image";
import { MapMarker } from "../types/map";

interface ImageModalProps {
  marker: MapMarker | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageModal({
  marker,
  isOpen,
  onClose,
}: ImageModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !marker) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-purple-900 to-pink-900 bg-opacity-75 transition-opacity backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative ice-cream-bg rounded-3xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden mx-4 border-4 border-white sparkle z-[10000]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-[10001] lollipop-btn w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl hover:scale-110 transition-all duration-300"
        >
          ✕
        </button>

        {/* Image */}
        <div className="relative">
          <Image
            src={marker.imageUrl}
            alt={marker.imageAlt || marker.title}
            width={800}
            height={600}
            className="w-full h-auto max-h-[70vh] object-cover rounded-t-2xl"
            priority
          />
          <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-full px-4 py-2 sparkle">
            <span className="text-2xl">🌟</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <h3 className="text-4xl font-bold text-gray-800 mb-4 flex items-center gap-3">
            <span className="text-3xl">📍</span>
            {marker.title}
            <span className="text-3xl">✨</span>
          </h3>
          {marker.description && (
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              🍭 {marker.description} 🌈
            </p>
          )}
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-4 border-2 border-white">
            <p className="text-lg text-gray-600 flex items-center gap-2">
              <span className="text-2xl">🧭</span>
              <strong>Sweet Coordinates:</strong> {marker.latitude.toFixed(4)},{" "}
              {marker.longitude.toFixed(4)}
              <span className="text-2xl">🗺️</span>
            </p>
          </div>
          <div className="mt-6 text-center">
            <p className="text-2xl">
              🌍 Let's make this spot sparkle clean! ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
