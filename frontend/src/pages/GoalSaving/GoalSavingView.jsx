import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import MonthPicker from "../../components/MonthPicker";
import Modal from "../../components/Modal";
import { Icon } from "@iconify/react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useState } from "react"; // Tambahkan useState

const data = [
    { minggu: "Minggu 1", pemasukanBulanIni: 20000, pemasukanBulanLalu: 15000 },
    { minggu: "Minggu 2", pemasukanBulanIni: 45000, pemasukanBulanLalu: 30000 },
    { minggu: "Minggu 3", pemasukanBulanIni: 15000, pemasukanBulanLalu: 10000 },
    { minggu: "Minggu 4", pemasukanBulanIni: 30000, pemasukanBulanLalu: 25000 },
];

const savingsGoals = [
  {
    title: "Umrah Sekeluarga",
    monthlySaving: "Rp. 2jt/bulan",
    current: 20000000,
    target: 24000000,
  },
  {
    title: "Beli Rumah 3 Tingkat",
    monthlySaving: "Rp. 5jt/bulan",
    current: 50000000,
    target: 200000000,
  },
  {
    title: "Beli HP 16 Promax",
    monthlySaving: "Rp. 1,5jt/bulan",
    current: 15000000,
    target: 25000000,
  },
  {
    title: "Liburan ke Jogja",
    monthlySaving: "Rp. 500rb/bulan",
    current: 4500000,
    target: 6000000,
  },
  {
    title: "Beli Motor CRF",
    monthlySaving: "Rp. 3jt/bulan",
    current: 30000000,
    target: 40000000,
  },
];

const GoalSavingView = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedWallet, setSelectedWallet] = useState("");

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
                Rencana Tabungan
              </h1>
            </div>
            <button 
              className="z-50 px-4 py-2 bg-blue-600 text-white rounded-[16px] font-semibold flex flex-row items-center space-x-2"
              onClick={() => {
                console.log("Modal opened");
                setIsModalOpen(true);
              }}
            >
              <Icon icon="ic:outline-plus" />
              Tambah Rencana
            </button>
          </div>

          {isModalOpen && (
            <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Tambah Rencana Tabungan"
          >
            <form>
              <div className="mb-3">
                <label className="block font-semibold">Nama Rencana</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded-md" 
                  placeholder="Contoh: Beli Laptop"
                />
              </div>
              <div className="mb-3">
                <label className="block font-semibold">Target Tabungan</label>
                <input 
                  type="number" 
                  className="w-full border p-2 rounded-md" 
                  placeholder="Masukkan target (Rp)"
                />
              </div>
              <div className="mb-3">
                <label className="block font-semibold">Tabungan Bulanan</label>
                <input 
                  type="number" 
                  className="w-full border p-2 rounded-md" 
                  placeholder="Masukkan jumlah (Rp)"
                />
              </div>
              {/* Tanggal */}
              <div className="mb-3">
                <label className="block font-semibold">Tanggal Target</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border p-2 rounded-md"
                />
              </div>

              {/* Dompet */}
              <div className="mb-3">
                <label className="block font-semibold">Pilih Dompet</label>
                <select
                  value={selectedWallet}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                  className="w-full border p-2 rounded-md"
                >
                  <option value="">Pilih Dompet</option>
                  <option value="Bank">Bank</option>
                  <option value="E-Wallet">E-Wallet</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              {/* Tombol dibuang dari sini, karena sudah ada di dalam Modal */}
            </form>
          </Modal>          
          )}

          {/* Bagian Statistik */}
          <div className="grid grid-cols-3 gap-5">
            {/* Wrapper untuk dua card di kiri */}
            <div className="flex flex-col gap-5 h-full">
              {/* Card Target Tercapai */}
              <div className="bg-white p-5 rounded-[16px] shadow-md flex items-center w-full h-full">
                <div className="bg-[#2667FF] text-white w-[52px] h-[52px] flex justify-center items-center rounded-lg text-[32px]">
                  <Icon icon="ph:medal" />
                </div>
                <div className="ml-4">
                  <p className="text-[16px] text-[#6B6B6B]">Target Tercapai</p>
                  <h3 className="text-[24px] font-bold">Rp. 10jt</h3>
                </div>
              </div>

              {/* Card Target Bulan Ini */}
              <div className="bg-white p-5 rounded-[16px] shadow-md flex items-center w-full h-full">
                <div className="bg-[#112E73] text-white w-[52px] h-[52px] flex justify-center items-center rounded-lg text-[32px]">
                  <Icon icon="mdi:target" />
                </div>
                <div className="ml-4">
                  <p className="text-[16px] text-[#6B6B6B]">Target Bulan Ini</p>
                  <h3 className="text-[24px] font-bold text-black">Rp. 5.5jt</h3>
                </div>
              </div>
            </div>

            {/* Card Analitik */}
            <div className="md:col-span-2 bg-white rounded-[16px] p-[17px] shadow-md h-full">
              <h2 className="text-[22px] font-bold">Analitik</h2>
              <BarChart
                dataset={data}
                xAxis={[{ scaleType: "band", dataKey: "minggu" }]}
                series={[
                    { dataKey: "pemasukanBulanIni", label: "Pemasukan Bulan Ini", color: "#4F46E5" },
                    { dataKey: "pemasukanBulanLalu", label: "Pemasukan Bulan Lalu", color: "#1E3A8A" },
                ]}
                width={600}
                height={300}
              />
            </div>
          </div>

          {/* Bagian Target Tiap Kategori */}
          <div className="mt-6">
            <h2 className="text-[20px] font-semibold">Target Tiap Kategori</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {savingsGoals.map((goal, index) => {
                const percentage = Math.round((goal.current / goal.target) * 100);
                return (
                  <div key={index} className="bg-white p-5 rounded-[16px] border border-[#E2E8F0] space-y-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{goal.title}</h3>
                      <button className="text-blue-500 px-2 py-1 flex space-x-2 border border-blue-500 rounded-[16px] items-center">
                        <span className="text-base">
                          <Icon icon="ph:pencil-simple-line" />
                        </span>
                        <span>Edit</span>
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">{goal.monthlySaving}</p>
                    <div className="pt-3">
                      <p className="text-lg font-bold text-blue-500">
                        Rp. {goal.current.toLocaleString()} / Rp. {goal.target.toLocaleString()}
                      </p>
                      <div className="relative w-full bg-gray-200 rounded-full h-3 mt-2">
                        <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${percentage}%` }}></div>
                        <span className="absolute right-0 top-[-30px] text-blue-500 font-semibold">
                          {percentage}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 text-right">
                        Sisa: Rp {(goal.target - goal.current).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default GoalSavingView;
