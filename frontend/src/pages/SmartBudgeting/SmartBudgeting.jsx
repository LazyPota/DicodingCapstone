import React, { useState } from "react";
import SmartBudgetingView from "./SmartBudgetingView";

const SmartBudgeting = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipeKartu, setTipeKartu] = useState("")

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
       />
    </div>
  );
};

export default SmartBudgeting;
