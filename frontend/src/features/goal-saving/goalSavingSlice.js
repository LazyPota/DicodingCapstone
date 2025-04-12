import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../instance/api";

export const getGoalSavings = createAsyncThunk(
  "goalSavings/getAll",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) {
        return rejectWithValue("User tidak terautentikasi");
      }
      const response = await api.get(`/capstone/user/${userId}/goal-savings/`);
      if (response.data && Array.isArray(response.data.result)) {
        return response.data.result;
      } else {
        console.warn(
          "Format respons getGoalSavings tidak sesuai:",
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

export const createGoalSaving = createAsyncThunk(
  "goalSavings/create",
  async ({ userId, goalData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue("User tidak terautentikasi");
      const response = await api.post(
        `/capstone/user/${userId}/goal-savings/`,
        goalData
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

export const updateGoalSaving = createAsyncThunk(
  "goalSavings/update",
  async ({ userId, goalId, goalData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue("User tidak terautentikasi");
      const response = await api.put(
        `/capstone/user/${userId}/goal-savings/${goalId}`,
        goalData
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

export const deleteGoalSaving = createAsyncThunk(
  "goalSavings/delete",
  async ({ userId, goalId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue("User tidak terautentikasi");
      await api.delete(`/capstone/user/${userId}/goal-savings/${goalId}`);
      return goalId;
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
  goals: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const goalSavingSlice = createSlice({
  name: "goalSavings",
  initialState,
  reducers: {
    resetGoalSavingState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGoalSavings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getGoalSavings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.goals = action.payload;
      })
      .addCase(getGoalSavings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.goals = [];
      })
      .addCase(createGoalSaving.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(createGoalSaving.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (action.payload) {
          state.goals.unshift(action.payload);
        }
        state.message = "Rencana tabungan berhasil ditambahkan!";
      })
      .addCase(createGoalSaving.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateGoalSaving.pending, (state) => {
        state.isLoading = true; 
        state.isSuccess = false;
      })
      .addCase(updateGoalSaving.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if(action.payload){
            const index = state.goals.findIndex((goal) => goal.id === action.payload.id);
            if (index !== -1) {
                state.goals[index] = action.payload; 
            }
        }
        state.message = 'Rencana tabungan berhasil diperbarui!';
      })
      .addCase(updateGoalSaving.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteGoalSaving.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(deleteGoalSaving.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.goals = state.goals.filter((goal) => goal.id !== action.payload);
        state.message = "Rencana tabungan berhasil dihapus!";
      })
      .addCase(deleteGoalSaving.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetGoalSavingState } = goalSavingSlice.actions;
export default goalSavingSlice.reducer;
