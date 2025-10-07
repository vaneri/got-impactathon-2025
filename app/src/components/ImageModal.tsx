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
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto mx-4 z-[10000]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[10001] bg-gray-800 hover:bg-gray-900 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl transition-colors"
          aria-label="Close modal"
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
            className="w-full h-auto max-h-[60vh] object-cover"
            priority
          />
          <div className="absolute top-4 left-4 bg-primary text-white rounded px-3 py-1 text-sm font-semibold">
            Geographic Reference
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {marker.title}
            </h3>
            {marker.description && (
              <p className="text-gray-700 leading-relaxed">
                {marker.description}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="text-sm font-semibold text-gray-700">Latitude</span>
              </div>
              <p className="text-lg font-mono text-gray-900">{Number.isFinite(Number(marker.latitude)) ? Number(marker.latitude).toFixed(6) : 'N/A'}°</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="text-sm font-semibold text-gray-700">Longitude</span>
              </div>
              <p className="text-lg font-mono text-gray-900">{Number.isFinite(Number(marker.longitude)) ? Number(marker.longitude).toFixed(6) : 'N/A'}°</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-600">Recorded: {new Date().toLocaleString()}</span>
              </div>
              <span className="status-badge status-active">Verified</span>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Close
            </button>
            <button className="gov-btn-primary flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
