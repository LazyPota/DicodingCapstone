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
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const response = await api.put("/capstone/user/profile", profileData); // Axios menangani FormData Content-Type
      console.log("Update profile response from thunk:", response.data); // Tetap log untuk debug

      // --- PERBAIKI KONDISI CEK ---
      // Cek berdasarkan struktur respons yang benar
      if (response.data && response.data.success && response.data.result && response.data.result.user) {
        // Update data user di localStorage juga
        const currentUser = JSON.parse(localStorage.getItem("user")) || {};
        // Gabungkan user lama dengan field yg diupdate dari backend
        const updatedUser = {
            ...currentUser,
            username: response.data.result.user.username, // Ambil username baru
            profile_image_path: response.data.result.user.profile_image_path // Ambil path gambar baru
            // Sertakan field user lain yang mungkin ada jika perlu
         };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Kembalikan objek yang berisi pesan sukses spesifik DARI BACKEND dan user data
        return {
            message: response.data.result.message || "Profil berhasil diperbarui!", // Ambil pesan dari result
            user: updatedUser
        };
      } else {
        // Jika backend merespons sukses (200 OK) tapi struktur tidak sesuai atau success: false
        console.warn("Update profile response structure mismatch or success false:", response.data);
        return rejectWithValue(response.data.message || "Gagal memperbarui profil, respons tidak dikenali.");
      }
    } catch (error) {
      // Tangani error jaringan atau status non-2xx dari backend
      const message =
        error.response?.data?.message || // Coba ambil pesan error dari backend
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
  isSuccess: false, // Mungkin perlu state sukses spesifik untuk update
  updateProfileSuccess: false, // State sukses khusus untuk update
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
      state.updateProfileSuccess = false; // Reset state sukses update
      state.message = "";
    },
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.user = null;
      state.token = null;
      // Reset state lainnya juga saat logout jika perlu
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
        state.updateProfileSuccess = true; // Set sukses
        state.isError = false; // Pastikan error false
        state.user = action.payload.user; // Update user dari payload thunk
        state.message = action.payload.message; // Gunakan pesan sukses DARI THUNK (yang berasal dari backend result)
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true; // Set error
        state.updateProfileSuccess = false; // Pastikan sukses false
        state.message = action.payload || "Gagal memperbarui profil."; // Pesan dari rejectWithValue
      });
  },
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;