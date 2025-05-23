import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { Icon } from "@iconify/react";
import SuccessPopup from "../../components/Popup/SuccessPopup";

const KategoriView = ({
  categories,
  filter,
  setFilter,
  isLoading,
  onAddClick,
  onEditClick,
  onDeleteClick,
  displayCategoryType,
}) => {
  return (
    <div className="flex-1 bg-[#F3F4F7] p-5 md:p-7 overflow-auto">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:justify-between md:items-center mb-5">
        <div className="flex space-x-4 items-center md:justify-normal justify-between">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-[16px] focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="Semua">Semua</option>
            <option value="Income">Pemasukan</option>
            <option value="Expense">Pengeluaran</option>
          </select>
          <h1 className="font-extrabold text-[24px] text-[#121212]">
            Kategori
          </h1>
        </div>
        <button
          onClick={onAddClick}
          disabled={isLoading}
          className="px-4 bg-blue-600 text-white rounded-[16px] font-semibold flex items-center space-x-2 hover:bg-blue-700 disabled:opacity-50 h-[40px] justify-center"
        >
          <Icon icon="ic:outline-plus" />
          <span>Tambah Kategori</span>
        </button>
      </div>
      <div className="overflow-x-auto bg-white mt-5">
        {isLoading && categories.length === 0 ? (
          <p className="text-center text-gray-500">Memuat kategori...</p>
        ) : (
          <table className="w-full border-collapse min-w-[600px]">
            <thead className="bg-[#DEE8FF]">
              {/* ... (Header Tabel tetap sama) ... */}
              <tr className="text-left text-[13px] text-[#2B2B2B] font-bold">
                <th className="py-3 px-4">No.</th>
                <th className="py-3 px-4">Nama Kategori</th>
                <th className="py-3 px-4">Tipe</th>
                <th className="py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-[14px] bg-white">
              {categories.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-gray-500">
                    Belum ada kategori.
                  </td>
                </tr>
              ) : (
                categories.map((category, index) => {
                  const isIncomeType = category.category_type === "Income";
                  const iconBg = isIncomeType ? "bg-[#2667FF]" : "bg-[#0A2E6D]";
                  const iconName = isIncomeType
                    ? "tabler:arrow-down-left"
                    : "tabler:arrow-up-right";

                  return (
                    <tr
                      key={category.id}
                      className="border-b border-gray-100 hover:bg-gray-50 align-middle"
                    >
                      <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                      <td className="py-3 px-4 text-gray-800">
                        {category.category_name}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-3 items-center">
                          <span
                            className={`${iconBg} text-white w-[37px] h-[37px] flex justify-center items-center rounded-full text-[21px] shrink-0`}
                          >
                            <Icon icon={iconName} />
                          </span>
                          <span className="text-gray-800">
                            {displayCategoryType(category.category_type)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2 text-[20px]">
                          <button
                            onClick={() => onDeleteClick(category.id)}
                            disabled={isLoading}
                            className="bg-red-500 hover:bg-red-700 text-white p-3 rounded-full transition-colors duration-150 disabled:opacity-50"
                            aria-label="Hapus"
                          >
                            <Icon icon="ic:outline-delete" />
                          </button>
                          <button
                            onClick={() => onEditClick(category)}
                            disabled={isLoading}
                            className="text-white bg-green-500 hover:bg-green-700 transition-colors duration-150 rounded-full p-3 disabled:opacity-50"
                            aria-label="Edit"
                          >
                            <Icon icon="ic:outline-edit" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default KategoriView;
