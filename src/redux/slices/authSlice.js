import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '../../api/authApi';

// Async thunk para el login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      // Guardar token en localStorage
      localStorage.setItem('token', response.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk para el registro
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUser(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: localStorage.getItem('token') ? true : false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error de autenticación';
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error en el registro';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;