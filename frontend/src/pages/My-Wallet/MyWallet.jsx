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
  const [formData, setFormData] = useState({
    wallet_name: "",
    wallet_type: "",
    amount: "",
  });
  const [errors, setErrors] = useState({});

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
    if (
      isSuccess &&
      message &&
      (message.includes("berhasil ditambahkan") ||
        message.includes("created successfully"))
    ) {
      console.log(
        "Wallet creation successful, closing modal and resetting form."
      );
      setIsModalOpen(false);
      setFormData({ wallet_name: "", wallet_type: "", amount: "" });
      setErrors({});
    }
    if (isError && message) {
      setErrors((prev) => ({ ...prev, server: message }));
    }
  }, [isSuccess, isError, message, dispatch]);

  const filteredWallets = React.useMemo(() => {
    const safeWallets = Array.isArray(wallets) ? wallets : [];
    if (filter === "Semua") return safeWallets;
    return safeWallets.filter((w) => w.wallet_type === filter);
  }, [wallets, filter]);

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ wallet_name: "", wallet_type: "", amount: "" });
    setErrors({});
    if (isError) dispatch(resetWalletState());
  };

  const validateForm = () => {
    let formIsValid = true;
    let newErrors = {};

    if (!formData.wallet_name.trim()) {
      formIsValid = false;
      newErrors.wallet_name = "Nama dompet wajib diisi.";
    }
    if (!formData.wallet_type) {
      formIsValid = false;
      newErrors.wallet_type = "Jenis dompet wajib dipilih.";
    }
    if (
      formData.amount === "" ||
      formData.amount === null ||
      isNaN(formData.amount)
    ) {
      formIsValid = false;
      newErrors.amount = "Saldo awal wajib diisi dan harus berupa angka.";
    } else if (parseFloat(formData.amount) < 0) {
      formIsValid = false;
      newErrors.amount = "Saldo awal tidak boleh negatif.";
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount") {
      const numericValue = value
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*)\./g, "$1");
      const floatValue = parseFloat(numericValue);
      setFormData((prevState) => ({
        ...prevState,
        [name]:
          isNaN(floatValue) && numericValue !== ""
            ? numericValue
            : isNaN(floatValue)
            ? ""
            : floatValue,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
    if (errors.server) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        server: null,
      }));
      if (isError) dispatch(resetWalletState());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      console.error("Tidak bisa submit, User ID tidak ada.");
      setErrors({ server: "User tidak dikenali. Silakan login ulang." });
      return;
    }

    if (!validateForm()) {
      console.log("Form tambah dompet tidak valid (client-side)");
      return;
    }

    const walletData = {
      wallet_name: formData.wallet_name,
      wallet_type: formData.wallet_type,
      amount: parseFloat(formData.amount),
    };

    const amountValue = parseFloat(formData.amount);
    if (isNaN(amountValue)) {
      setErrors((prev) => ({ ...prev, amount: "Saldo awal tidak valid." }));
      return;
    }

    console.log("Dispatching createWallet:", walletData);
    setErrors({});
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
      isLoading={isLoading}
      showSuccessPopup={isSuccess}
      onCloseSuccessPopup={() => dispatch(resetWalletState())}
      errors={errors}
      successMessage={message} 
      serverError={isError && !errors.server ? message : errors.server || null}
    />
  );
};

export default MyWallet;
