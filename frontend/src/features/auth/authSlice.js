import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../instance/api'; 

export const registerUser = createAsyncThunk(
  'auth/register', 
  async (userData, { rejectWithValue }) => { 
    try {
      const response = await api.post('/capstone/user/register', userData);
      console.log('Register response from thunk:', response.data);
      return { message: response.data.message || 'Registrasi berhasil!' }; 
    } catch (error) {
      const message = error.response?.data?.message || error.response?.statusText || error.message;
      return rejectWithValue(message); 
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => { 
    try {
      const response = await api.post('/capstone/user/login', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
      } else {
        return rejectWithValue('Respons login tidak valid');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.response?.statusText || error.message;
      return rejectWithValue(message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put("/capstone/user/profile", profileData); 
      console.log("Update profile response from thunk:", response.data); 
      if (response.data && response.data.success && response.data.result && response.data.result.user) {
        const currentUser = JSON.parse(localStorage.getItem("user")) || {};
        const updatedUser = {
            ...currentUser,
            username: response.data.result.user.username, 
            profile_image_path: response.data.result.user.profile_image_path 
         };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return {
            message: response.data.result.message || "Profil berhasil diperbarui!", 
            user: updatedUser
        };
      } else {
        console.warn("Update profile response structure mismatch or success false:", response.data);
        return rejectWithValue(response.data.message || "Gagal memperbarui profil, respons tidak dikenali.");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 
        error.response?.statusText ||
        error.message;
      console.error("Update profile error:", error.response?.data || error);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  updateProfileSuccess: false, 
  message: "",
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.updateProfileSuccess = false; 
      state.message = "";
    },
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.updateProfileSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true; 
        state.message = action.payload.message; 
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; 
        state.user = null;
        state.token = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true; 
        state.user = action.payload; 
        state.token = localStorage.getItem('token'); 
        state.message = 'Login berhasil!';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; 
        state.user = null;
        state.token = null;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.updateProfileSuccess = false;
        state.message = ""; // Kosongkan pesan saat request dimulai
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.updateProfileSuccess = true; 
        state.isError = false; 
        state.user = action.payload.user; 
        state.message = action.payload.message; 
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true; 
        state.updateProfileSuccess = false; 
        state.message = action.payload || "Gagal memperbarui profil."; 
      });
  },
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;