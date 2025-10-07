"use client";

import { useEffect, useState } from "react";
import InteractiveMap from "../components/InteractiveMap";
import ImageModal from "../components/ImageModal";
import CameraCapture from "../components/CameraCapture";
import { MapData, MapMarker, MapDataService } from "../types/map";

export default function Home() {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
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

  const handleNewMarker = (newMarker: MapMarker) => {
    if (mapData) {
      setMapData({
        ...mapData,
        markers: [...mapData.markers, newMarker],
      });
    }
  };

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="gov-spinner h-16 w-16 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading Geographic Information System...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we retrieve the data</p>
        </div>
      </div>
    );
  }

  if (!mapData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="gov-card p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">System Error</h3>
          <p className="text-gray-600 mb-6">Failed to load geographic data. Please check your connection and try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="gov-btn-primary"
          >
            Reload System
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="gov-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                <svg className="w-7 h-7 md:w-9 md:h-9 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-2xl lg:text-3xl font-bold mb-0.5 md:mb-1 truncate" style={{color: '#ffffff'}}>
                  Gothenburg FaultReport
                </h1>
                <p className="text-xs md:text-sm font-medium hidden sm:block" style={{color: '#bfdbfe'}}>
                  Fault Reporting - Streets, Squares & Parks
                </p>
                <div className="flex items-center space-x-2 mt-1 md:mt-2">
                  <div className="env-badge flex items-center space-x-1 px-2 md:px-3 py-0.5 md:py-1 rounded-full" style={{
                    backgroundColor: 'rgba(22, 163, 74, 0.9)',
                    border: '1px solid #4ade80'
                  }}>
                    <svg className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{color: '#dcfce7'}}>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                    </svg>
                    <span className="env-badge-text text-[10px] md:text-xs font-semibold whitespace-nowrap" style={{color: '#dcfce7'}}>Eco-Friendly</span>
            </div>
              </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs md:text-sm font-medium" style={{color: '#bfdbfe'}}>Platform</div>
              <div className="font-semibold text-sm md:text-lg" style={{color: '#ffffff'}}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Map Section */}
        <div className="gov-card p-4 md:p-6 mb-8 relative">
          <div className="mb-4 md:mb-6">
            <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Fault Reporting - Streets, Squares and Parks
              </h2>
            <p className="text-gray-600 text-xs md:text-sm lg:text-base leading-relaxed mb-3">
              Report holes in streets or bike paths, broken street lights, overgrown bushes, damaged benches, or any infrastructure issues. 
              Your report becomes an official public document and helps us maintain our community.
            </p>
            <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-3">
              <p className="text-xs md:text-sm text-red-800">
                <strong>Emergency?</strong> For urgent issues, call the City immediately at <a href="tel:031-36500000" className="font-bold underline">031-365 00 00</a>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="status-badge status-active text-[10px] md:text-xs">Live Data</span>
              <span className="text-xs md:text-sm text-gray-500">Updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm h-[400px] md:h-[500px] lg:h-[600px]">
            <InteractiveMap
              mapData={mapData}
              onMarkerClick={handleMarkerClick}
            />
          </div>
        </div>

        {/* Statistics Bar - Below Map */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          <div className="gov-card p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Total Locations</p>
                <p className="text-2xl md:text-3xl font-bold text-primary">{mapData.markers.length}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="gov-card p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Active Reports</p>
                <p className="text-2xl md:text-3xl font-bold text-success">{Math.floor(mapData.markers.length * 0.6)}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="gov-card p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl md:text-3xl font-bold text-warning">{Math.floor(mapData.markers.length * 0.3)}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="gov-card p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">System Status</p>
                <p className="text-base md:text-lg font-semibold text-success">Operational</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information - Public Documents */}
        <div className="gov-card p-4 md:p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
          <div className="flex flex-col md:flex-row md:items-start md:space-x-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mb-3 md:mb-0">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Your Report Becomes a Public Document</h3>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-3">
                When you submit a report, it is registered as an official public document. All citizens have the right to access and read public documents under Sweden's principle of public access to information (<em>offentlighetsprincipen</em>).
              </p>
              <div className="grid grid-cols-1 gap-3 mt-3">
                <div className="bg-white rounded-lg p-3 md:p-4 border border-blue-200">
                  <div className="flex items-start space-x-2 md:space-x-3">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Optional Contact Information</h4>
                      <p className="text-xs md:text-sm text-gray-600">You can choose to remain anonymous. However, without contact details, we cannot ask follow-up questions or update you on progress.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 md:p-4 border border-blue-200">
                  <div className="flex items-start space-x-2 md:space-x-3">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Data Protection</h4>
                      <p className="text-xs md:text-sm text-gray-600">We process your personal data in accordance with GDPR and Swedish law. Learn more about how we handle your information.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What You Can Report */}
        <div className="gov-card p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            What You Can Report
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 text-lg">
                Roads & Paths
              </h4>
              <p className="text-gray-600 text-sm">
                Holes in streets, damaged bike paths, broken sidewalks, or paving issues. Include exact address or coordinates.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 text-lg">
                Street Lighting
              </h4>
              <p className="text-gray-600 text-sm">
                Lights that are not working, flickering, or damaged. Provide location and light pole number if available.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 text-lg">
                Parks & Green Spaces
              </h4>
              <p className="text-gray-600 text-sm">
                Overgrown bushes that need cutting, damaged benches, broken playground equipment, or maintenance issues.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 text-lg">
                Public Spaces
              </h4>
              <p className="text-gray-600 text-sm">
                Issues in squares, public furniture damage, graffiti, or general maintenance needed in shared areas.
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-lg font-bold text-gray-900 mb-3">📝 How to Submit a Good Report</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold mt-0.5">1.</span>
                <p className="text-gray-700"><strong>Be Specific:</strong> Describe the fault in detail. Instead of "broken light," write "street light not working on Main Street between 5th and 6th Avenue."</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold mt-0.5">2.</span>
                <p className="text-gray-700"><strong>Provide Location:</strong> Include exact address (street name and number) or GPS coordinates so we can find and fix the issue quickly.</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold mt-0.5">3.</span>
                <p className="text-gray-700"><strong>Add Photos:</strong> Take clear photos showing the problem. Multiple angles help our teams understand the situation better.</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold mt-0.5">4.</span>
                <p className="text-gray-700"><strong>Include Contact Info:</strong> Optional but recommended. We can update you on progress and ask questions if needed.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-gray-600">Platform Version 1.0.0</p>
                <p className="text-xs text-gray-500">© 2025 Gothenburg CityReport. City of Gothenburg.</p>
                <div className="flex items-center space-x-3 mt-2">
                  <div className="flex items-center space-x-1 text-xs text-green-600">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                    </svg>
                    <span>Eco-Friendly Platform</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-blue-600">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    <span>Clean Environment Initiative</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>System Operational</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button - Bottom Left */}
        <button
          onClick={handleOpenCamera}
          className="fixed bottom-4 left-4 md:bottom-6 md:left-6 w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 shadow-2xl rounded-full flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group"
          style={{
            backgroundColor: '#1e40af',
            boxShadow: '0 10px 25px -5px rgba(30, 64, 175, 0.5), 0 8px 10px -6px rgba(30, 64, 175, 0.3)',
            zIndex: 9999
          }}
          title="Report Fault"
          aria-label="Report new fault or issue"
        >
          <svg className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-[9px] md:text-[10px] lg:text-xs text-white font-semibold uppercase tracking-wide">Report</span>
          
          {/* Pulse animation ring */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping group-hover:opacity-0"></span>
        </button>

      {/* Image Modal */}
      <ImageModal
        marker={selectedMarker}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Camera Capture */}
      {isCameraOpen && (
        <CameraCapture
          onNewMarker={handleNewMarker}
          onClose={handleCloseCamera}
        />
      )}
    </div>
  );
}
