"use client";

import { Translations } from "../locales/translations";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  translations: Translations;
}

export default function SuccessModal({
  isOpen,
  onClose,
  translations: t,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-lg p-6 m-4 max-w-md w-full shadow-2xl border border-gray-200 animate-slideIn">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
          {t.successModalTitle}
        </h2>

        {/* Message */}
        <p className="text-gray-700 text-center mb-3 leading-relaxed">
          {t.successModalMessage}
        </p>

        {/* Sub Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-blue-900 leading-relaxed">
              {t.successModalSubMessage}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="gov-btn-primary w-full flex items-center justify-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{t.successModalCloseButton}</span>
        </button>
      </div>
    </div>
  );
}

