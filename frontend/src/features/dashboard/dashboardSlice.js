import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../instance/api"; 

export const getDashboardData = createAsyncThunk(
  "dashboard/getData",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const user = getState().auth.user;
      const id = userId || user?.id;
      if (!id) return rejectWithValue("User tidak ditemukan");

      if (!token) return rejectWithValue("User tidak terautentikasi");

      const healthResponse = await api.post(`/capstone/ml/${id}/financial-health`);

      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const params = new URLSearchParams();
      params.append("month", currentMonth);
      params.append("year", currentYear);

      const transactionsResponse = await api.get(`/capstone/user/${id}/transactions?${params.toString()}`);
      console.log("URL:", `/capstone/user/${id}/transactions?${params.toString()}`);
      console.log("Response Transaksi:", transactionsResponse.data);


      const weeklyChart = [
        { minggu: "Minggu-1", pemasukan: 0, pengeluaran: 0 },
        { minggu: "Minggu-2", pemasukan: 0, pengeluaran: 0 },
        { minggu: "Minggu-3", pemasukan: 0, pengeluaran: 0 },
        { minggu: "Minggu-4", pemasukan: 0, pengeluaran: 0 },
      ];

      if (transactionsResponse.data && Array.isArray(transactionsResponse.data.result)) {
        transactionsResponse.data.result.forEach((item) => {
          const date = new Date(item.transaction_date);
          const week = Math.floor((date.getDate() - 1) / 7);
      
          if (week >= 0 && week < 4) {
            if (item.transaction_type === "Income") {
              weeklyChart[week].pemasukan += item.amount;
            } else if (item.transaction_type === "Expense") {
              weeklyChart[week].pengeluaran += item.amount;
            }
          }
        });
      }

      if (healthResponse.data) {
        return {
          ...healthResponse.data,
          barChartData: weeklyChart,
        };
      } else {
        return rejectWithValue("Respons financial health tidak valid");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.statusText ||
        error.message;
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  financialHealthStatus: null,
  totalIncome: 0,
  totalExpense: 0,
  totalBudget: 0,
  totalSavings: 0,
  barChartData: [
    { minggu: "Minggu-1", pemasukan: 0, pengeluaran: 0 },
    { minggu: "Minggu-2", pemasukan: 0, pengeluaran: 0 },
    { minggu: "Minggu-3", pemasukan: 0, pengeluaran: 0 },
    { minggu: "Minggu-4", pemasukan: 0, pengeluaran: 0 },
  ],
  savingsSummary: [],
  walletSummary: null,
  isLoading: false,
  isError: false,
  message: "",
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetDashboardState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardData.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.financialHealthStatus = action.payload.financial_health_status;
        state.totalIncome = action.payload.total_income || 0;
        state.totalExpense = action.payload.total_expense || 0;
        state.barChartData = action.payload.barChartData || state.barChartData;
        // Update data chart jika API mengembalikannya
        // state.barChartData = mapApiDataToChartFormat(action.payload.transaction_summary);
        // Update data savings summary jika API mengembalikannya
        // state.savingsSummary = mapApiDataToSavingsFormat(action.payload.goal_summary);
        // Update data wallet summary
        // state.walletSummary = action.payload.wallet_summary;
      })
      .addCase(getDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.financialHealthStatus = "Error";
      });
  },
});

export const { resetDashboardState } = dashboardSlice.actions;
export default dashboardSlice.reducer;
