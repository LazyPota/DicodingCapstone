import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Modal from "../../components/Modal"; // Import Modal
import { Icon } from "@iconify/react";

const KategoriView = ({
  categories,
  filter,
  setFilter,
  isModalOpen,
  setIsModalOpen,
}) => {
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
              <h1 className="font-extrabold text-[24px] text-[#121212]">
                Kategori
              </h1>
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
          <table className="w-full border-collapse">
            <thead className="bg-[#DEE8FF]">
              <tr className="text-left text-[13px] text-[#2B2B2B] font-bold">
                <th className="py-3 px-4">No.</th>
                <th className="py-3 px-4">Nama Kategori</th>
                <th className="py-3 px-4">Tipe</th>
                <th className="py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-[14px] bg-white">
              {categories.map((category, index) => {
                const isIncomeType = category.type === "Pemasukan";
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
                    <td className="py-3 px-4 text-gray-800">{category.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-3 items-center">
                        <span
                          className={`${iconBg} text-white w-[37px] h-[37px] flex justify-center items-center rounded-full text-[21px] shrink-0`}
                        >
                          <Icon icon={iconName} />
                        </span>
                        <span className="text-gray-800">{category.type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2 text-[20px]">
                        <button className="bg-red-500 hover:bg-red-700 text-white p-3 rounded-full transition-colors duration-150">
                          <Icon icon="ic:outline-delete" />
                        </button>
                        <button className="text-white bg-green-500 hover:bg-green-700 transition-colors duration-150 rounded-full p-3">
                          <Icon icon="ic:outline-edit" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal untuk tambah kategori */}
        <div>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Tambah Kategori"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Nama Kategori
              </label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Masukkan nama kategori"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Tipe Kategori
              </label>
              <select className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="Pemasukan">Pemasukan</option>
                <option value="Pengeluaran">Pengeluaran</option>
              </select>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default KategoriView;
