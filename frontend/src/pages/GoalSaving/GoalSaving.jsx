import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getGoalSavings,
  createGoalSaving,
  deleteGoalSaving,
  resetGoalSavingState,
  updateGoalSaving,
  resetGoalsAndPagination,
} from "../../features/goal-saving/goalSavingSlice";
import GoalSavingView from "./GoalSavingView";
import Modal from "../../components/Modal";
import SuccessPopup from "../../components/Popup/SuccessPopup";
import UpdatePopup from "../../components/Popup/UpdatePopup";
import DeleteConfirmationPopup from "../../components/Popup/DeletePopup";

const GoalSaving = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentGoal, setCurrentGoal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [errors, setErrors] = useState({});

  const [goalToDelete, setGoalToDelete] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");
  const [deleteErrorMessage, setDeleteErrorMessage] = useState(null);
  const initialFormData = {
    goal_name: "",
    target_amount: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading: authIsLoading } = useSelector(
    (state) => state.auth || { user: null, isLoading: true }
  );
  const {
    goals = [],
    paginationInfo,
    isLoading,
    isError,
    isSuccess,
    message,
  } = useSelector((state) => state.goalSavings);
  const fetchGoalSavings = useCallback(
    (pageToFetch) => {
      if (!user?.id) {
        console.log("fetchGoalSavings skipped: No user ID");
        return;
      }
      console.log(
        `Fetching goal savings for user ${user.id}, page ${pageToFetch}, month: ${selectedMonth}, year: ${selectedYear}`
      );
      dispatch(
        getGoalSavings({
          userId: user.id,
          page: pageToFetch,
          perPage: itemsPerPage,
          month: selectedMonth,
          year: selectedYear,
        })
      );
    },
    [user?.id, selectedMonth, selectedYear, itemsPerPage, dispatch]
  );

  useEffect(() => {
    if (user?.id) {
      fetchGoalSavings(currentPage);
    } else if (!authIsLoading && !user) {
      navigate("/login");
    }
  }, [
    user?.id,
    currentPage,
    selectedMonth,
    selectedYear,
    fetchGoalSavings,
    navigate,
    authIsLoading,
  ]);

  useEffect(() => {
    return () => {
      console.log("GoalSaving UNMOUNTING, performing final reset.");
      dispatch(resetGoalsAndPagination());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess && message) {
      console.log("Goal Saving operation successful:", message);
      setIsModalOpen(false);
      setFormData(initialFormData);
      setCurrentGoal(null);
      setModalMode("add");
      setErrors({});
      if (message.includes("dihapus")) {
        setDeleteSuccessMessage(message);
        setIsDeleteSuccess(true);
      } else {
        if (user?.id) {
          const pageToFetchAfterSuccess = message.includes("ditambahkan")
            ? 1
            : currentPage;

          // Logika untuk memicu fetch ulang:
          if (pageToFetchAfterSuccess !== currentPage) {
            console.log(
              "Success Effect (C/U): Setting page to trigger refetch:",
              pageToFetchAfterSuccess
            );
            setCurrentPage(pageToFetchAfterSuccess);
          } else {
            console.log(
              "Success Effect (C/U): Manually refetching current page:",
              pageToFetchAfterSuccess
            );
            fetchGoalSavings(pageToFetchAfterSuccess);
          }
        } else {
          console.warn("Cannot refetch after C/U success: User ID is missing.");
        }
      }
    }
  }, [isSuccess, message, dispatch, user?.id, currentPage, fetchGoalSavings]);

  useEffect(() => {
    if (isError && message) {
      console.error("Goal Saving operation error:", message);
      if (isModalOpen) {
        setErrors((prev) => ({ ...prev, server: message }));
      } else if (
        message.toLowerCase().includes("delete") ||
        message.toLowerCase().includes("hapus")
      ) {
        setDeleteErrorMessage(message);
      } else {
        console.error("General fetch error:", message);
      }
      dispatch(resetGoalSavingState());
    }
  }, [isError, message, dispatch, isModalOpen]);

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

  const totalPages = paginationInfo?.total_pages || 1;
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };
  const handleMonthChange = (month, year) => {
    console.log(`Filter changed to: Month ${month}, Year ${year}`);
    setSelectedMonth(month);
    setSelectedYear(year);
    setCurrentPage(1);
  };

  const openModal = () => {
    setModalMode("add");
    setCurrentGoal(null);
    setFormData(initialFormData);
    setErrors({});
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentGoal(null);
    setModalMode("add");
    setFormData(initialFormData);
    setErrors({});
    if (isError) dispatch(resetGoalSavingState());
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (errors.server) {
      setErrors((prev) => ({ ...prev, server: null }));
    }
    if (
      (name === "current_amount" || name === "target_amount") &&
      errors.current_amount_vs_target
    ) {
      setErrors((prev) => ({ ...prev, current_amount_vs_target: null }));
    }
  };

  const validateForm = () => {
    let formIsValid = true;
    let newErrors = {};
    const target = parseFloat(formData.target_amount);

    if (!formData.goal_name.trim()) {
      formIsValid = false;
      newErrors.goal_name = "Nama tabungan wajib diisi.";
    }
    if (formData.target_amount === "" || isNaN(target) || target <= 0) {
      formIsValid = false;
      newErrors.target_amount = "Jumlah target harus angka positif.";
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!user?.id) return;
    setErrors({});

    if (!validateForm()) {
      console.log("Goal form validation failed");
      return;
    }

    const targetAmount = parseFloat(formData.target_amount);

    const goalData = {
      goal_name: formData.goal_name.trim(),
      target_amount: targetAmount,
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
    setGoalToDelete(goalId);
    setDeleteErrorMessage(null);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!user?.id || !goalToDelete) return;

    setIsConfirmDeleteOpen(false);
    console.log(
      `Dispatching deleteGoalSaving for user: ${user.id}, goal: ${goalToDelete}`
    );
    await dispatch(deleteGoalSaving({ userId: user.id, goalId: goalToDelete }));

    setGoalToDelete(null);
  };

  const closeDeleteConfirmation = () => {
    setIsConfirmDeleteOpen(false);
    setGoalToDelete(null);
  };

  const closeDeleteSuccessPopup = () => {
    setIsDeleteSuccess(false);
    setDeleteSuccessMessage("");
    if (user?.id) {
      if (
        currentPage !== 1 &&
        goals.length === 0 &&
        paginationInfo?.total_items >= itemsPerPage
      ) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchGoalSavings(currentPage);
      }
    }
    dispatch(resetGoalSavingState());
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
        currentItems={goals}
        chartData={chartData}
        formatCurrencyShort={formatCurrencyShort}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        openModal={openModal}
        onDeleteGoal={handleDelete}
        totalTarget={totalTargetKeseluruhan}
        totalTercapai={totalTerkumpulKeseluruhan}
        sisaTargetTotal={sisaKeseluruhan}
        persentaseTotal={persentaseKeseluruhan}
        deleteError={deleteErrorMessage}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={handleMonthChange}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      >
        <>
          {/* Server Error in Modal */}
          {errors.server && (
            <p className="text-red-500 text-xs mb-3 text-center">
              {errors.server}
            </p>
          )}
          {/* Specific comparison error */}
          {errors.current_amount_vs_target && (
            <p className="text-red-500 text-xs mb-3 text-center">
              {errors.current_amount_vs_target}
            </p>
          )}

          {/* Goal Name */}
          <div className="mb-3">
            <label
              htmlFor="goal_name"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Tabungan
            </label>
            <input
              id="goal_name"
              name="goal_name"
              type="text"
              value={formData.goal_name}
              onChange={handleFormChange}
              className={`w-full border p-2 rounded-md mt-1 ${
                errors.goal_name
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              placeholder="Contoh: Dana Darurat, DP Rumah"
              required
              disabled={isLoading}
              aria-invalid={errors.goal_name ? "true" : "false"}
              aria-describedby={
                errors.goal_name ? "goal_name-error" : undefined
              }
            />
            {errors.goal_name && (
              <p id="goal_name-error" className="text-red-500 text-xs mt-1">
                {errors.goal_name}
              </p>
            )}
          </div>

          {/* Target Amount */}
          <div className="mb-3">
            <label
              htmlFor="target_amount"
              className="block text-sm font-medium text-gray-700"
            >
              Jumlah Target (Rp)
            </label>
            <input
              id="target_amount"
              name="target_amount"
              type="number"
              value={formData.target_amount}
              onChange={handleFormChange}
              placeholder="0"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none mt-1 ${
                errors.target_amount
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              required
              min="0"
              step="any"
              disabled={isLoading}
              aria-invalid={errors.target_amount ? "true" : "false"}
              aria-describedby={
                errors.target_amount ? "target_amount-error" : undefined
              }
            />
            {errors.target_amount && (
              <p id="target_amount-error" className="text-red-500 text-xs mt-1">
                {errors.target_amount}
              </p>
            )}
          </div>
        </>
      </Modal>

      {/* --- POPUPS --- */}
      <DeleteConfirmationPopup
        isOpen={isConfirmDeleteOpen}
        onClose={closeDeleteConfirmation}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
      />
      {isSuccess && message?.includes("ditambahkan") && (
        <SuccessPopup
          isOpen={isSuccess}
          onClose={() => dispatch(resetGoalSavingState())}
          successMessage={message}
        />
      )}
      {isDeleteSuccess && (
        <SuccessPopup
          isOpen={isDeleteSuccess}
          onClose={closeDeleteSuccessPopup}
          successMessage={deleteSuccessMessage}
        />
      )}
    </>
  );
};

export default GoalSaving;
