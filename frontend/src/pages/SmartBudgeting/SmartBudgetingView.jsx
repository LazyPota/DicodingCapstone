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
    if (amount <= 0) return "bg-gray-300"; // Abu-abu jika target 0 atau kurang
    if (spent > amount) {
      return "bg-red-500"; // Merah jika overbudget
    }
    return "bg-blue-500"; // Biru jika belum overbudget
  };

  // Helper warna untuk teks persentase individu
  const getBudgetTextColor = (spent, amount) => {
    if (amount <= 0) return "text-gray-500";
    if (spent > amount) {
      return "text-red-600"; // Merah jika overbudget
    }
    return "text-blue-600"; // Biru jika belum overbudget
  };

  

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 bg-[#F3F4F7] p-7 overflow-auto">
          {/* ... Header section ... */}
          <div className="flex flex-row justify-between">
            <div className="flex space-x-4 items-center">
              <MonthPicker />
              <h1 className="font-extrabold text-[24px] text-[#121212]">
                Anggaran
              </h1>
            </div>
            <button
              className={`px-4 space-x-2 bg-blue-600 text-white rounded-[16px] font-semibold flex flex-row items-center hover:bg-blue-700 disabled:opacity-50 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={openModal}
              disabled={isLoading}
            >
              <Icon icon="ic:outline-plus" />
              <span>Tambah Anggaran</span>
            </button>
          </div>

          {/* ... Ringkasan ... */}
          <div className="bg-white p-6 rounded-lg mt-5">
            <h2 className="text-[22px] font-extrabold">
              Ringkasan total anggaran
            </h2>
            <p className="text-[18px] font-semibold mt-[16px]">Sisa</p>
            <p className="text-[50px] font-bold flex items-center mt-[16px]">
              {formatCurrencyShort(sisaAnggaran)}
              <span className="text-blue-500 text-[20px] ml-4">
                Dari total: {formatCurrencyShort(totalAnggaran)}
              </span>
            </p>
            {totalAnggaran > 0 && (
              <div className="relative w-full bg-gray-200 rounded-full h-3 mt-2">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: `${Math.min(100, persentaseTotal)}%` }}
                ></div>
                <span className="absolute right-0 top-[-30px] text-blue-500 font-semibold">
                {Math.min(100, persentaseTotal)}%
                </span>
              </div>
            )}
            <div className="flex items-center mt-[26px]">
              <FaMedal className="text-blue-500 text-[44px] mr-2" />
              <p className="font-semibold text-[20px]">
                Tercapai: {formatCurrencyShort(totalTerpakai)}
              </p>
            </div>
          </div>

          {/* Target tiap kategori */}
          <h2 className="mt-6 text-[20px] font-semibold">Anggaran</h2>
          {!isLoading && currentItems.length === 0 ? (
            <p className="text-center text-gray-500 mt-4">
              Belum ada anggaran yang dibuat.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {currentItems.map((budget) => {
                  const amount = budget.amount || 0; // Target budget
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
                        {/* --- TOMBOL EDIT --- */}
                        <button
                          className={`text-blue-500 px-2 py-1 flex space-x-2 border border-blue-500 rounded-[16px] items-center hover:bg-blue-100 disabled:opacity-50 ${
                            isLoading ? "cursor-not-allowed" : ""
                          }`}
                          onClick={() => onEditBudget(budget)} // <-- Panggil handler edit
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
                          Sisa:{" "}
                          {formatCurrencyShort(Math.max(0, amount - spent))}
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
      </div>
    </div>
  );
};

export default SmartBudgetingView;
