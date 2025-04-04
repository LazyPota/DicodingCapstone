import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Modal from "../../components/Modal"; // Import Modal
import { Icon } from "@iconify/react";

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Komponen untuk menampilkan daftar kategori di halaman Kategori.
 * 
 * Komponen ini menerima 5 properti:
 * - `categories`: array yang berisi objek-objek kategori
 * - `filter`: string yang berisi tipe kategori yang ingin ditampilkan. Nilai default adalah "Semua"
 * - `setFilter`: fungsi yang digunakan untuk mengubah nilai `filter`
 * - `isModalOpen`: boolean yang menentukan apakah modal tambah kategori dibuka atau tidak
 * - `setIsModalOpen`: fungsi yang digunakan untuk mengubah nilai `isModalOpen`
 */

/******  4fa1008f-d361-4e9d-be92-e33961195781  *******/const KategoriView = ({ categories, filter, setFilter, isModalOpen, setIsModalOpen }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 bg-[#F3F4F7] p-7 overflow-auto">
          <div className="flex flex-row justify-between mb-5">
            <div className="flex space-x-4 items-center">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border rounded-[16px] focus:ring-2 focus:ring-blue-500"
              >
                <option value="Semua">Semua</option>
                <option value="Pemasukan">Pemasukan</option>
                <option value="Pengeluaran">Pengeluaran</option>
              </select>
              <h1 className="font-extrabold text-[24px] text-[#121212]">Kategori</h1>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 bg-blue-600 text-white rounded-[16px] font-semibold flex items-center space-x-2"
            >
              <Icon icon="ic:outline-plus" />
              <span>Tambah Kategori</span>
            </button>
          </div>

          {/* Tabel Kategori */}
          <div className="bg-white rounded-[16px] p-4">
            <table className="w-full mt-4 border-collapse">
              <thead>
                <tr className="text-left text-[12px] text-[#2B2B2B] border-b">
                  <th className="pb-2">No.</th>
                  <th className="pb-2">Nama Kategori</th>
                  <th className="pb-2">Tipe</th>
                  <th className="pb-2">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-[14px]">
                {categories.map((category, index) => (
                  <tr key={category.id} className="border-b">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{category.name}</td>
                    <td className="p-2">
                      <span
                        className={`px-3 py-1 rounded-full text-white ${
                          category.type === "Pemasukan" ? "bg-blue-500" : "bg-gray-800"
                        }`}
                      >
                        {category.type}
                      </span>
                    </td>
                    <td className="p-2 flex space-x-2">
                      <button className="text-green-500">
                        <Icon icon="ic:outline-edit" />
                      </button>
                      <button className="text-red-500">
                        <Icon icon="ic:outline-delete" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal untuk tambah kategori */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Kategori">
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nama Kategori</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Masukkan nama kategori"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Tipe Kategori</label>
              <select className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="Pemasukan">Pemasukan</option>
                <option value="Pengeluaran">Pengeluaran</option>
              </select>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default KategoriView;
