import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import MonthPicker from "../../components/MonthPicker";
import { Icon } from "@iconify/react/dist/iconify.js";
import { FaMedal } from "react-icons/fa";
import Pagination from "../../components/Pagination";

const SmartBudgetingView = ({
  isLoading,
  openModal,
  currentItems,
  formatCurrencyShort,
  currentPage,
  totalPages,
  handlePageChange,
  totalAnggaran,
  totalTerpakai,
  sisaAnggaran,
  persentaseTotal,
  onEditBudget,
}) => {
  const getBudgetProgressBarColor = (spent, amount) => {
    if (amount <= 0) return "bg-gray-300";
    if (spent > amount) {
      return "bg-red-500";
    }
    return "bg-blue-500";
  };

  const getBudgetTextColor = (spent, amount) => {
    if (amount <= 0) return "text-gray-500";
    if (spent > amount) {
      return "text-red-600";
    }
    return "text-blue-600";
  };

  return (
    <div className="flex-1 bg-[#F3F4F7] p-5 md:p-7 overflow-auto">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:justify-between md:items-center mb-5">
        <div className="flex space-x-4 items-center">
          <MonthPicker />
          <h1 className="font-extrabold text-xl md:text-[24px] text-[#121212]">
            Anggaran
          </h1>
        </div>
        <button
          className={`w-full md:w-auto py-2 px-4 space-x-2 bg-blue-600 text-white rounded-[16px] font-semibold flex flex-row items-center justify-center hover:bg-blue-700 disabled:opacity-50 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={openModal}
          disabled={isLoading}
        >
          <Icon icon="ic:outline-plus" />
          <span>Tambah Anggaran</span>
        </button>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-lg mt-5">
        <h2 className="text-lg md:text-[22px] font-extrabold">
          Ringkasan total anggaran
        </h2>
        <p className="text-base md:text-[18px] font-semibold mt-[16px]">Sisa</p>
        <div className="flex flex-wrap items-center mt-[16px] gap-x-2 md:gap-x-4">
          <p className="text-4xl md:text-[50px] font-bold">
            {formatCurrencyShort(sisaAnggaran)}
          </p>
          <span className="text-blue-500 text-sm md:text-[20px]">
            Dari total: {formatCurrencyShort(totalAnggaran)}
          </span>
        </div>
        {totalAnggaran > 0 && (
          <div className="relative w-full bg-gray-200 rounded-full h-2 md:h-3 mt-3 md:mt-5">
            <div
              className="bg-blue-500 h-2 md:h-3 rounded-full"
              style={{ width: `${Math.min(100, persentaseTotal)}%` }}
            ></div>
            <span className="absolute right-0 -top-6 md:top-[-30px] text-sm md:text-base text-blue-500 font-semibold">
              {Math.min(100, persentaseTotal)}%
            </span>
          </div>
        )}
        <div className="flex items-center mt-[20px] md:mt-[26px]">
          <FaMedal className="text-blue-500 text-2xl md:text-[44px] mr-2" />
          <p className="font-semibold text-base md:text-[20px]">
            Tercapai: {formatCurrencyShort(totalTerpakai)}
          </p>
        </div>
      </div>

      <h2 className="mt-6 text-[20px] font-semibold">Anggaran</h2>
      {!isLoading && currentItems.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">
          Belum ada anggaran yang dibuat.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {currentItems.map((budget) => {
              const amount = budget.amount || 0;
              const spent = budget.spent_amount || 0;
              const percentage =
                amount > 0 ? Math.round((spent / amount) * 100) : 0;
              const progressBarColorClass = getBudgetProgressBarColor(
                spent,
                amount
              );
              const percentageTextColorClass = getBudgetTextColor(
                spent,
                amount
              );

              return (
                <div
                  key={budget.id}
                  className="bg-white p-5 rounded-[16px] border border-[#E2E8F0] space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">
                      {budget.category?.category_name || "Kategori?"}
                    </h3>
                    <button
                      className={`text-blue-500 px-2 py-1 flex space-x-2 border border-blue-500 rounded-[16px] items-center hover:bg-blue-100 disabled:opacity-50 ${
                        isLoading ? "cursor-not-allowed" : ""
                      }`}
                      onClick={() => onEditBudget(budget)}
                      disabled={isLoading}
                    >
                      <span className="text-base">
                        <Icon icon="ph:pencil-line-fill" />
                      </span>
                      <span>Edit</span>
                    </button>
                    {/* --- AKHIR TOMBOL EDIT --- */}
                  </div>
                  {/* ... Sisa card ... */}
                  <div className="pt-3">
                    <p className="text-lg font-bold text-blue-500">
                      {formatCurrencyShort(spent)} /{" "}
                      {formatCurrencyShort(amount)}
                    </p>
                    <div className="relative w-full bg-gray-200 rounded-full h-3 mt-2">
                      <div
                        className={`h-3 rounded-full ${progressBarColorClass}`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      ></div>
                      <span
                        className={`text-sm font-semibold ${percentageTextColorClass}absolute right-0 top-[-30px] text-blue-500 font-semibold`}
                      >
                        {percentage}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 text-right">
                      Sisa: {formatCurrencyShort(Math.max(0, amount - spent))}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {/* ... Pagination ... */}
          {totalPages > 1 && !isLoading && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SmartBudgetingView;
