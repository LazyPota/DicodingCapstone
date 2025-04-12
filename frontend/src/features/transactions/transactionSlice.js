import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../instance/api";

export const getTransactions = createAsyncThunk(
  "transactions/getAll",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue("User tidak terautentikasi");

      const response = await api.get(`/capstone/user/${userId}/transactions/`);
      if (response.data && Array.isArray(response.data.result)) {
        return response.data.result;
      } else {
        console.warn(
          "Format respons getTransactions tidak sesuai:",
          response.data
        );
        return [];
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

export const createTransaction = createAsyncThunk(
  "transactions/create",
  async ({ userId, transactionData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue("User tidak terautentikasi");

      const response = await api.post(
        `/capstone/user/${userId}/transactions/`,
        transactionData
      );
      return response.data.result;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.statusText ||
        error.message;
      return rejectWithValue(message);
    }
  }
);

export const createTransfer = createAsyncThunk(
  "transactions/createTransfer", // Nama berbeda untuk transfer
  async ({ userId, transferData }, { getState, rejectWithValue }) => {
    // transferData = { from_wallet_id?, from_goal_id?, to_wallet_id?, to_goal_id?, amount, transfer_date, note }
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue("User tidak terautentikasi");
      const response = await api.post(
        `/capstone/user/${userId}/transactions/transfers`,
        transferData
      );
      return response.data.result;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.statusText ||
        error.message;
      return rejectWithValue(message);
    }
  }
);

export const initialState = {
  transactions: [],
  transfers: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    resetTransactionState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.transactions = [];
      })
      .addCase(createTransaction.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (action.payload) {
          state.transactions.unshift(action.payload);
        }
        state.message = "Transaksi berhasil ditambahkan!";
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createTransfer.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(createTransfer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.transfers.unshift(action.payload); 
        state.message = "Transfer berhasil ditambahkan!";
      })
      .addCase(createTransfer.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetTransactionState } = transactionSlice.actions;
export default transactionSlice.reducer;
