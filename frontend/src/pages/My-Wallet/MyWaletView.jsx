import React, { useState } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import CardWallet from "../../components/CardWallet";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const MyWaletView = ({
  selectedDate,
  setSelectedDate,
  openModal,
  closeModal,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [filter, setFilter] = useState("Semua");

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 bg-[#F3F4F7] p-7 overflow-auto">
          {/* Ganti Header Dompet & Deskripsi */}
          <div className="flex flex-row justify-between mb-5">
            <div className="flex space-x-4 items-center">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border rounded-[16px] focus:ring-2 focus:ring-blue-500"
              >
                <option value="Semua">Semua</option>
                <option value="Debit">Pemasukan</option>
                <option value="Tunai">Pengeluaran</option>
                <option value="Pinjaman">Pengeluaran</option>
                <option value="Pengeluaran">Pengeluaran</option>
                <option value="Dompet Digital">Pengeluaran</option>
              </select>
              <h1 className="font-extrabold text-[24px] text-[#121212]">Dompet</h1>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 bg-blue-600 text-white rounded-[16px] font-semibold flex items-center space-x-2"
            >
              <Icon icon="ic:outline-plus" />
              <span>Tambah Kartu</span>
            </button>
          </div>

          {/* Wallet Cards */}
          <div className="grid grid-cols-[1fr_1fr_1fr] h-[313px] gap-6 mt-6">
            {/* Card Tunai */}
            <div className="flex flex-col justify-center bg-white p-5 rounded-[16px] shadow-lg">
              <h2 className="text-[16px] font-inter font-bold mb-[20px] text-[#878787]">
                Kartu Tunai
              </h2>
              <CardWallet size="small" />
              <div className="mt-4 flex justify-end">
                <Button
                  as={Link}
                  to={"/dompet/detail"}
                  text="Rincian"
                  size="ms"
                  icon="basil:caret-right-solid"
                  variant="primary"
                />
              </div>
            </div>

            {/* Card Debit */}
            <div className="flex flex-col justify-center bg-white p-5 rounded-[16px] shadow-lg">
              <h2 className="text-[16px] font-inter font-bold mb-[20px] text-[#878787]">
                Kartu Debit
              </h2>
              <CardWallet size="small" />
              <div className="mt-4 flex justify-end">
                <Button
                  as={Link}
                  to={"/dompet/detail"}
                  text="Rincian"
                  size="ms"
                  icon="basil:caret-right-solid"
                  variant="primary"
                />
              </div>
            </div>

            {/* HAPUS CARD TAMBAH DOMPET */}
            {/* <div className="bg-white p-5 rounded-xl shadow-lg flex items-center justify-center">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-[16px]"
                onClick={openModal}
              >
                Tambah Kartu
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Tambah Kartu">
        <form className="flex flex-col space-y-[20px]">
          <div className="mb-2 relative border rounded-md focus-within:border-blue-500 flex items-center px-3 py-2">
            <FaCalendarAlt className="text-gray-500 mr-2" />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              className="w-full focus:outline-none"
              placeholderText="00/00/0000"
            />
          </div>
          <div className="mb-2">
            <input
              type="text"
              id="namaKartu"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Nama Kartu"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="jenisKartu" className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Kartu
            </label>
            <select
              id="jenisKartu"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              defaultValue=""
            >
              <option value="" disabled>Pilih Jenis Kartu</option>
              <option value="Tunai">Tunai</option>
              <option value="Debit">Debit</option>
              <option value="pinjaman">Pinjaman</option>
              <option value="Dompet Digital">Dompet Digital</option>
              <option value="Dompet Digital">Investasi</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div className="mb-2">
            <label htmlFor="saldo" className="block text-sm font-medium">
              Saldo
            </label>
            <input
              type="number"
              id="saldo"
              placeholder="Rp 0.00"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyWaletView;
