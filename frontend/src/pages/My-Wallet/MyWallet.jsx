import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getWallets,
  createWallet,
  resetWalletState,
} from "../../features/wallets/walletSlice";
import MyWaletView from "./MyWaletView";

const MyWallet = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("Semua");
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    wallet_name: "",
    wallet_type: "",
    amount: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { wallets, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.wallets
  );
  useEffect(() => {
    if (!user?.id) {
      console.log("User ID not found, cannot fetch wallets.");
      return;
    }
    dispatch(getWallets(user.id));
    dispatch(resetWalletState());
    return () => {
      dispatch(resetWalletState());
    };
  }, [dispatch, user?.id, navigate]);

  useEffect(() => {
    if (isSuccess && message.includes("berhasil ditambahkan")) {
      setIsModalOpen(false);
      setFormData({ wallet_name: "", wallet_type: "", amount: "" });
      setIsSuccessPopupOpen(true);
      dispatch(resetWalletState());
    }
    if (isError && message) {
      alert(`Error: ${message}`);
      dispatch(resetWalletState());
    }
  }, [isSuccess, isError, message, dispatch]);

  // Filtering di frontend
  const filteredWallets = React.useMemo(() => {
    const safeWallets = Array.isArray(wallets) ? wallets : [];
    if (filter === "Semua") return safeWallets;
    return safeWallets.filter((w) => w.wallet_type === filter);
  }, [wallets, filter]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeSuccessPopup = () => {
    setIsSuccessPopupOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "amount" ? parseFloat(value) || "" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    if (!formData.wallet_name || !formData.wallet_type || !formData.amount) {
      alert("Nama, Jenis, dan Saldo Dompet wajib diisi.");
      return;
    }

    const walletData = {
      wallet_name: formData.wallet_name,
      wallet_type: formData.wallet_type,
      amount: parseFloat(formData.amount),
    };

    console.log("Dispatching createWallet:", walletData);
    dispatch(resetWalletState());
    await dispatch(createWallet({ userId: user.id, walletData }));
  };

  return (
    <MyWaletView
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      closeModal={closeModal}
      wallets={filteredWallets}
      formData={formData}
      handleFormChange={handleFormChange}
      handleSubmit={handleSubmit}
      filter={filter}
      setFilter={setFilter}
      isSuccessPopupOpen={isSuccessPopupOpen}
      closeSuccessPopup={closeSuccessPopup}
      isLoading={isLoading}
    />
  );
};

export default MyWallet;
