import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import MonthPicker from "../../components/MonthPicker";
import { Icon } from "@iconify/react";

const ExpenseTrackerView = ({
  searchTerm,
  setSearchTerm,
  setIsModalOpen,
  transactionsToDisplay,
  isLoading,
}) => {
  return (
    <div className="flex-1 bg-[#F3F4F7] p-7 overflow-auto">
      <div className="flex justify-between mb-5">
        <div className="flex space-x-4 items-center">
          <MonthPicker />
          <h1 className="font-extrabold text-[24px] text-[#121212]">
            Histori Transaksi
          </h1>
        </div>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Cari transaksi..."
            className="px-3 py-2 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
          <button
            className={`px-4 space-x-2 bg-blue-600 text-white rounded-[16px] font-semibold flex items-center hover:bg-blue-700 disabled:opacity-50 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => setIsModalOpen(true)}
            disabled={isLoading}
          >
            <Icon icon="ic:outline-plus" />
            <span>Tambah Transaksi</span>
          </button>
        </div>
      </div>
      {isLoading && transactionsToDisplay.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">Memuat transaksi...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead className="bg-[#DEE8FF]">
            <tr className="text-left font-bold text-[13px] text-[#000]">
              <th className="py-3 px-4">No.</th>
              <th className="py-3 px-4">Nama Dompet</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">Tanggal</th>
              <th className="py-3 px-4">Total</th>
            </tr>
          </thead>
          <tbody className="text-[14px] bg-white">
            {transactionsToDisplay.length === 0 && !isLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  Tidak ada transaksi yang cocok.
                </td>
              </tr>
            ) : (
              transactionsToDisplay.map((transaction) => {
                const isIncome = transaction.transaction_type === "Income";
                const iconBg = isIncome ? "bg-[#2667FF]" : "bg-[#0A2E6D]";
                const iconName = isIncome
                  ? "tabler:arrow-down-left"
                  : "tabler:arrow-up-right";
                const amountColor = isIncome
                  ? "text-[#2ECC71]"
                  : "text-[#E74C3C]";
                const amountPrefix = isIncome ? "+Rp." : "-Rp.";
                const amount = transaction.amount || 0;
                const formattedAmount =
                  Math.abs(amount).toLocaleString("id-ID");

                return (
                  <tr
                    key={transaction.id}
                    className="border-b border-gray-100 hover:bg-gray-50 align-middle transition duration-100"
                  >
                    <td className="py-3 px-4 text-gray-600">
                      {transaction.no}
                    </td>
                    <td className="py-3 px-4 text-gray-800">
                      {transaction.wallet?.wallet_name || "-"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-3 items-center">
                        <span
                          className={`${iconBg} text-white w-[37px] h-[37px] flex justify-center items-center rounded-full text-[21px]`}
                        >
                          <Icon icon={iconName} />
                        </span>
                        <span className="text-gray-800">
                          {transaction.category?.category_name || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {transaction.transaction_date || "-"}
                    </td>
                    <td className={`py-3 px-4 font-semibold ${amountColor}`}>
                      {amountPrefix}
                      {formattedAmount}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExpenseTrackerView;
