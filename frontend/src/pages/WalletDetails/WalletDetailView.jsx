import React from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import CardWallet from "../../components/CardWallet";
import RecentTransactions from "../../components/RecentTransactions";
import { Icon } from "@iconify/react/dist/iconify.js";
const WalletDetailView = ({
  wallet,
  onDelete,
  isDeleting,
  transactions,
  isLoadingTransactions,
}) => {
  const displayWalletType = (type) => {
    switch (type) {
      case "Cash":
        return "Tunai";
      case "Debit":
        return "Debit";
      case "Loan":
        return "Pinjaman";
      case "E-Money":
        return "Dompet Digital";
      case "Investment":
        return "Investasi";
      case "Other":
        return "Lainnya";
      default:
        return type;
    }
  };

  if (!wallet) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 bg-gray-50 p-7 text-center">
            Memuat data...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 bg-gray-50 p-7 overflow-auto">
          <h1 className="text-3xl font-bold">Dompet</h1>
          <p className="text-gray-600">Pantau rencana keuangan Anda</p>
          {/* Wallet Details */}
          <div className="grid grid-cols-[2fr_4fr] gap-6 mt-6">
            {/* Card Information */}
            <div className="bg-white p-5 rounded-lg ">
              <h2 className="text-xl font-bold mb-4">
                {displayWalletType(wallet.wallet_type)}
              </h2>
              <CardWallet
                size="small"
                amount={wallet.amount}
                name={wallet.wallet_name}
                type={displayWalletType(wallet.wallet_type)}
              />
              <div className="flex flex-col space-y-[20px] mt-5">
                <p className="font-bold font-inter text-[20px]">Card Wallet</p>
                <div className="flex flex-row space-x-7 items-center">
                  <div className="flex flex-col">
                    <p className="text-[16px] font-inter text-[#9F9F9F]">
                      Nama Kartu
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-[18px]">
                        <Icon icon="f7:rectangle-on-rectangle" />
                      </span>
                      <p className="font-bold text-[18px] font-inter">
                        {wallet.wallet_name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row space-x-9">
                  <div className="flex flex-col">
                    <p className="text-[16px] font-inter text-[#9F9F9F]">
                      Mata Uang
                    </p>
                    <p className="font-bold text-[18px] font-inter">
                      Rp / Rupiah
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[16px] font-inter text-[#9F9F9F]">
                      Status
                    </p>
                    <p className="font-bold text-[18px] font-inter text-[#1FC16B]">
                      Aktif
                    </p>
                  </div>
                </div>
                <button
                  className={`w-full bg-[#EA4335] text-white px-5 py-3 mt-4 rounded-[16px] flex justify-center items-center space-x-2 hover:bg-red-700 disabled:opacity-50 ${
                    isDeleting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={onDelete}
                  disabled={isDeleting}
                >
                  <span className="text-xl">
                    <Icon icon="radix-icons:trash" />
                  </span>
                  <span>Hapus Kartu</span>
                </button>
              </div>
            </div>

            {/* Recent Transactions */}
            <RecentTransactions
              title={`Histori Transaksi (${wallet.wallet_name})`} // Judul spesifik
              transactions={transactions} // Data terfilter dari props
              isLoading={isLoadingTransactions}
              showWalletColumn={false} // <-- Sembunyikan kolom dompet
              showSeeAllLink={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default WalletDetailView;
