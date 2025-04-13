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
  currentItems,
  formatCurrencyShort,
  currentPage,
  totalPages,
  handlePageChange,
  openModal,
  isSuccessPopupOpen,
  closeSuccessPopup,
  isLoading,
  onDeleteGoal,
  targetTercapai,
  onEditGoal,
  chartData,
  totalTarget,
}) => {
  const safeCurrentItems = Array.isArray(currentItems) ? currentItems : [];

  const getProgressBarColor = (percentage) => {
    const cappedPercentage = Math.min(percentage, 100);
    if (cappedPercentage < 34) {
      return "bg-red-500";
    } else if (cappedPercentage < 67) {
      return "bg-orange-500";
    } else {
      return "bg-blue-500";
    }
  };
  const getPercentageTextColor = (percentage) => {
    const cappedPercentage = Math.min(percentage, 100);
    if (cappedPercentage < 34) {
      return "text-red-600";
    } else if (cappedPercentage < 67) {
      return "text-orange-600";
    } else {
      return "text-blue-600";
    }
  };

  return (
    <div className="flex-1 bg-[#F3F4F7] p-5 md:p-7 overflow-auto">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:justify-between md:items-center mb-5">
        <div className="flex space-x-4 items-center">
          <MonthPicker />
          <h1 className="font-extrabold text-[24px] text-[#121212]">
            Rencana Tabungan
          </h1>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-[16px] font-semibold flex flex-row items-center space-x-2 justify-center"
          onClick={openModal}
        >
          <Icon icon="ic:outline-plus" />
          Tambah Rencana
        </button>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="flex flex-col gap-5 h-full">
          <div className="bg-white p-5 rounded-[16px] flex items-center w-full h-full">
            <div className="bg-[#2667FF] text-white w-[52px] h-[52px] flex justify-center items-center rounded-lg text-[32px]">
              <Icon icon="ph:medal" />
            </div>
            <div className="ml-4">
              <p className="text-[16px] text-[#6B6B6B]">Target Tercapai</p>
              <h3 className="text-[24px] font-bold">
                {formatCurrencyShort(targetTercapai)}
              </h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-[16px] flex items-center w-full h-full">
            <div className="bg-[#112E73] text-white w-[52px] h-[52px] flex justify-center items-center rounded-lg text-[32px]">
              <Icon icon="mdi:target" />
            </div>
            <div className="ml-4">
              <p className="text-[16px] text-[#6B6B6B]">Target Bulan Ini</p>
              <h3 className="text-[24px] font-bold text-black">
                {formatCurrencyShort(totalTarget)}
              </h3>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-[16px] p-[17px] h-full">
          <h2 className="text-[22px] font-bold">Analitik</h2>
          <BarChart
            dataset={chartData}
            xAxis={[
              {
                scaleType: "band",
                dataKey: "name",
                tickLabelStyle: { fontSize: 10 },
              },
            ]}
            yAxis={[{ max: 100 }]}
            series={[
              {
                dataKey: "progress",
                label: "Persentase Tercapai",
                color: "#2563eb",
              },
            ]}
            height={300}
          />
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-[20px] font-semibold">Target Tiap Kategori</h2>
        {isLoading && safeCurrentItems.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">
            Memuat rencana tabungan...
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-2">
              {safeCurrentItems.length === 0 && !isLoading ? (
                <p className="col-span-full text-center text-gray-500">
                  Belum ada rencana tabungan.
                </p>
              ) : (
                safeCurrentItems.map((goal) => {
                  const current = goal.current_amount || 0;
                  const target = goal.target_amount || 1;
                  const percentage =
                    target > 0 ? Math.round((current / target) * 100) : 0;
                  const progressBarColorClass = getProgressBarColor(percentage);
                  const percentageTextColorClass =
                    getPercentageTextColor(percentage);

                  return (
                    <div
                      key={goal.id}
                      className="bg-white p-5 rounded-[16px] border border-[#E2E8F0] space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">{goal.goal_name}</h3>
                        <div className="flex space-x-2">
                          {/* Tombol Edit */}
                          <button
                            className={`text-blue-500 px-2 py-2 flex space-x-1 border border-blue-500 rounded-[16px] items-center text-xs hover:bg-blue-100 disabled:opacity-50 ${
                              isLoading ? "cursor-not-allowed" : ""
                            }`}
                            onClick={() => onEditGoal(goal)}
                            disabled={isLoading}
                          >
                            <Icon icon="ph:pencil-simple-line-fill" />
                          </button>
                          {/* Tombol Hapus */}
                          <button
                            className={`text-red-500 px-2 py-2 flex space-x-1 border border-red-500 rounded-[16px] items-center text-xs hover:bg-red-100 disabled:opacity-50 ${
                              isLoading ? "cursor-not-allowed" : ""
                            }`}
                            onClick={() => onDeleteGoal(goal.id)}
                            disabled={isLoading}
                          >
                            <Icon icon="ph:trash-simple" />
                          </button>
                        </div>
                      </div>
                      <div className="pt-3">
                        <p className="text-lg font-bold text-blue-500">
                          {formatCurrencyShort(current)} /{" "}
                          {formatCurrencyShort(target)}
                        </p>
                        <div className="relative w-full bg-gray-200 rounded-full h-3 mt-2">
                          <div
                            className={`h-3 rounded-full ${progressBarColorClass}`}
                            style={{
                              width: `${Math.min(100, percentage)}%`,
                            }}
                          ></div>
                          <span
                            className={`text-sm font-semibold ${percentageTextColorClass} absolute right-0 top-[-30px] text-blue-500 font-semibold`}
                          >
                            {percentage}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 text-right">
                          Sisa:{" "}
                          {formatCurrencyShort(Math.max(0, target - current))}
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
        <SuccessPopup isOpen={isSuccessPopupOpen} onClose={closeSuccessPopup} />
      </div>
    </div>
  );
};

export default GoalSavingView;
