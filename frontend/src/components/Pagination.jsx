import React from "react";

const Pagination = ({ currentPage, totalPages, onNext, onPrev }) => {
  return (
    <div className="flex justify-center items-center mt-5 space-x-4">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-md font-semibold ${
          currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white"
        }`}
      >
        Sebelumnya
      </button>
      <span className="text-gray-700 font-medium">
        Halaman {currentPage} dari {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-md font-semibold ${
          currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white"
        }`}
      >
        Selanjutnya
      </button>
    </div>
  );
};

export default Pagination;
