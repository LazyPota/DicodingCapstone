import React, { useState } from "react";
import MyWaletView from "./MyWaletView";

const MyWallet = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <MyWaletView
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        openModal={openModal}
        closeModal={closeModal}
      />
    </div>
  );
};

export default MyWallet;
