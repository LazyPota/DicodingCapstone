import React from "react";
import SmartBudgeting from "./SmartBudgeting";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import MonthPicker from "../../components/MonthPicker";
import { Icon } from "@iconify/react/dist/iconify.js";
import { FaChevronDown, FaMedal } from "react-icons/fa";
import Modal from "../../components/Modal";

const SmartBudgetingView = ({
  isModalOpen,
  closeModal,
  openModal,
  tipeKartu,
  setTipeKartu,
}) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 bg-[#F3F4F7] p-7 overflow-auto">
          <div className="flex flex-row justify-between">
            <div className="flex space-x-4 items-center">
              <MonthPicker />
              <h1 className="font-extrabold text-[24px] text-[#121212]">
                Anggaran
              </h1>
            </div>
            <button
              className="px-4 space-x-2 bg-blue-600 text-white rounded-[16px] font-semibold flex flex-row items-center"
              onClick={openModal}
            >
              <Icon icon="ic:outline-plus" />
              <span>Tambah Rencana</span>
            </button>
          </div>
          <div className="bg-white p-6 h-[] rounded-lg mt-5">
            <h2 className="text-[22px] font-extrabold">
              Ringkasan total anggaran
            </h2>
            <p className="text-[18px] font-semibold mt-[16px]">Sisa</p>
            <p className="text-[50px] font-bold flex items-center mt-[16px]">
              Rp. 10.000.000{" "}
              <span className="text-blue-500 text-[20px] ml-4">
                Dari total: Rp 50.000.000
              </span>
            </p>
            <div className="relative w-full bg-gray-200 rounded-full h-3 mt-2">
              <div
                className="bg-blue-500 h-3 rounded-full"
                style={{ width: "90%" }}
              ></div>
              <span className="absolute right-0 top-[-30px] text-blue-500 font-semibold">
                90%
              </span>
            </div>
            <div className="flex items-center mt-[26px]">
              <FaMedal className="text-blue-500 text-[44px] mr-2" />
              <p className="font-semibold text-[20px]">
                Tercapai: Rp 40.000.000
              </p>
            </div>
          </div>
          <h2 className="mt-6 text-[20px] font-semibold">
            Target Tiap Kategori
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {[
              "Umrah Sekeluarga",
              "Beli Rumah 3 Tingkat",
              "Beli HP 16 Promax",
              "Liburan ke Jogja",
              "Beli Motor CRF",
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-5 h-[192px] rounded-[16px] border border-[#E2E8F0] space-y-1"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{item}</h3>
                  <button className="text-blue-500 px-2 py-1 flex space-x-2 border border-blue-500 rounded-[16px] items-center">
                    <span className="text-base">
                      <Icon icon="ph:pencil-simple-line" />
                    </span>
                    <span>Edit</span>
                  </button>
                </div>
                <p className="text-sm text-gray-500">Menabung Rp. 2jt/bulan</p>
                <div className="pt-3">
                  <p className="text-lg font-bold">Rp. 20jt / Rp. 24jt</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="relative w-full bg-gray-200 rounded-full h-3 mt-2">
                      <div
                        className="bg-blue-500 h-3 rounded-full"
                        style={{ width: "80%" }}
                      ></div>
                      <span className="absolute right-0 top-[-30px] text-blue-500 font-semibold">
                        90%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 text-right">
                    Sisa: Rp 4.000.000
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Tambah Rencana Anggaran"
      >
        <form className="flex flex-col space-y-[20px]">
          <div className="mb-2 relative">
            <select
              id="tipeKartu"
              value={tipeKartu}
              onChange={(e) => setTipeKartu(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 appearance-none pr-8 bg-white ${
                tipeKartu === "" ? "text-gray-400" : "text-gray-900"
              }`}
            >
              <option value="" disabled>
                Kategori
              </option>
              <option value="Debit">Freelance</option>
              <option value="Kredit">Makan</option>
              <option value="Prabayar">Gaji Perbulan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <FaChevronDown className="text-gray-500 h-4 w-4" />
            </div>
          </div>
          <div className="mb-2">
            <label htmlFor="saldo" className="block text-sm font-medium">
              Jumlah Anggaran
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

export default SmartBudgetingView;
