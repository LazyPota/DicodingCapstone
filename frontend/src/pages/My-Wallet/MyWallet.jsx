import React, { useEffect, useState } from "react";
import MyWaletView from "./MyWaletView";
import api from "../../instance/api";

const MyWallet = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [walletName, setWalletName] = useState("");
  const [walletType, setWalletType] = useState("");
  const [amount, setAmount] = useState("");
  const [filter, setFilter] = useState("Semua");

  const user = JSON.parse(localStorage.getItem("user"));

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

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const res = await api.get(`capstone/user/${user.id}/wallets/`);
      setWallets(res.data.result || []);
    } catch (err) {
      console.error("Gagal ambil data wallet:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`capstone/user/${user.id}/wallets/`, {
        wallet_name: walletName,
        wallet_type: walletType,
        amount: parseFloat(amount),
      });
      fetchWallets();
      setIsModalOpen(false);
      setWalletName("");
      setWalletType("");
      setAmount("");
    } catch (err) {
      console.error("Gagal nambah dompet:", err);
    }
  };

  return (
    <div>
      <MyWaletView
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        closeModal={() => setIsModalOpen(false)}
        wallets={
          filter === "Semua"
            ? wallets
            : wallets.filter((w) => w.wallet_type === filter)
        }
        walletName={walletName}
        walletType={walletType}
        amount={amount}
        setWalletName={setWalletName}
        setWalletType={setWalletType}
        setAmount={setAmount}
        handleSubmit={handleSubmit}
        filter={filter}
        setFilter={setFilter}
        handleFormSubmit={handleFormSubmit}
        closeSuccessPopup={closeSuccessPopup}
        isSuccessPopupOpen={isSuccessPopupOpen}
      />
    </div>
  );
};

export default MyWallet;
