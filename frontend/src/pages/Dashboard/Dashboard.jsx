import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardView from "./DashboardView";
import { FaHome, FaMotorcycle, FaMobileAlt, FaKaaba } from "react-icons/fa";
import {
  getDashboardData,
  resetDashboardState,
} from "../../features/dashboard/dashboardSlice";
import { getWallets } from "../../features/wallets/walletSlice";
import { getGoalSavings } from "../../features/goal-saving/goalSavingSlice";
import { getTransactions } from "../../features/transactions/transactionSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const {
    financialHealthStatus,
    totalIncome,
    totalExpense,
    barChartData,
    isLoading,
    isError,
    message,
  } = useSelector((state) => state.dashboard);

  const { wallets = [] } = useSelector((state) => state.wallets);
  const { goals = [] } = useSelector((state) => state.goalSavings);
  const { transactions = [] } = useSelector((state) => state.transactions);

  const [displayWallet, setDisplayWallet] = useState(null);
  const [recentSavings, setRecentSavings] = useState([]);
  const [healthScore, setHealthScore] = useState(0);
  const [healthStatusText, setHealthStatusText] = useState("Loading...");
  const [healthEmoji, setHealthEmoji] = useState("svg-spinners:pulse");

  useEffect(() => {
    if (user?.id) {
      dispatch(getDashboardData(user.id));
      if (wallets.length === 0) dispatch(getWallets(user.id));
      if (goals.length === 0) dispatch(getGoalSavings({ userId: user.id }));
      if (transactions.length === 0) {
        dispatch(
          getTransactions({
            userId: user.id,
          })
        );
      }
    } else {
      navigate("/login");
    }
    return () => {
      dispatch(resetDashboardState());
    };
  }, [dispatch, user?.id, navigate]);

  useEffect(() => {
    if (wallets.length > 0) {
      setDisplayWallet(wallets[0]);
    } else {
      setDisplayWallet(null);
    }

    const sortedGoals = [...goals].sort((a, b) => {
      const progressA = (a.current_amount || 0) / (a.target_amount || 1);
      const progressB = (b.current_amount || 0) / (b.target_amount || 1);
      return progressB - progressA;
    });
    setRecentSavings(
      sortedGoals.slice(0, 4).map((goal) => ({
        name: goal.goal_name,
        current: goal.current_amount || 0,
        total: goal.target_amount || 0,
        percent:
          goal.target_amount > 0
            ? Math.min(
                100,
                Math.round(
                  ((goal.current_amount || 0) / goal.target_amount) * 100
                )
              )
            : 0,
      }))
    );

    const statusMapping = {
      0: {
        score: 15,
        text: "Perlu Perbaikan",
        emoji: "fluent-emoji-flat:worried-face",
      },
      1: {
        score: 45,
        text: "Cukup Baik",
        emoji: "fluent-emoji-flat:neutral-face",
      },
      2: {
        score: 75,
        text: "Baik & Stabil",
        emoji: "fluent-emoji-flat:slightly-smiling-face",
      },
      3: {
        score: 90,
        text: "Sehat & Terkendali",
        emoji: "fluent-emoji-flat:smiling-face-with-smiling-eyes",
      },
      default: {
        score: 0,
        text: "Data Tidak Diketahui",
        emoji: "fluent-emoji-flat:confused-face",
      },
    };

    const potentialHealthInfo = statusMapping[financialHealthStatus];
    const healthInfo =
      potentialHealthInfo !== undefined
        ? potentialHealthInfo
        : statusMapping.default;

    if (healthInfo) {
      setHealthScore(healthInfo.score);
      setHealthStatusText(healthInfo.text);
      setHealthEmoji(healthInfo.emoji);
    } else {
      console.error(
        "Gagal menentukan healthInfo, status:",
        financialHealthStatus
      );
      setHealthScore(0);
      setHealthStatusText("Error Data");
      setHealthEmoji("fluent-emoji-flat:warning");
    }
  }, [wallets, goals, financialHealthStatus]);

  const recentTransactions = useMemo(() => {
    const safeTransactions = Array.isArray(transactions) ? transactions : [];
    return safeTransactions.slice(0, 5);
  }, [transactions]);

  const chartDisplayData = barChartData;

  if (isError && !financialHealthStatus) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {message || "Gagal memuat dashboard."}
      </div>
    );
  }

  if (isLoading && !financialHealthStatus) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading Dashboard...
      </div>
    );
  }

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
    <DashboardView
      financialHealthScore={healthScore}
      financialHealthText={healthStatusText}
      financialHealthEmoji={healthEmoji}
      totalPemasukan={totalIncome}
      totalPengeluaran={totalExpense}
      walletToShow={displayWallet}
      savingsToShow={recentSavings}
      chartData={chartDisplayData}
      formatCurrency={formatCurrencyShort}
      isLoading={isLoading}
      error={isError ? message : null}
      recentTransactions={recentTransactions}
    />
  );
};

export default Dashboard;
