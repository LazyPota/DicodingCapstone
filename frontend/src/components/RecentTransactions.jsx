import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { Link } from "react-router-dom";

// Terima props transactions dan isLoading
const RecentTransactions = ({
  title = "Transaksi Terbaru", // Judul default
  transactions = [],
  isLoading = false,
  showWalletColumn = true, // Default tampilkan kolom dompet
  showSeeAllLink = true,
}) => {
  // Fungsi format mata uang (bisa juga diimpor dari utils)
  const formatCurrency = (value) => {
    if (typeof value !== "number") return "Rp. -";
    return value.toLocaleString("id-ID"); // Format standar tanpa Rp. di sini
  };

  // Fungsi format tanggal (opsional, bisa di-improve)
  const formatDate = (dateString) => {
    // Asumsi dateString format YYYY-MM-DD
    if (!dateString || !dateString.includes("-")) return "-";
    // Coba ubah ke format DD Mon YYYY
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-[16px] p-4 shadow">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        {/* Tampilkan link hanya jika diminta */}
        {showSeeAllLink && transactions.length > 0 && (
          <Link
            to="/transaksi"
            className="text-xs lg:text-sm text-blue-600 hover:underline"
          >
            Lihat Semua
          </Link>
        )}
      </div>
      <div className="overflow-x-auto mt-4">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="text-left text-[12px] text-gray-500 uppercase tracking-wider border-b">
              {showWalletColumn && (
                <th className="pb-2 px-2 font-semibold">Dompet</th>
              )}
              <th className="pb-2 px-2 font-semibold">Kategori</th>
              <th className="pb-2 px-2 font-semibold">Tanggal</th>
              <th className="pb-2 px-2 font-semibold text-right">Total</th>
            </tr>
          </thead>
          <tbody className="text-[14px] divide-y divide-gray-100">
            {/* Tampilkan Loading */}
            {isLoading && (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-400">
                  Memuat transaksi...
                </td>
              </tr>
            )}
            {/* Tampilkan Jika Kosong (setelah loading selesai) */}
            {!isLoading && transactions.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-500">
                  Belum ada transaksi terbaru.
                </td>
              </tr>
            )}
            {/* Tampilkan Data Transaksi */}
            {!isLoading &&
              transactions.map((transaction) => {
                const isIncome = transaction.transaction_type === "Income";
                // ... (logika ikon, warna, format) ...
                const iconBg = isIncome ? "bg-green-100" : "bg-red-100";
                const iconColor = isIncome ? "text-green-600" : "text-red-600";
                const iconName = isIncome
                  ? "solar:arrow-left-down-linear"
                  : "solar:arrow-right-up-outline";
                const amountColor = isIncome
                  ? "text-green-600"
                  : "text-red-600";
                const amountPrefix = isIncome ? "+Rp." : "-Rp.";
                const formattedAmount = formatCurrency(
                  Math.abs(transaction.amount || 0)
                );

                return (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    {/* Tampilkan Nama Dompet secara kondisional */}
                    {showWalletColumn && (
                      <td className="py-3 px-2 text-gray-700 truncate">
                        {transaction.wallet?.wallet_name || "-"}
                      </td>
                    )}
                    {/* Kategori */}
                    <td className="py-3 px-2">
                      <div className="flex space-x-2 items-center">
                        <span
                          className={`${iconBg} ${iconColor} w-8 h-8 flex justify-center items-center rounded-full text-lg shrink-0`}
                        >
                          <Icon icon={iconName} />
                        </span>
                        <span className="text-gray-800 truncate">
                          {transaction.category?.category_name || "-"}
                        </span>
                      </div>
                    </td>
                    {/* Tanggal */}
                    <td className="py-3 px-2 text-gray-600 whitespace-nowrap">
                      {formatDate(transaction.transaction_date)}
                    </td>
                    {/* Jumlah */}
                    <td
                      className={`py-3 px-2 font-semibold ${amountColor} text-right whitespace-nowrap`}
                    >
                      {amountPrefix}
                      {formattedAmount}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
