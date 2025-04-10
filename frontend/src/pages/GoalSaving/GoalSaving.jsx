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
    current: 20000000,
    target: 24000000,
  },
  {
    title: "Beli Rumah 3 Tingkat",
    current: 50000000,
    target: 200000000,
  },
  {
    title: "Beli HP 16 Promax",
    current: 15000000,
    target: 25000000,
  },
  {
    title: "Liburan ke Jogja",
    current: 4500000,
    target: 6000000,
  },
  {
    title: "Beli Motor CRF",
    current: 30000000,
    target: 40000000,
  },
  {
    title: "Investasi Saham",
    current: 10000000,
    target: 15000000,
  },
  {
    title: "Beli Motor CRF",
    current: 30000000,
    target: 40000000,
  },
  {
    title: "Investasi Saham",
    current: 10000000,
    target: 15000000,
  },
  {
    title: "Beli Motor CRF",
    current: 30000000,
    target: 40000000,
  },
  {
    title: "Investasi Saham",
    current: 10000000,
    target: 15000000,
  },
  {
    title: "Beli Motor CRF",
    current: 30000000,
    target: 40000000,
  },
  {
    title: "Investasi Saham",
    current: 10000000,
    target: 15000000,
  },
];

const GoalSaving = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = savingsGoals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(savingsGoals.length / itemsPerPage);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeSuccessPopup = () => {
    setIsSuccessPopupOpen(false);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      closeModal();
      setIsSuccessPopupOpen(true);
    } catch (error) {
      console.error("Submit failed:", error);
      alert("Gagal menambahkan data!");
    }
  };

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
      setIsModalOpen={setIsModalOpen}
      setCurrentPage={setCurrentPage}
      currentItems={currentItems}
      totalPages={totalPages}
      data={data}
      formatCurrencyShort={formatCurrencyShort}
      savingsGoals={savingsGoals}
      currentPage={currentPage}
      handlePageChange={handlePageChange}
      handleFormSubmit={handleFormSubmit}
      closeSuccessPopup={closeSuccessPopup}
      isSuccessPopupOpen={isSuccessPopupOpen}
      openModal={openModal}
      closeModal={closeModal}
    />
  );
};

export default GoalSaving;
