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

// Thunk untuk Login
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

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null, 
  token: localStorage.getItem('token') || null, 
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '', 
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => { 
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    logout: (state) => { 
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
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
      });
  },
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;