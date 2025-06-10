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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-hidden mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image */}
        <div className="relative">
          <Image
            src={marker.imageUrl}
            alt={marker.imageAlt || marker.title}
            width={800}
            height={600}
            className="w-full h-auto max-h-[70vh] object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {marker.title}
          </h3>
          {marker.description && (
            <p className="text-gray-700 text-lg">{marker.description}</p>
          )}
          <div className="mt-4 text-sm text-gray-500">
            <p>
              Coordinates: {marker.latitude.toFixed(4)},{" "}
              {marker.longitude.toFixed(4)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
