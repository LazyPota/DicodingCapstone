import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

function DeleteConfirmationPopup({ isOpen, onClose, onConfirm }) {
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
        <h2 className="mb-2 text-lg font-bold text-gray-900">
          Apakah Anda yakin Menghapus?
        </h2>
        <p className="mb-8 text-sm text-gray-600">
          Kartu ini tidak akan muncul lagi daftar dompet anda
        </p>
        <div className="flex items-center justify-center space-x-4">
          <button
            type="button" 
            onClick={onClose} 
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 sm:w-auto"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm} 
            className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationPopup;