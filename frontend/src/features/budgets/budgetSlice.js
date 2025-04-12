import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../instance/api';

export const getBudgets = createAsyncThunk(
  'budgets/getAll',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) {
        return rejectWithValue('User tidak terautentikasi');
      }
      const response = await api.get(`/capstone/user/${userId}/budgets/`);
      if (response.data && Array.isArray(response.data.result)) {
        return response.data.result;
      } else {
        console.warn("Format respons getBudgets tidak sesuai:", response.data);
        return [];
      }
    } catch (error) {
      const message = error.response?.data?.message || error.response?.statusText || error.message;
      return rejectWithValue(message);
    }
  }
);

export const createBudget = createAsyncThunk(
  'budgets/create',
  async ({ userId, budgetData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue('User tidak terautentikasi');
      const response = await api.post(`/capstone/user/${userId}/budgets/`, budgetData);
      // Asumsikan backend mengembalikan budget baru di result
      return response.data.result;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.statusText || error.message;
      return rejectWithValue(message);
    }
  }
);

export const updateBudget = createAsyncThunk(
    'budgets/update',
    async ({ userId, budgetId, budgetData }, { getState, rejectWithValue }) => {
      try {
        const { token } = getState().auth;
        if (!token) return rejectWithValue('User tidak terautentikasi');
        const response = await api.put(`/capstone/user/${userId}/budgets/${budgetId}`, budgetData);
        return response.data.result;
      } catch (error) {
        const message = error.response?.data?.message || error.response?.statusText || error.message;
        return rejectWithValue(message);
      }
    }
);

export const deleteBudget = createAsyncThunk(
  'budgets/delete',
  async ({ userId, budgetId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue('User tidak terautentikasi');
      await api.delete(`/capstone/user/${userId}/budgets/${budgetId}`);
      return budgetId;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.statusText || error.message;
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  budgets: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

export const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    resetBudgetState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBudgets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBudgets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.budgets = action.payload;
      })
      .addCase(getBudgets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.budgets = [];
      })
      .addCase(createBudget.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (action.payload) {
            const newBudget = { ...action.payload, spent_amount: 0 };
            state.budgets.unshift(newBudget);
        }
        state.message = 'Anggaran berhasil ditambahkan!';
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateBudget.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if(action.payload){
            const index = state.budgets.findIndex((budget) => budget.id === action.payload.id);
            if (index !== -1) {
                const currentSpent = state.budgets[index].spent_amount || 0;
                state.budgets[index] = { ...action.payload, spent_amount: currentSpent };
            }
        }
        state.message = 'Anggaran berhasil diperbarui!';
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteBudget.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.budgets = state.budgets.filter((budget) => budget.id !== action.payload);
        state.message = 'Anggaran berhasil dihapus!';
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetBudgetState } = budgetSlice.actions;
export default budgetSlice.reducer;