import React from "react";

const Modal = ({ isOpen, onClose, title, children, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        
        <form onSubmit={onSubmit}>
          {children}
          <div className="flex justify-center mt-4 space-x-[39px]">
            <button
              type="button"
              className="border-2 font-inter border-blue-600 text-black px-4 py-2 rounded-[16px] mr-2 w-full"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-3 rounded-[16px] w-full font-inter"
            >
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
