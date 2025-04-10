import React, { useState } from "react";
import MyWaletView from "./MyWaletView";

const MyWallet = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);

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
        handleFormSubmit={handleFormSubmit}
        closeSuccessPopup={closeSuccessPopup}
        isSuccessPopupOpen={isSuccessPopupOpen}
      />
    </div>
  );
};

export default MyWallet;
