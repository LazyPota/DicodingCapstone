import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getGoalSavings,
  createGoalSaving,
  deleteGoalSaving,
  resetGoalSavingState,
  updateGoalSaving,
} from "../../features/goal-saving/goalSavingSlice";
import GoalSavingView from "./GoalSavingView";
import Modal from "../../components/Modal";

const GoalSaving = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMode, setModalMode] = useState("add");
  const [currentGoal, setCurrentGoal] = useState(null);
  const itemsPerPage = 6;
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    goal_name: "",
    target_amount: "",
    current_amount: "",
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
    return () => {
      dispatch(resetGoalSavingState());
    };
  }, [dispatch, user?.id, navigate]);

  useEffect(() => {
    if (isError) {
      alert(`Error: ${message}`);
      dispatch(resetGoalSavingState());
    }
    if (isSuccess && message) {
      setIsModalOpen(false);
      setFormData({ goal_name: "", target_amount: "", current_amount: "" });
      setCurrentGoal(null);
      setModalMode("add");
      setIsSuccessPopupOpen(true);
    }
  }, [isError, isSuccess, message, dispatch]);

  const safeGoals = useMemo(() => (Array.isArray(goals) ? goals : []), [goals]);

  const chartData = useMemo(() => {
    const goalsForChart = safeGoals.slice(0, 5);
    return goalsForChart.map((goal) => {
      const current = goal.current_amount || 0;
      const target = goal.target_amount || 1;
      const percentage =
        target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
      return {
        name: goal.goal_name,
        progress: percentage,
      };
    });
  }, [safeGoals]);

  const totalTargetKeseluruhan = useMemo(() => {
    return safeGoals.reduce((sum, goal) => sum + (goal.target_amount || 0), 0);
  }, [safeGoals]);

  const totalTerkumpulKeseluruhan = useMemo(() => {
    return safeGoals.reduce((sum, goal) => sum + (goal.current_amount || 0), 0);
  }, [safeGoals]);

  const persentaseKeseluruhan = useMemo(() => {
    return totalTargetKeseluruhan > 0
      ? Math.round((totalTerkumpulKeseluruhan / totalTargetKeseluruhan) * 100)
      : 0;
  }, [totalTerkumpulKeseluruhan, totalTargetKeseluruhan]);

  const sisaKeseluruhan = useMemo(() => {
    return Math.max(0, totalTargetKeseluruhan - totalTerkumpulKeseluruhan);
  }, [totalTargetKeseluruhan, totalTerkumpulKeseluruhan]);

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
    setModalMode("add");
    setCurrentGoal(null);
    setFormData({ goal_name: "", target_amount: "", current_amount: "" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (goal) => {
    setModalMode("edit");
    setCurrentGoal(goal);
    setFormData({
      goal_name: goal.goal_name || "",
      target_amount: goal.target_amount || "",
      current_amount: goal.current_amount || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentGoal(null);
    setModalMode("add");
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
    const target = parseFloat(formData.target_amount) || 0;
    const current = parseFloat(formData.current_amount) || 0;
    if (current > target) {
      alert("Jumlah terkumpul tidak boleh lebih besar dari jumlah target.");
      return;
    }

    const goalData = {
      goal_name: formData.goal_name,
      target_amount: target,
      current_amount: current,
    };

    if (modalMode === "add") {
      console.log("Submitting create goal data:", goalData);
      dispatch(createGoalSaving({ userId: user.id, goalData }));
    } else if (modalMode === "edit" && currentGoal) {
      console.log(
        "Submitting update goal data:",
        goalData,
        "for ID:",
        currentGoal.id
      );
      dispatch(
        updateGoalSaving({ userId: user.id, goalId: currentGoal.id, goalData })
      );
    }
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

  return (
    <>
      <GoalSavingView
        isLoading={isLoading}
        isModalOpen={isModalOpen}
        currentItems={currentItems}
        chartData={chartData}
        formatCurrencyShort={formatCurrencyShort}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        openModal={openModal}
        closeModal={closeModal}
        onEditGoal={handleOpenEditModal}
        onDeleteGoal={handleDelete}
        isSuccessPopupOpen={isSuccessPopupOpen}
        closeSuccessPopup={closeSuccessPopup}
        totalTarget={totalTargetKeseluruhan}
        totalTercapai={totalTerkumpulKeseluruhan}
        targetTercapai={totalTerkumpulKeseluruhan}
        sisaTargetTotal={sisaKeseluruhan}
        persentaseTotal={persentaseKeseluruhan}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          modalMode === "add"
            ? "Tambah Rencana Tabungan"
            : "Edit Rencana Tabungan"
        }
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
        submitLabel={modalMode === "add" ? "Tambah" : "Simpan"}
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
          <div className="mb-3">
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
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 mt-2"
              required
              min="0"
              step="any"
              disabled={isLoading}
            />
          </div>
          {modalMode === "edit" && (
            <div className="mb-2">
              <label htmlFor="current_amount">Jumlah Terkumpul Saat Ini</label>
              <input
                id="current_amount"
                name="current_amount"
                type="number"
                value={formData.current_amount}
                onChange={handleFormChange}
                placeholder="Rp 0"
                min="0"
                step="any"
                disabled={isLoading}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 mt-2"
              />
            </div>
          )}
        </>
      </Modal>
    </>
  );
};

export default GoalSaving;
