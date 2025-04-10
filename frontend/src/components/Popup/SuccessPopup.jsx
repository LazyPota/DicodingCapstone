import { XMarkIcon } from "@heroicons/react/16/solid";
import React from "react";

function SuccessPopup({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-lg sm:p-8"
        onClick={handleContentClick}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Tutup"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          Berhasil Ditambah
        </h2>
        <p className="mb-6 text-sm text-gray-600">
          Kartu Dompet berhasil ditambahkan di daftar dompet anda.
        </p>
        <button
          onClick={onClose} 
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Selesai
        </button>
      </div>
    </div>
  );
}

export default SuccessPopup;
