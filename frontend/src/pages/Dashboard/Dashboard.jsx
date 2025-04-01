import React from "react";
import DashboardView from "./DashboardView";
import { FaHome, FaMotorcycle, FaMobileAlt, FaKaaba } from "react-icons/fa";

const Dashboard = () => {
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
    <div>
      <DashboardView financialHealth={financialHealth} data={data} savings={savings} />
    </div>
  );
};

export default Dashboard;
