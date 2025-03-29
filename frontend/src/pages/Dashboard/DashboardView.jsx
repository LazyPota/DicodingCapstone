import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import MonthPicker from "../../components/MonthPicker";
import icon from "../../assets/whiteicon.png";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import { BarChart } from "@mui/x-charts/BarChart";
import { LinearProgress } from "@mui/material";
import { FaHome, FaMotorcycle, FaMobileAlt, FaKaaba } from "react-icons/fa";

const DashboardView = () => {
  const financialHealth = 30;
  const data = [
    { minggu: "Minggu - 1", pemasukan: 20000, pengeluaran: 30000 },
    { minggu: "Minggu - 2", pemasukan: 50000, pengeluaran: 35000 },
    { minggu: "Minggu - 3", pemasukan: 10000, pengeluaran: 50000 },
    { minggu: "Minggu - 4", pemasukan: 25000, pengeluaran: 40000 },
  ];

  const savings = [
    {
      name: "Umrah sekeluarga",
      current: 20,
      total: 24,
      icon: <FaKaaba />,
      percent: 30,
    },
    {
      name: "Beli Rumah 3 tingkat",
      current: 230,
      total: 1000,
      icon: <FaHome />,
      percent: 30,
    },
    {
      name: "Beli motor CRF",
      current: 25,
      total: 24,
      icon: <FaMotorcycle />,
      percent: 30,
    },
    {
      name: "Beli Hp 16 Promax",
      current: 22,
      total: 220,
      icon: <FaMobileAlt />,
      percent: 10,
    },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 bg-[#F3F4F7] p-5 overflow-auto">
          <div className="p-1">
            <MonthPicker />
          </div>
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

              {/* Kartu Saldo */}
              <div className="bg-gradient-to-br from-[#3973FF] to-[#224599] py-7 px-5 h-[231px] rounded-xl text-white shadow-lg relative">
                <div className="absolute top-3 right-3">
                  <img
                    src={icon}
                    alt="white-icon"
                    className="w-[26px] h-[26px]"
                  />
                </div>
                <p className="text-[20px] font-medium">Total Saldo</p>
                <h2 className="text-[35px] font-semibold">Rp. 320.200.000</h2>
                <div className="flex flex-row justify-between">
                  <div className="flex space-x-5 mt-[55px] text-sm">
                    <p>
                      <span className="text-[14px]">Jenis Dompet</span>
                      <br />
                      <b className="text-[18px]">Tunai</b>
                    </p>
                    <p>
                      <span className="text-[14px]">Dibuat</span>
                      <br />
                      <b className="text-[18px]">20/25</b>
                    </p>
                  </div>

                  {/* Dua Lingkaran di Pojok Kanan Bawah */}
                  <div className="absolute bottom-6 right-3 flex">
                    <div className="w-[30px] h-[30px] bg-[#0D2459] opacity-[50%] rounded-full"></div>
                    <div className="w-[30px] h-[30px] bg-[#0D2459] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Pemasukan & Pengeluaran */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-center bg-white p-3 h-[150px] rounded-[16px]">
                <div className="bg-[#2667FF] text-white w-[52px] h-[52px] flex justify-center items-center rounded-lg text-[32px]">
                  <Icon icon="solar:arrow-left-down-linear" />
                </div>
                <div className="ml-3">
                  <p className="text-[16px] text-[#6B6B6B]">Total Pemasukan</p>
                  <h3 className="text-[24px] font-bold">Rp. 10jt</h3>
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
                    Rp. 5.5jt
                  </h3>
                </div>
              </div>
            </div>

            {/* Kesehatan Keuangan */}
            <div className="flex flex-col justify-center items-center bg-white p-5 rounded-[16px] text-center">
              <h3 className="text-[24px] font-bold">Kesehatan Keuangan</h3>
              <div className="relative w-[210px] h-[115px] mx-auto my-4">
                <CircularProgressbar
                  value={financialHealth}
                  circleRatio={0.5}
                  strokeWidth={10}
                  styles={{
                    root: {
                      transform: "rotate(0.75turn)",
                    },
                    path: { stroke: "#1FC16B " },
                    trailColor: "grey",
                    backgroundColor: "red",
                  }}
                />
                <div className="absolute left-1/2 top-20 transform -translate-x-1/2 -translate-y-1/2 text-[64px]">
                  <Icon icon="twemoji:smiling-face-with-smiling-eyes" />
                </div>
              </div>
              <p className="text-[16px] font-medium text-[#2B2B2B]">
                Keuangan stabil dan terkendali.
              </p>
              <p className="text-green-600 text-[16px] font-extrabold mt-[14px]">
                Sehat
              </p>
            </div>
          </div>
          <div className="p-2 grid grid-cols-1 md:grid-cols-[265px,1.1fr,1fr] gap-4">
            {/* Kolom Kiri (Analitik & Transaksi Terbaru) */}
            <div className="md:col-span-2 grid grid-col gap-2">
              <div className="bg-white rounded-[16px] p-[17px]">
                <h2 className="text-[20px] font-bold">Analitik</h2>
                <BarChart
                  dataset={data}
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
              <div className="bg-white rounded-[16px] p-4">
                <h2 className="text-[20px] font-bold">Transaksi Terbaru</h2>
                <table className="w-full h-[191px] mt-4">
                  <thead>
                    <tr className="text-left text-[12px] text-[#2B2B2B]">
                      <th>Nama Dompet</th>
                      <th className="pb-2">Nama</th>
                      <th className="pb-2">Tanggal</th>
                      <th className="pb-2">Total</th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px]">
                    <tr>
                      <td>Shopee</td>
                      <td className="flex space-x-2 items-center">
                        <span className="bg-[#2667FF] text-white w-[37px] h-[37px] flex justify-center items-center rounded-full text-[21px]">
                          <Icon icon="solar:arrow-left-down-linear" />
                        </span>
                        <span>Gaji Perbulan</span>
                      </td>
                      <td>Sat, 20 Apr 2020</td>
                      <td className="text-green-500">Rp. 8jt</td>
                    </tr>
                    <tr>
                      <td>Shopee</td>
                      <td className="flex space-x-2 items-center">
                        <span className="bg-[#2667FF] text-white w-[37px] h-[37px] flex justify-center items-center rounded-full text-[21px]">
                          <Icon icon="solar:arrow-left-down-linear" />
                        </span>
                        <span>Gaji Perbulan</span>
                      </td>
                      <td>Sat, 20 Apr 2020</td>
                      <td className="text-green-500">Rp. 8jt</td>
                    </tr>
                    <tr>
                      <td>Shopee</td>
                      <td className="flex space-x-2 items-center">
                        <span className="bg-[#2667FF] text-white w-[37px] h-[37px] flex justify-center items-center rounded-full text-[21px]">
                          <Icon icon="solar:arrow-left-down-linear" />
                        </span>
                        <span>Gaji Perbulan</span>
                      </td>
                      <td>Sat, 20 Apr 2020</td>
                      <td className="text-green-500">Rp. 8jt</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Kolom Kanan (Rencana Tabungan) */}
            <div className="bg-white rounded-[16px] p-5">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-[20px] font-bold">Rencana Tabungan</h2>
                <a href="#" className="text-[14px] text-blue-500">
                  Lihat semua
                </a>
              </div>

              {/* List Tabungan */}
              <div className="mt-4 space-y-4">
                {savings.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border p-4 rounded-[16px] flex items-center gap-4 shadow-sm"
                  >
                    {/* Info Tabungan */}
                    <div className="flex-col flex justify-center flex-1 h-[136px]">
                      <div className="flex flex-row space-x-2">
                        <div className="text-2xl">{item.icon}</div>
                        <p className="font-semibold text-[16px]">{item.name}</p>
                      </div>
                      <div className="flex flex-row items-center justify-between mt-[18px]">
                        <p className="text-sm text-gray-500">
                          <span className="text-blue-600 font-semibold text-[18px]">
                            Rp. {item.current}jt
                          </span>{" "}
                          /{" "}
                          <span className="font-inter text-[12px]">
                            Rp. {item.total}jt
                          </span>
                        </p>
                        {/* Persentase */}
                        <p className="text-sm text-gray-500">{item.percent}%</p>
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
