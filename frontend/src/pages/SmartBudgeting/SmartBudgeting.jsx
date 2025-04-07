import React, { useMemo, useState } from "react";
import SmartBudgetingView from "./SmartBudgetingView";

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

const SmartBudgeting = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipeKartu, setTipeKartu] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = savingsGoals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(savingsGoals.length / itemsPerPage);

  const budgetSummary = useMemo(() => {
    const totalTarget = savingsGoals.reduce(
      (sum, goal) => sum + goal.target,
      0
    );
    const totalCurrent = savingsGoals.reduce(
      (sum, goal) => sum + goal.current,
      0
    );
    const sisa = totalTarget - totalCurrent;
    const percentage =
      totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;

    return {
      totalAnggaran: totalTarget,
      totalTercapai: totalCurrent,
      sisaAnggaran: sisa,
      persentase: percentage,
    };
  }, [savingsGoals]);

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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <SmartBudgetingView
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        openModal={openModal}
        closeModal={closeModal}
        tipeKartu={tipeKartu}
        setTipeKartu={setTipeKartu}
        setCurrentPage={setCurrentPage}
        currentItems={currentItems}
        totalPages={totalPages}
        formatCurrencyShort={formatCurrencyShort}
        savingsGoals={savingsGoals}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        totalAnggaran={budgetSummary.totalAnggaran}
        totalTercapai={budgetSummary.totalTercapai}
        sisaAnggaran={budgetSummary.sisaAnggaran}
        persentaseAnggaran={budgetSummary.persentase}
      />
    </div>
  );
};

export default SmartBudgeting;
