import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import MonthPicker from "../../components/MonthPicker";
import { Icon } from "@iconify/react/dist/iconify.js";
import RecentTransactions from "../../components/RecentTransactions";
import AddTransactionForm from "../../components/AddTransactionForm";

const ExpenseTrackerView = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Tambahkan nomor urut dan filter berdasarkan search term
  const filteredTransactions = transactions
    .map((tx, index) => ({ ...tx, no: index + 1 }))
    .filter((tx) =>
      tx.wallet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.date.includes(searchTerm)
    );

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 bg-[#F3F4F7] p-7 overflow-auto">
          <div className="flex flex-row justify-between mb-5">
            <div className="flex space-x-4 items-center">
              <MonthPicker />
              <h1 className="font-extrabold text-[24px] text-[#121212]">
                Histori Transaksi
              </h1>
            </div>
            <div className="flex space-x-4">
              {/* Input Search */}
              <input
                type="text"
                placeholder="Cari transaksi..."
                className="px-3 py-2 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {/* Button Tambah Transaksi */}
              <button
                className="px-4 space-x-2 bg-blue-600 text-white rounded-[16px] font-semibold flex flex-row items-center"
                onClick={() => setIsModalOpen(true)}
              >
                <Icon icon="ic:outline-plus" />
                <span>Tambah Transaksi</span>
              </button>
            </div>
          </div>

          {/* Tabel Histori Transaksi */}
          <div className="bg-white rounded-[16px] p-4">
            <h2 className="text-[20px] font-bold">Transaksi Terbaru</h2>
            <table className="w-full mt-4 border-collapse">
              <thead>
                <tr className="text-left text-[12px] text-[#2B2B2B] border-b">
                  <th className="pb-2">No.</th>
                  <th className="pb-2">Nama Dompet</th>
                  <th className="pb-2">Kategori</th>
                  <th className="pb-2">Tanggal</th>
                  <th className="pb-2">Total</th>
                </tr>
              </thead>
              <tbody className="text-[14px]">
                {filteredTransactions.map((transaction, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{transaction.no}</td>
                    <td className="p-2">{transaction.wallet}</td>
                    <td className="p-2 flex space-x-2 items-center">
                      <span className="bg-[#2667FF] text-white w-[37px] h-[37px] flex justify-center items-center rounded-full text-[21px]">
                        <Icon icon="solar:arrow-left-down-linear" />
                      </span>
                      <span>{transaction.category}</span>
                    </td>
                    <td className="p-2">{transaction.date}</td>
                    <td className={`p-2 font-semibold ${transaction.amount < 0 ? "text-red-500" : "text-green-500"}`}>
                      {transaction.amount < 0
                        ? `- Rp${Math.abs(transaction.amount).toLocaleString("id-ID")}`
                        : `+ Rp${transaction.amount.toLocaleString("id-ID")}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Modal Form Tambah Transaksi */}
      <AddTransactionForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ExpenseTrackerView;