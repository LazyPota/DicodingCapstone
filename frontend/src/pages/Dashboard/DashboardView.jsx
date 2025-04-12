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
  financialHealthScore, // Skor 0-100
  financialHealthText, // Teks status (Sehat, Cukup, dll.)
  financialHealthEmoji, // Ikon emoji
  totalPemasukan,
  totalPengeluaran,
  walletToShow, // Objek wallet yg akan ditampilkan
  savingsToShow, // Array objek savings yg akan ditampilkan
  chartData, // Data untuk BarChart
  formatCurrency, // Fungsi format mata uang
  isLoading,
  error,
  recentTransactions,
}) => {
  const getHealthColor = (score) => {
    if (score < 34) return "#ef4444"; // Merah (Tailwind red-500)
    if (score < 67) return "#f97316"; // Oranye (Tailwind orange-500)
    return "#3b82f6"; // Biru (Tailwind blue-500)
    // Atau: return score >= 80 ? "#22c55e" : (score >= 50 ? "#f97316" : "#ef4444"); // Hijau-Oranye-Merah
  };
  const pathColor = getHealthColor(financialHealthScore);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 bg-[#F3F4F7] p-5 overflow-auto">
          <div className="p-1">
            <MonthPicker />
          </div>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              {error}
            </div>
          )}
          <div className="grid grid-cols-[380px_1.5fr_2fr] gap-3 h-[323px] p-2 bg-gray-100 rounded-[16px]">
            {/* Card Dompet */}
            <div className="flex flex-col justify-center bg-white p-4 w-[380px] rounded-lg">
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[24px] font-bold">Dompet</h3>
                <a href="#" className="text-sm text-gray-500 hover:underline">
                  Lihat Semua
                </a>
              </div>

              {walletToShow ? (
                <CardWallet
                  amount={walletToShow.amount}
                  name={walletToShow.wallet_name}
                  type={walletToShow.wallet_type} // Tipe asli dari backend
                  size="large" // Atau sesuaikan ukuran
                />
              ) : (
                <div className="text-center text-gray-500 py-10">
                  Belum ada dompet.
                </div>
              )}
            </div>

            {/* Total Pemasukan & Pengeluaran */}
            <div className="flex flex-col gap-3">
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
                  <p className="text-[16px] text-[#6B6B6B]">
                    Total Pengeluaran
                  </p>
                  <h3 className="text-[24px] font-bold text-black">
                    {formatCurrency(totalPengeluaran)}
                  </h3>
                </div>
              </div>
            </div>

            {/* Kesehatan Keuangan */}
            <div className="flex flex-col justify-center items-center bg-white p-5 rounded-[16px] text-center">
              <h3 className="text-[24px] font-bold">Kesehatan Keuangan</h3>
              <div className="relative w-[210px] h-[115px] mx-auto my-4">
                <CircularProgressbar
                  value={financialHealthScore}
                  text={`${financialHealthScore}%`}
                  circleRatio={0.5}
                  strokeWidth={10}
                  styles={{
                    root: {
                      transform: "rotate(0.75turn)",
                    },
                    path: {
                      stroke: pathColor, // <-- Gunakan warna dinamis di sini
                      strokeLinecap: 'round', // Opsional: ujung bulat
                      transition: 'stroke-dashoffset 0.5s ease 0s', // Animasi bawaan
                    },
                    trail: { // Ubah 'trailColor' menjadi 'trail' object
                      stroke: '#e5e7eb', // Warna sisa (abu-abu)
                      strokeLinecap: 'round',
                    },
                    text: { // Atur warna teks jika perlu
                      fill: pathColor, // Samakan warna teks dengan path
                      fontSize: '20px', // Sesuaikan ukuran font
                      fontWeight: 'bold',
                    },
                  }}
                />
                <div className="absolute left-1/2 top-20 transform -translate-x-1/2 -translate-y-1/2 text-[64px]">
                  <Icon icon={financialHealthEmoji} />
                </div>
              </div>
              <p className="text-[16px] font-medium text-[#2B2B2B]">
                {financialHealthText}
              </p>
              <p className="text-green-600 text-[16px] font-extrabold mt-[14px]">
                Status:{" "}
                {financialHealthScore >= 80
                  ? "Sehat"
                  : financialHealthScore >= 50
                  ? "Baik"
                  : "Perlu Perhatian"}
              </p>
            </div>
          </div>
          <div className="p-2 grid grid-cols-1 md:grid-cols-[265px,1.1fr,1fr] gap-4">
            {/* Kolom Kiri (Analitik & Transaksi Terbaru) */}
            <div className="md:col-span-2 grid grid-col gap-2 h-[357px]">
              <div className="bg-white rounded-[16px] p-[17px]">
                <h2 className="text-[22px] font-bold">Analitik</h2>
                <BarChart
                  dataset={chartData}
                  xAxis={[{ scaleType: "band", dataKey: "minggu" }]}
                  series={[
                    {
                      dataKey: "pemasukan",
                      label: "Pemasukan",
                      color: "#4F46E5",
                    },
                    {
                      dataKey: "pengeluaran",
                      label: "Pengeluaran",
                      color: "#1E3A8A",
                    },
                  ]}
                  width={600}
                  height={300}
                />
              </div>

              {/* Transaksi Terbaru */}
              <RecentTransactions transactions={recentTransactions} />
            </div>

            {/* Kolom Kanan (Rencana Tabungan) */}
            <div className="bg-white rounded-[16px] p-5">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-[20px] font-bold">Rencana Tabungan</h2>
                <a href="#" className="text-[14px] text-gray-500">
                  Lihat semua
                </a>
              </div>

              {/* List Tabungan */}
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
                      {/* Info Tabungan */}
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
                          {/* Persentase */}
                          <p className="text-sm text-gray-500">
                            {item.percent}%
                          </p>
                        </div>
                        {/* Progress */}
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
      </div>
    </div>
  );
};

export default DashboardView;
