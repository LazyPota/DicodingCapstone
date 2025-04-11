import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../instance/api";

export const sendResetCode = createAsyncThunk(
  "passwordReset/sendCode",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post("/capstone/send-reset-code", { email });
      return response.data; // Kirim seluruh data respons (termasuk message)
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Gagal mengirim kode";
      return rejectWithValue(message);
    }
  }
);

export const checkCode = createAsyncThunk(
  "passwordReset/checkCode",
  async ({ email, code }, { rejectWithValue }) => {
    try {
      const response = await api.post("/capstone/check-code", { email, code });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Gagal verifikasi kode";
      return rejectWithValue(message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "passwordReset/reset",
  async (resetData, { rejectWithValue }) => {
    // resetData = { email, code, new_password, new_password_confirm }
    try {
      // URL tidak pakai /:id karena kita identifikasi via email/code di body
      const response = await api.post("/capstone/reset-password", resetData);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Gagal reset password";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false, // Lebih berguna untuk checkCode dan resetPassword
  message: "",
};

export const passwordResetSlice = createSlice({
  name: "passwordReset",
  initialState,
  reducers: {
    resetPasswordState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Send Reset Code
      .addCase(sendResetCode.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(sendResetCode.fulfilled, (state, action) => {
        state.isLoading = false;
        // Tidak set isSuccess=true di sini, biarkan komponen yg handle navigasi
        state.message = action.payload?.message || "Kode berhasil dikirim";
      })
      .addCase(sendResetCode.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Check Code
      .addCase(checkCode.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(checkCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true; // Sukses verifikasi
        state.message = action.payload?.message || "Kode valid";
      })
      .addCase(checkCode.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true; // Sukses reset
        state.message = action.payload?.message || "Password berhasil direset";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      });
  },
});

export const { resetPasswordState } = passwordResetSlice.actions;
export default passwordResetSlice.reducer;
