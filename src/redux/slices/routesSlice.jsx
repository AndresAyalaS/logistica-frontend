import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllRoutes, createRoute } from "../../api/routeApi";

// Obtener todas las rutas
export const fetchRoutes = createAsyncThunk(
  "routes/fetchRoutes",
  async (_, { rejectWithValue }) => {
    try {
      const result = await getAllRoutes();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Crear nueva ruta
export const createNewRoute = createAsyncThunk(
  "routes/createRoute",
  async (routeData, { rejectWithValue }) => {
    try {
      return await createRoute(routeData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const routesSlice = createSlice({
  name: "routes",
  initialState: {
    routes: [],
    loading: false,
    error: null,
    success: false,
    message: "",
  },
  reducers: {
    clearRoutesStatus(state) {
      state.error = null;
      state.success = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener rutas
      .addCase(fetchRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.routes = action.payload;
      })
      .addCase(fetchRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Crear nueva ruta
      .addCase(createNewRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createNewRoute.fulfilled, (state, action) => {
        state.loading = false;
        state.routes = [...(state.routes || []), action.payload];
        state.success = true;
        state.message = "Ruta creada exitosamente";
      })
      .addCase(createNewRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearRoutesStatus } = routesSlice.actions;

export default routesSlice.reducer;
