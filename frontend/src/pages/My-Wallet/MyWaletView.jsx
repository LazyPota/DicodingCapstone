import React from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import CardWallet from "../../components/CardWallet";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import SuccessPopup from "../../components/Popup/SuccessPopup";

const MyWaletView = ({
  isModalOpen,
  setIsModalOpen,
  closeModal,
  wallets,
  formData,
  handleFormChange,
  handleSubmit,
  filter,
  setFilter,
  isSuccessPopupOpen,
  closeSuccessPopup,
  isLoading,
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

  return (
    <div className="flex-1 bg-[#F3F4F7] p-7 overflow-auto">
      <div className="flex flex-col space-y-3 md:flex-row justify-between items-center mb-5">
        <div className="flex space-x-4 items-center w-full md:justify-normal justify-between">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-[16px] focus:ring-2 focus:ring-blue-500 order-2 md:order-1"
            disabled={isLoading}
          >
            <option value="Semua">Semua</option>
            <option value="Debit">Debit</option>
            <option value="Cash">Tunai</option>
            <option value="Loan">Pinjaman</option>
            <option value="E-Money">Dompet Digital</option>
            <option value="Investment">Investasi</option>
            <option value="Other">Lainnya</option>
          </select>
          <h1 className="font-extrabold text-[24px] text-[#121212] order-1 md:order-2">
            Dompet
          </h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`py-3 md:py-2  bg-blue-600 text-white rounded-[16px] font-semibold flex items-center space-x-2 hover:bg-blue-700 disabled:opacity-50 w-full md:w-52 justify-center ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          <Icon icon="ic:outline-plus" />
          <span>Tambah Kartu</span>
        </button>
      </div>
      {isLoading && wallets.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">Memuat dompet...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {wallets.length === 0 && !isLoading ? (
            <p className="col-span-full text-center text-gray-500">
              Belum ada dompet.
            </p>
          ) : (
            wallets.map((wallet) => (
              <div
                key={wallet.id}
                className="flex flex-col justify-between bg-white p-5 rounded-[16px] shadow-lg min-h-[250px]"
              >
                <div>
                  <h2 className="text-[16px] font-inter font-bold mb-[20px] text-[#878787]">
                    Uang {displayWalletType(wallet.wallet_type)}
                  </h2>
                  <CardWallet
                    size="small"
                    amount={wallet.amount}
                    name={wallet.wallet_name}
                    type={wallet.wallet_type}
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    as={Link}
                    to={`/dompet/detail/${wallet.id}`}
                    text="Rincian"
                    size="ms"
                    icon="basil:caret-right-solid"
                    variant="primary"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Tambah Kartu"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Tambah"
      >
        <>
          <div className="mb-4">
            <label htmlFor="wallet_name" className="block text-sm font-medium">
              Nama Kartu
            </label>
            <input
              type="text"
              id="wallet_name"
              name="wallet_name"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 mt-2"
              placeholder="Nama Kartu"
              value={formData.wallet_name || ""}
              onChange={handleFormChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="wallet_type"
              className="block text-sm font-medium text-gray-700 mb-1"
            ></label>
            <select
              id="wallet_type"
              name="wallet_type"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 mt-2"
              value={formData.wallet_type || ""}
              onChange={handleFormChange}
              required
              disabled={isLoading}
            >
              <option value="" disabled>
                Pilih Jenis Kartu
              </option>
              <option value="Cash">Tunai</option>
              <option value="Debit">Debit</option>
              <option value="Loan">Pinjaman</option>
              <option value="E-Money">Dompet Digital</option>
              <option value="Investment">Investasi</option>
              <option value="Other">Lainnya</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium">
              Saldo Awal
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              placeholder="Rp 0.00"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 mt-2"
              value={formData.amount || ""}
              onChange={handleFormChange}
              required
              min="0"
              disabled={isLoading}
            />
          </div>
        </>
      </Modal>
      <SuccessPopup isOpen={isSuccessPopupOpen} onClose={closeSuccessPopup} />
    </div>
  );
};

export default MyWaletView;
