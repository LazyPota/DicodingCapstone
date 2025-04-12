import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../instance/api';

export const getWallets = createAsyncThunk(
  'wallets/getAll',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue('User tidak terautentikasi');

      const response = await api.get(`/capstone/user/${userId}/wallets/`);
      if (response.data && Array.isArray(response.data.result)) {
        return response.data.result;
      } else {
        console.warn("Format respons getWallets tidak sesuai:", response.data);
        return [];
      }
    } catch (error) {
      const message = error.response?.data?.message || error.response?.statusText || error.message;
      return rejectWithValue(message);
    }
  }
);

export const getWalletById = createAsyncThunk(
  'wallets/getById',
  async ({ userId, walletId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue('User tidak terautentikasi');

      const response = await api.get(`/capstone/user/${userId}/wallets/${walletId}`);
      return response.data.result;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.statusText || error.message;
      return rejectWithValue(message);
    }
  }
);

export const createWallet = createAsyncThunk(
  'wallets/create',
  async ({ userId, walletData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue('User tidak terautentikasi');

      const response = await api.post(`/capstone/user/${userId}/wallets/`, walletData);
      return response.data.result; 
    } catch (error) {
      const message = error.response?.data?.message || error.response?.statusText || error.message;
      return rejectWithValue(message);
    }
  }
);

export const deleteWallet = createAsyncThunk(
  'wallets/delete',
  async ({ userId, walletId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue('User tidak terautentikasi');

      await api.delete(`/capstone/user/${userId}/wallets/${walletId}`);
      return walletId;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.statusText || error.message;
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  wallets: [],
  currentWallet: null, 
  isLoading: false,
  isDetailLoading: false, 
  isError: false,
  isSuccess: false, 
  message: '',
};

export const walletSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    resetWalletState: (state) => {
      state.isLoading = false;
      state.isDetailLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    resetCurrentWallet: (state) => {
        state.currentWallet = null;
        state.isDetailLoading = false;
        state.isError = false;
        state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWallets.pending, (state) => {
        state.isLoading = true; 
      })
      .addCase(getWallets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wallets = action.payload;
      })
      .addCase(getWallets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.wallets = [];
      })
      .addCase(getWalletById.pending, (state) => {
        state.isDetailLoading = true; 
        state.currentWallet = null; 
        state.isError = false;
        state.message = '';
      })
      .addCase(getWalletById.fulfilled, (state, action) => {
        state.isDetailLoading = false;
        state.currentWallet = action.payload; 
      })
      .addCase(getWalletById.rejected, (state, action) => {
        state.isDetailLoading = false;
        state.isError = true;
        state.message = action.payload; 
        state.currentWallet = null;
      })
      // Create Wallet
      .addCase(createWallet.pending, (state) => {
        state.isLoading = true; 
        state.isSuccess = false;
      })
      .addCase(createWallet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if(action.payload){
            state.wallets.unshift(action.payload); 
        }
        state.message = 'Dompet berhasil ditambahkan!';
      })
      .addCase(createWallet.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteWallet.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(deleteWallet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.wallets = state.wallets.filter((wallet) => wallet.id !== action.payload);
        if(state.currentWallet && state.currentWallet.id === action.payload){
            state.currentWallet = null;
        }
        state.message = 'Dompet berhasil dihapus!';
      })
      .addCase(deleteWallet.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetWalletState, resetCurrentWallet } = walletSlice.actions;
export default walletSlice.reducer;