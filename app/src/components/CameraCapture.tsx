"use client";

import { useState, useRef, useCallback } from "react";
import { MapMarker } from "../types/map";

interface CameraCaptureProps {
  onNewMarker: (marker: MapMarker) => void;
  onClose: () => void;
}

export default function CameraCapture({
  onNewMarker,
  onClose,
}: CameraCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera if available
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera. Please check permissions.");
      setIsCapturing(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL("image/png");
        setCapturedImage(imageDataUrl);
        stopCamera();
        getCurrentLocation();
      }
    }
  }, [stopCamera]);

  const getCurrentLocation = useCallback(() => {
    setIsGettingLocation(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Could not get your location. Please check permissions.");
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const saveLocationReport = useCallback(() => {
    if (!capturedImage || !location) return;

    // Mock storage - replace with actual API call later
    const newMarker: MapMarker = {
      id: `report-${Date.now()}`,
      latitude: location.latitude,
      longitude: location.longitude,
      title: `Location Report #${Date.now().toString().slice(-6)}`,
      description: `Submitted by field operator on ${new Date().toLocaleString()}`,
      imageUrl: capturedImage, // In real app, this would be uploaded to server
      imageAlt: "Field documentation - geographic location",
    };

    // Add to map
    onNewMarker(newMarker);

    // Reset state
    setCapturedImage(null);
    setLocation(null);
    onClose();

    // Show success message
    alert(
      "Report submitted successfully. Your data has been recorded in the system."
    );
  }, [capturedImage, location, onNewMarker, onClose]);

  const handleCancel = useCallback(() => {
    stopCamera();
    setCapturedImage(null);
    setLocation(null);
    onClose();
  }, [stopCamera, onClose]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 m-4 max-w-md w-full shadow-2xl border border-gray-200">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Submit Location Report
            </h2>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!isCapturing && !capturedImage && (
          <div className="text-center">
            <p className="text-gray-600 mb-6 leading-relaxed">
              Capture visual documentation with geographic coordinates for official records and analysis.
            </p>
            <button
              onClick={startCamera}
              className="gov-btn-primary w-full mb-3 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
              <span>Activate Camera</span>
            </button>
            <button
              onClick={handleCancel}
              className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
            >
              Cancel Operation
            </button>
          </div>
        )}

        {isCapturing && (
          <div className="text-center">
            <div className="relative mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg border border-gray-300"
              />
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>RECORDING</span>
              </div>
            </div>
            <button
              onClick={capturePhoto}
              className="gov-btn-primary w-full mb-3 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
              <span>Capture Image</span>
            </button>
            <button
              onClick={handleCancel}
              className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
            >
              Cancel Operation
            </button>
          </div>
        )}

        {capturedImage && (
          <div>
            <div className="mb-4">
              <img
                src={capturedImage}
                alt="Captured location documentation"
                className="w-full rounded-lg border border-gray-300"
              />
            </div>

            {isGettingLocation && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="gov-spinner h-5 w-5"></div>
                  <span className="text-sm text-gray-700">Acquiring GPS coordinates...</span>
                </div>
              </div>
            )}

            {location && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-700">Location Acquired</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Latitude:</span>
                    <p className="font-mono text-gray-900">{location.latitude.toFixed(6)}°</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Longitude:</span>
                    <p className="font-mono text-gray-900">{location.longitude.toFixed(6)}°</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveLocationReport}
                disabled={!location}
                className={`flex-1 flex items-center justify-center space-x-2 ${
                  location
                    ? "gov-btn-primary"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed border-2 border-gray-400 rounded-md px-4 py-2"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Submit Report</span>
              </button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
