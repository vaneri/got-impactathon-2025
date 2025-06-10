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

  const saveTrashReport = useCallback(() => {
    if (!capturedImage || !location) return;

    // Mock storage - replace with actual API call later
    const newMarker: MapMarker = {
      id: `user-${Date.now()}`,
      latitude: location.latitude,
      longitude: location.longitude,
      title: `New Trash Spot 🤢`,
      description: `Reported by user at ${new Date().toLocaleString()}`,
      imageUrl: capturedImage, // In real app, this would be uploaded to server
      imageAlt: "User-reported trash location",
    };

    // Add to map
    onNewMarker(newMarker);

    // Reset state
    setCapturedImage(null);
    setLocation(null);
    onClose();

    // Show success message
    alert(
      "🌟 Trash location reported! Thanks for helping make the world sparkle! ✨"
    );
  }, [capturedImage, location, onNewMarker, onClose]);

  const handleCancel = useCallback(() => {
    stopCamera();
    setCapturedImage(null);
    setLocation(null);
    onClose();
  }, [stopCamera, onClose]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75">
      <div className="ice-cream-bg rounded-3xl p-6 m-4 max-w-md w-full border-4 border-white sparkle">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          📸 Report Trash Location! 🗑️
        </h2>

        {!isCapturing && !capturedImage && (
          <div className="text-center">
            <p className="text-gray-700 mb-6">
              🌟 Help make the world sparkle by reporting trash! We'll capture a
              photo and your location. ✨
            </p>
            <button
              onClick={startCamera}
              className="lollipop-btn text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-all duration-300 mb-3"
            >
              📷 Start Camera
            </button>
            <br />
            <button
              onClick={handleCancel}
              className="text-gray-600 underline hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        )}

        {isCapturing && (
          <div className="text-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-2xl mb-4 border-2 border-white"
            />
            <button
              onClick={capturePhoto}
              className="lollipop-btn text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-all duration-300 mb-3"
            >
              📸 Capture Photo
            </button>
            <br />
            <button
              onClick={handleCancel}
              className="text-gray-600 underline hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        )}

        {capturedImage && (
          <div className="text-center">
            <img
              src={capturedImage}
              alt="Captured trash"
              className="w-full rounded-2xl mb-4 border-2 border-white"
            />

            {isGettingLocation && (
              <div className="mb-4">
                <div className="animate-pulse text-lg">
                  📍 Getting your location...
                </div>
              </div>
            )}

            {location && (
              <div className="mb-4 p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl border-2 border-white">
                <p className="text-sm font-semibold text-gray-700">
                  📍 Location: {location.latitude.toFixed(4)},{" "}
                  {location.longitude.toFixed(4)}
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={saveTrashReport}
                disabled={!location}
                className={`px-4 py-2 rounded-full font-bold transition-all duration-300 ${
                  location
                    ? "lollipop-btn text-white hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                ✨ Report Trash! 🗑️
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-bold hover:bg-gray-300 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
