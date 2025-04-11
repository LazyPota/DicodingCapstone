import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../instance/api";

export const getCategories = createAsyncThunk(
  "categories/getAll",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) {
        return rejectWithValue("User tidak terautentikasi");
      }
      const response = await api.get(`/capstone/user/${userId}/categories/`);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.statusText ||
        error.message;
      return rejectWithValue(message);
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/create",
  async ({ userId, categoryData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue("User tidak terautentikasi");
      const response = await api.post(
        `/capstone/user/${userId}/categories/`,
        categoryData
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

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async ({ userId, categoryId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue("User tidak terautentikasi");
      await api.delete(`/capstone/user/${userId}/categories/${categoryId}`);
      return categoryId;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.statusText ||
        error.message;
      return rejectWithValue(message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  async (
    { userId, categoryId, categoryData },
    { getState, rejectWithValue }
  ) => {
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue("User tidak terautentikasi");
      const response = await api.put(
        `/capstone/user/${userId}/categories/${categoryId}`,
        categoryData
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

const initialState = {
  categories: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    resetCategoryState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.categories = [];
      })
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories.unshift(action.payload);
        state.message = "Kategori berhasil ditambahkan!";
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = state.categories.filter(
          (category) => category.id !== action.payload
        );
        state.message = "Kategori berhasil dihapus!";
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.categories.findIndex(
          (cat) => cat.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        state.message = "Kategori berhasil diperbarui!";
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetCategoryState } = categorySlice.actions;
export default categorySlice.reducer;
