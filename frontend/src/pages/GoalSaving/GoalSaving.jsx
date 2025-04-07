import React, { useState } from "react";
import GoalSavingView from "./GoalSavingView";

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
  {
    title: "Investasi Saham",
    monthlySaving: "Rp. 1jt/bulan",
    current: 10000000,
    target: 15000000,
  },
  {
    title: "Beli Motor CRF",
    monthlySaving: "Rp. 3jt/bulan",
    current: 30000000,
    target: 40000000,
  },
  {
    title: "Investasi Saham",
    monthlySaving: "Rp. 1jt/bulan",
    current: 10000000,
    target: 15000000,
  },
  {
    title: "Beli Motor CRF",
    monthlySaving: "Rp. 3jt/bulan",
    current: 30000000,
    target: 40000000,
  },
  {
    title: "Investasi Saham",
    monthlySaving: "Rp. 1jt/bulan",
    current: 10000000,
    target: 15000000,
  },
  {
    title: "Beli Motor CRF",
    monthlySaving: "Rp. 3jt/bulan",
    current: 30000000,
    target: 40000000,
  },
  {
    title: "Investasi Saham",
    monthlySaving: "Rp. 1jt/bulan",
    current: 10000000,
    target: 15000000,
  },
];

const GoalSaving = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = savingsGoals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(savingsGoals.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatCurrencyShort = (value) => {
    if (value >= 1000000000) {
      const num = value / 1000000000;
      const formattedNum = num.toLocaleString("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      });
      return `Rp. ${formattedNum} M`;
    } else if (value >= 1000000) {
      const num = value / 1000000;
      const formattedNum = num.toLocaleString("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      });
      return `Rp. ${formattedNum} jt`;
    } else {
      return `Rp. ${value.toLocaleString("id-ID")}`;
    }
  };

  return (
    <GoalSavingView
      isModalOpen={isModalOpen}
      selectedDate={selectedDate}
      setIsModalOpen={setIsModalOpen}
      setSelectedDate={setSelectedDate}
      selectedWallet={selectedWallet}
      setCurrentPage={setCurrentPage}
      setSelectedWallet={setSelectedWallet}
      currentItems={currentItems}
      totalPages={totalPages}
      data={data}
      formatCurrencyShort={formatCurrencyShort}
      savingsGoals={savingsGoals}
      currentPage={currentPage}
      handlePageChange={handlePageChange}
    />
  );
};

export default GoalSaving;
