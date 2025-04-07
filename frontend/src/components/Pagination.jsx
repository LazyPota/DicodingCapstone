import React from "react";
const ArrowLeftIcon = () => (
  <svg
    className="w-4 h-4"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
      clipRule="evenodd"
    ></path>
  </svg>
);
const ArrowRightIcon = () => (
  <svg
    className="w-4 h-4"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    ></path>
  </svg>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const baseButtonClass =
    "flex items-center justify-center w-9 h-9 rounded border text-sm font-medium";
  const inactiveButtonClass =
    "bg-white border-gray-300 text-gray-500 hover:bg-gray-50";
  const activeButtonClass =
    "border-blue-500 text-blue-500 bg-white cursor-default";
  const activeArrowClass =
    "bg-white border-gray-300 text-gray-500 hover:bg-gray-50";
  const disabledArrowClass =
    "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed";
  const disabledNextArrowClass =
    "bg-white border-gray-300 text-gray-300 cursor-not-allowed";

  return (
    <div className="flex items-center mt-5 space-x-1">
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${baseButtonClass} ${
          currentPage === 1 ? disabledArrowClass : activeArrowClass
        }`}
        aria-label="Halaman Sebelumnya"
      >
        <ArrowLeftIcon />
      </button>
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          disabled={page === currentPage}
          className={`${baseButtonClass} ${
            page === currentPage ? activeButtonClass : inactiveButtonClass
          }`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${baseButtonClass} ${
          currentPage === totalPages ? disabledNextArrowClass : activeArrowClass
        }`}
        aria-label="Halaman Selanjutnya"
      >
        <ArrowRightIcon />
      </button>
    </div>
  );
};

export default Pagination;
