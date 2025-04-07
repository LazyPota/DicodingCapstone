import React from "react";

// --- Komponen Ikon (tidak berubah) ---
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

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageRangeDisplayed = 5,
  marginPagesDisplayed = 1,
}) => {
  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const getPaginationItems = () => {
    const items = [];
    let lastRendered = 0;

    const totalSlots = marginPagesDisplayed * 2 + pageRangeDisplayed + 2;

    if (totalPages <= totalSlots) {
      for (let i = 1; i <= totalPages; i++) {
        items.push({ type: "page", number: i });
      }
      return items;
    }

    const halfRange = Math.floor(pageRangeDisplayed / 2);
    let startPage = currentPage - halfRange;
    let endPage = currentPage + halfRange;

    if (pageRangeDisplayed % 2 === 0) {
      startPage = currentPage - (halfRange - 1);
    }
    if (startPage < 1) {
      endPage = Math.min(totalPages, endPage + (1 - startPage));
      startPage = 1;
    }
    if (endPage > totalPages) {
      startPage = Math.max(1, startPage - (endPage - totalPages));
      endPage = totalPages;
    }
    startPage = Math.max(1, startPage);
    endPage = Math.min(totalPages, endPage);
    const pagesToShow = new Set();
    for (let i = 1; i <= Math.min(marginPagesDisplayed, totalPages); i++) {
      pagesToShow.add(i);
    }
    for (let i = startPage; i <= endPage; i++) {
      pagesToShow.add(i);
    }
    for (
      let i = totalPages;
      i >= Math.max(1, totalPages - marginPagesDisplayed + 1);
      i--
    ) {
      pagesToShow.add(i);
    }
    const sortedPages = Array.from(pagesToShow).sort((a, b) => a - b);
    sortedPages.forEach((page) => {
      if (page > lastRendered + 1) {
        const ellipsisTargetPage = Math.floor((lastRendered + page) / 2);
        items.push({ type: "ellipsis", targetPage: ellipsisTargetPage });
      }
      items.push({ type: "page", number: page });
      lastRendered = page;
    });

    return items;
  };

  const paginationItems = getPaginationItems();
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
  const ellipsisClass =
    "flex items-center justify-center w-9 h-9 text-gray-500 cursor-pointer hover:bg-gray-100 rounded border border-gray-300";

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
      {paginationItems.map((item, index) => {
        if (item.type === "ellipsis") {
          return (
            <button
              key={`ellipsis-${index}`}
              onClick={() => handlePageClick(item.targetPage)}
              className={ellipsisClass}
              aria-label={`Lompat ke sekitar halaman ${item.targetPage}`}
            >
              ...
            </button>
          );
        } else {
          const page = item.number;
          return (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              disabled={page === currentPage}
              className={`${baseButtonClass} ${
                page === currentPage ? activeButtonClass : inactiveButtonClass
              }`}
              aria-current={page === currentPage ? "page" : undefined}
              aria-label={`Halaman ${page}`}
            >
              {page}
            </button>
          );
        }
      })}
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
