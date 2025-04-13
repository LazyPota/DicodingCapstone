import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import MonthPicker from "../../components/MonthPicker";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import { BarChart } from "@mui/x-charts/BarChart";
import { LinearProgress } from "@mui/material";
import CardWallet from "../../components/CardWallet";
import RecentTransactions from "../../components/RecentTransactions";

const DashboardView = ({
  financialHealthScore,
  financialHealthText,
  financialHealthEmoji,
  totalPemasukan,
  totalPengeluaran,
  walletToShow,
  savingsToShow,
  chartData,
  formatCurrency,
  isLoading,
  recentTransactions,
}) => {
  const getHealthColor = (score) => {
    if (score < 34) return "#ef4444";
    if (score < 90) return "#f97316";
    return "1FC16B";
  };
  const pathColor = getHealthColor(financialHealthScore);

  const getHealthTextColorClass = (score) => {
    if (score < 34) return "text-red-600";
    if (score < 90) return "text-orange-600";
    return "text-green-600";
  };
  const statusTextColorClass = getHealthTextColorClass(financialHealthScore);

  const getStatusRingkas = (score) => {
    if (isLoading && financialHealthScore === null) return "Memuat...";
    if (financialHealthScore === null) return "Tidak Diketahui";
    if (score < 34) return "Perlu Perhatian";
    if (score < 90) return "Cukup Baik";
    return "Sehat";
  };
  const statusRingkas = getStatusRingkas(financialHealthScore);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const cardWalletSize = isMobile ? "small" : "large";

  return (
    <div className=" bg-[#F3F4F7] p-5">
      <div className="">
        <MonthPicker />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[minmax(300px,_380px)_1fr_1.5fr] xl:grid-cols-[380px_1.5fr_2fr] gap-4 mb-4 mt-5">
        <div className="flex flex-col bg-white p-5 rounded-lg space-y-4 md:col-span-1 lg:col-span-1">
          <div className="flex justify-between items-center">
            <h3 className="text-[24px] font-bold">Dompet</h3>
            <a href="#" className="text-sm text-gray-500 hover:underline">
              Lihat Semua
            </a>
          </div>

          {walletToShow ? (
            <CardWallet
              amount={walletToShow.amount}
              name={walletToShow.wallet_name}
              type={walletToShow.wallet_type}
              size={cardWalletSize}
            />
          ) : (
            <div className="text-center text-gray-500 py-10">
              Belum ada dompet.
            </div>
          )}
        </div>

        {/* Total Pemasukan & Pengeluaran */}
        <div className="flex flex-col gap-3 md:col-span-1 lg:col-span-1">
          <div className="flex items-center justify-center bg-white p-3 h-[150px] rounded-[16px]">
            <div className="bg-[#2667FF] text-white w-[52px] h-[52px] flex justify-center items-center rounded-lg text-[32px]">
              <Icon icon="solar:arrow-left-down-linear" />
            </div>
            <div className="ml-3">
              <p className="text-[16px] text-[#6B6B6B]">Total Pemasukan</p>
              <h3 className="text-[24px] font-bold">
                {formatCurrency(totalPemasukan)}
              </h3>
            </div>
          </div>
          <div className="flex items-center justify-center bg-white text-white h-[150px]  p-3 rounded-[16px]">
            <div className="bg-[#112E73] text-white w-[52px] h-[52px] flex justify-center items-center rounded-lg text-[32px]">
              <Icon icon="solar:arrow-right-up-outline" />
            </div>
            <div className="ml-3">
              <p className="text-[16px] text-[#6B6B6B]">Total Pengeluaran</p>
              <h3 className="text-[24px] font-bold text-black">
                {formatCurrency(totalPengeluaran)}
              </h3>
            </div>
          </div>
        </div>

        {/* Kesehatan Keuangan */}
        <div className="flex flex-col justify-center items-center bg-white p-5 rounded-[16px] text-center md:col-span-2 lg:col-span-1">
          <h3 className="text-[24px] font-bold">Kesehatan Keuangan</h3>
          <div className="relative w-[210px] h-[115px] mx-auto my-4">
            <CircularProgressbar
              value={financialHealthScore}
              circleRatio={0.5}
              strokeWidth={10}
              styles={{
                root: {
                  transform: "rotate(0.75turn)",
                },
                path: {
                  stroke: pathColor,
                  strokeLinecap: "round",
                  transition: "stroke-dashoffset 0.5s ease 0s",
                },
                trail: {
                  stroke: "#e5e7eb",
                  strokeLinecap: "round",
                },
                text: {
                  fill: pathColor,
                  fontSize: "20px",
                  fontWeight: "bold",
                },
              }}
            />
            <div className="absolute left-1/2 top-20 transform -translate-x-1/2 -translate-y-1/2 text-[64px]">
              <Icon icon={financialHealthEmoji} />
            </div>
          </div>
          <p className="text-[16px] font-semibold text-[#2B2B2B]">
            {financialHealthText}
          </p>
          <p
            className={`text-sm lg:text-base font-extrabold mt-2 ${statusTextColorClass}`}
          >
            Status: {statusRingkas}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-2 lg:min-h-[307px]">
          <div className="bg-white rounded-[16px] p-[17px]">
            <h2 className="text-[22px] font-bold">Analitik</h2>
            <div className="w-full overflow-x-auto">
              <div style={{ minWidth: '600px' }}>
                {chartData && chartData.length > 0 ? (
                  <BarChart
                    dataset={chartData}
                    xAxis={[{ scaleType: "band", dataKey: "minggu", tickLabelStyle: { fontSize: 10 } }]}
                    series={[
                      { dataKey: "pemasukan", label: "Pemasukan", color: "#2667FF" },
                      { dataKey: "pengeluaran", label: "Pengeluaran", color: "#112E73" },
                    ]}
                    height={350}
                  />
                ) : (
                  <p className="text-center text-gray-500 py-10 h-[350px] flex items-center justify-center">
                    Data analitik belum tersedia untuk periode ini.
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="">
            <RecentTransactions
              transactions={recentTransactions}
              isLoading={isLoading}
            />
          </div>
        </div>
        <div className="lg:col-span-1 bg-white rounded-[16px] p-5">
          <div className="flex justify-between items-center">
            <h2 className="text-[20px] font-bold">Rencana Tabungan</h2>
            <a href="#" className="text-[14px] text-gray-500">
              Lihat semua
            </a>
          </div>
          <div className="mt-4 space-y-4">
            {savingsToShow.length === 0 && !isLoading ? (
              <p className="text-center text-gray-500 py-10">
                Belum ada rencana tabungan.
              </p>
            ) : (
              savingsToShow.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border p-4 rounded-[16px] flex items-center gap-4 shadow-sm"
                >
                  <div className="flex-col flex justify-center flex-1 h-[136px]">
                    <p className="font-semibold text-[16px]">{item.name}</p>
                    <div className="flex flex-row items-center justify-between mt-[18px]">
                      <p className="text-sm text-gray-500">
                        <span className="text-blue-600 font-semibold text-[18px]">
                          {formatCurrency(item.current)}
                        </span>{" "}
                        /{" "}
                        <span className="font-inter text-[12px]">
                          {formatCurrency(item.total)}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">{item.percent}%</p>
                    </div>
                    <LinearProgress
                      variant="determinate"
                      value={item.percent}
                      className="mt-2 !h-3 rounded-full"
                      sx={{
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#2563EB",
                        },
                        backgroundColor: "#BFDBFE",
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
