import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { Link } from "react-router-dom";

const RecentTransactions = ({
  title = "Transaksi Terbaru", 
  transactions = [],
  isLoading = false,
  showWalletColumn = true, 
  showSeeAllLink = true,
}) => {
  const formatCurrency = (value) => {
    if (typeof value !== "number") return "Rp. -";
    return value.toLocaleString("id-ID"); 
  };

  const formatDate = (dateString) => {
    if (!dateString || !dateString.includes("-")) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-[16px] p-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-[24px] font-bold text-black">{title}</h2>
        {showSeeAllLink && transactions.length > 0 && (
          <Link
            to="/transaksi"
            className="text-xs lg:text-sm text-gray-600 hover:underline"
          >
            Lihat Semua
          </Link>
        )}
      </div>
      <div className="overflow-auto mt-4">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="text-left text-[12px] text-[#2B2B2B] tracking-wider border-b">
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
                const iconBg = isIncome ? "bg-[#2667FF]" : "bg-[#112E73]";
                const iconColor = isIncome ? "text-white" : "text-white";
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
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-5 text-black text-[14px] font-bold"
                  >
                    {/* Tampilkan Nama Dompet secara kondisional */}
                    {showWalletColumn && (
                      <td className="py-3 px-2 text-black truncate">
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
                    <td className="py-3 px-2 text-black whitespace-nowrap">
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
