import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getGoalSavings,
  createGoalSaving,
  deleteGoalSaving,
  resetGoalSavingState,
} from "../../features/goal-saving/goalSavingSlice";
import GoalSavingView from "./GoalSavingView";
import Modal from "../../components/Modal";

const GoalSaving = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    goal_name: "",
    target_amount: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { goals, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.goalSavings
  );

  useEffect(() => {
    if (!user?.id) {
      console.log("User ID tidak ditemukan, tidak bisa fetch goal savings.");
      navigate("/login");
      return;
    }
    dispatch(getGoalSavings(user.id));
  }, [dispatch, user?.id, navigate]);

  useEffect(() => {
    if (isError) {
      alert(`Error: ${message}`);
      dispatch(resetGoalSavingState());
    }

    if (isSuccess && message) {
      setIsModalOpen(false);
      setFormData({ goal_name: "", target_amount: "" });
      setIsSuccessPopupOpen(true);
    }
  }, [isError, isSuccess, message, dispatch]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(goals)
    ? goals.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = Array.isArray(goals)
    ? Math.ceil(goals.length / itemsPerPage)
    : 0;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openModal = () => {
    setFormData({ goal_name: "", target_amount: "" });
    setIsModalOpen(true);
  };

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
      [name]: name === "target_amount" ? parseFloat(value) || "" : value,
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!user?.id) return;

    if (!formData.goal_name.trim() || !formData.target_amount) {
      alert("Nama tabungan dan jumlah target wajib diisi.");
      return;
    }

    const goalData = {
      goal_name: formData.goal_name,
      target_amount: parseFloat(formData.target_amount),
    };
    console.log("Submitting goal data:", goalData);
    dispatch(createGoalSaving({ userId: user.id, goalData }));
  };

  const handleDelete = (goalId) => {
    if (window.confirm("Yakin ingin menghapus rencana tabungan ini?")) {
      if (!user?.id) return;
      dispatch(deleteGoalSaving({ userId: user.id, goalId }));
    }
  };

  const formatCurrencyShort = (value) => {
    if (typeof value !== "number") return "Rp. -";
    if (value >= 1000000000) {
      const num = value / 1000000000;
      return `Rp. ${num.toLocaleString("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      })} M`;
    } else if (value >= 1000000) {
      const num = value / 1000000;
      return `Rp. ${num.toLocaleString("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      })} jt`;
    } else {
      return `Rp. ${value.toLocaleString("id-ID")}`;
    }
  };

  const data = [
    { minggu: "Minggu 1", pemasukanBulanIni: 20000, pemasukanBulanLalu: 15000 },
    { minggu: "Minggu 2", pemasukanBulanIni: 45000, pemasukanBulanLalu: 30000 },
    { minggu: "Minggu 3", pemasukanBulanIni: 15000, pemasukanBulanLalu: 10000 },
    { minggu: "Minggu 4", pemasukanBulanIni: 30000, pemasukanBulanLalu: 25000 },
  ];

  return (
    <>
      <GoalSavingView
        isLoading={isLoading}
        isModalOpen={isModalOpen}
        currentItems={currentItems}
        data={data}
        formatCurrencyShort={formatCurrencyShort}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        openModal={openModal}
        closeModal={closeModal}
        onDeleteGoal={handleDelete}
        isSuccessPopupOpen={isSuccessPopupOpen}
        closeSuccessPopup={closeSuccessPopup}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Tambah Rencana Tabungan"
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
        submitLabel="Tambah"
      >
        <>
          <div className="mb-3">
            <label htmlFor="goal_name" className="block text-sm font-medium">
              Nama Tabungan
            </label>
            <input
              id="goal_name"
              name="goal_name"
              type="text"
              value={formData.goal_name}
              onChange={handleFormChange}
              className="w-full border p-2 rounded-md mt-2"
              placeholder="Nama Tabungan"
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="target_amount"
              className="block text-sm font-medium"
            >
              Jumlah Target
            </label>
            <input
              id="target_amount"
              name="target_amount"
              type="number"
              value={formData.target_amount}
              onChange={handleFormChange}
              placeholder="Rp 0.00"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              required
              min="0"
              step="any"
              disabled={isLoading}
            />
          </div>
        </>
      </Modal>
    </>
  );
};

export default GoalSaving;
