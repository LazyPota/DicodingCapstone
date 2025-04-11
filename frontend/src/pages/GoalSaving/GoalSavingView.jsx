import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import MonthPicker from "../../components/MonthPicker";
import Modal from "../../components/Modal";
import Pagination from "../../components/Pagination";
import { Icon } from "@iconify/react";
import { BarChart } from "@mui/x-charts/BarChart";
import SuccessPopup from "../../components/Popup/SuccessPopup";

const GoalSavingView = ({
  isModalOpen,
  data,
  currentItems,
  formatCurrencyShort,
  currentPage,
  totalPages,
  handlePageChange,
  openModal,
  closeModal,
  handleFormSubmit,
  isSuccessPopupOpen,
  closeSuccessPopup,
  isLoading,
  onDeleteGoal,
}) => {
  const safeCurrentItems = Array.isArray(currentItems) ? currentItems : [];
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
              onClick={openModal}
            >
              <Icon icon="ic:outline-plus" />
              Tambah Rencana
            </button>
          </div>

          {isModalOpen && safeCurrentItems.length === 0 ? (
            <p className="text-center text-gray-500 mt-4">
              Memuat rencana tabungan...
            </p>
          ) : (
            <Modal
              isOpen={isModalOpen}
              onClose={closeModal}
              title="Tambah Rencana Tabungan"
              onSubmit={handleFormSubmit}
            >
              <div className="mb-3">
                <label
                  htmlFor="namaTabungan"
                  className="block text-sm font-medium"
                >
                  Nama Tabungan
                </label>
                <input
                  type="text"
                  className="w-full border p-2 rounded-md mt-2"
                  placeholder="Nama Tabungan"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="saldo" className="block text-sm font-medium">
                  Jumlah Target
                </label>
                <input
                  type="number"
                  id="saldo"
                  placeholder="Rp 0.00"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
            </Modal>
          )}

          {/* Statistik */}
          <div className="grid grid-cols-3 gap-5">
            <div className="flex flex-col gap-5 h-full">
              <div className="bg-white p-5 rounded-[16px] flex items-center w-full h-full">
                <div className="bg-[#2667FF] text-white w-[52px] h-[52px] flex justify-center items-center rounded-lg text-[32px]">
                  <Icon icon="ph:medal" />
                </div>
                <div className="ml-4">
                  <p className="text-[16px] text-[#6B6B6B]">Target Tercapai</p>
                  <h3 className="text-[24px] font-bold">Rp. 10jt</h3>
                </div>
              </div>
              <div className="bg-white p-5 rounded-[16px] flex items-center w-full h-full">
                <div className="bg-[#112E73] text-white w-[52px] h-[52px] flex justify-center items-center rounded-lg text-[32px]">
                  <Icon icon="mdi:target" />
                </div>
                <div className="ml-4">
                  <p className="text-[16px] text-[#6B6B6B]">Target Bulan Ini</p>
                  <h3 className="text-[24px] font-bold text-black">
                    Rp. 5.5jt
                  </h3>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-white rounded-[16px] p-[17px] h-full">
              <h2 className="text-[22px] font-bold">Analitik</h2>
              <BarChart
                dataset={data}
                xAxis={[{ scaleType: "band", dataKey: "minggu" }]}
                series={[
                  {
                    dataKey: "pemasukanBulanIni",
                    label: "Pemasukan Bulan Ini",
                    color: "#4F46E5",
                  },
                  {
                    dataKey: "pemasukanBulanLalu",
                    label: "Pemasukan Bulan Lalu",
                    color: "#1E3A8A",
                  },
                ]}
                width={570}
                height={300}
              />
            </div>
          </div>

          {/* Target Tiap Kategori */}
          <div className="mt-6">
            <h2 className="text-[20px] font-semibold">Target Tiap Kategori</h2>
            {/* Gunakan safeCurrentItems untuk pengecekan .length dan .map */}
            {isLoading && safeCurrentItems.length === 0 ? (
              <p className="text-center text-gray-500 mt-4">
                Memuat rencana tabungan...
              </p>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-4">
                  {safeCurrentItems.length === 0 && !isLoading ? (
                    <p className="col-span-full text-center text-gray-500">
                      Belum ada rencana tabungan.
                    </p>
                  ) : (
                    safeCurrentItems.map((goal) => {
                      // Gunakan safeCurrentItems
                      const current = goal.current_amount || 0;
                      const target = goal.target_amount || 1;
                      const percentage =
                        target > 0 ? Math.round((current / target) * 100) : 0;

                      return (
                        <div
                          key={goal.id}
                          className="bg-white p-5 rounded-[16px] border border-[#E2E8F0] space-y-1"
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold">{goal.goal_name}</h3>
                            <button
                              className={`text-red-500 px-2 py-1 flex space-x-2 border border-red-500 rounded-[16px] items-center hover:bg-red-100 disabled:opacity-50 ${
                                isLoading ? "cursor-not-allowed" : ""
                              }`}
                              onClick={() => onDeleteGoal(goal.id)}
                              disabled={isLoading}
                            >
                              <span className="text-base">
                                <Icon icon="ph:trash-simple" />
                              </span>
                              <span>Hapus</span>
                            </button>
                          </div>
                          <div className="pt-3">
                            <p className="text-lg font-bold text-blue-500">
                              {/* Format nilai dari backend */}
                              {formatCurrencyShort(current)} /{" "}
                              {formatCurrencyShort(target)}
                            </p>
                            <div className="relative w-full bg-gray-200 rounded-full h-3 mt-2">
                              <div
                                className="bg-blue-500 h-3 rounded-full"
                                style={{
                                  width: `${
                                    percentage > 100 ? 100 : percentage
                                  }%`,
                                }} // Batasi maks 100%
                              ></div>
                              <span className="absolute right-0 top-[-30px] text-blue-500 font-semibold">
                                {percentage}%
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1 text-right">
                              Sisa:{" "}
                              {formatCurrencyShort(
                                Math.max(0, target - current)
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                {totalPages > 1 && !isLoading && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
            <SuccessPopup
              isOpen={isSuccessPopupOpen}
              onClose={closeSuccessPopup}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalSavingView;
