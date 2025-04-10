import React, { useState } from "react";
import KategoriView from "./KategoriView";

const Kategori = () => {
  const [filter, setFilter] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { id: 1, name: "Gajian", type: "Pemasukan" },
    { id: 2, name: "Bonus", type: "Pemasukan" },
    { id: 3, name: "Transportasi", type: "Pengeluaran" },
  ];

  const filteredCategories =
    filter === "Semua"
      ? categories
      : categories.filter((category) => category.type === filter);

  return (
    <KategoriView
      categories={filteredCategories}
      filter={filter}
      setFilter={setFilter}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  );
};

export default Kategori;
