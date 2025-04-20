import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createShipment,
  getUserShipments,
  getPendingShipments,
  assignRouteToShipment,
} from "../../api/shipmentApi";

// Crear nuevo envío
export const createNewShipment = createAsyncThunk(
  "shipments/create",
  async (shipmentData, { rejectWithValue }) => {
    try {
      return await createShipment(shipmentData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Obtener envíos del usuario
export const fetchUserShipments = createAsyncThunk(
  "shipments/fetchUserShipments",
  async (_, { rejectWithValue }) => {
    try {
      return await getUserShipments();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Obtener envíos pendientes
export const fetchPendingShipments = createAsyncThunk(
  "shipments/fetchPendingShipments",
  async (_, { rejectWithValue }) => {
    try {
      return await getPendingShipments();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Asignar ruta y transportista
export const assignRoute = createAsyncThunk(
  "shipments/assignRoute",
  async ({ shipmentId, routeId, carrierId }, { rejectWithValue }) => {
    try {
      const response = await assignRouteToShipment(shipmentId, routeId, carrierId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  shipments: [],
  pendingShipments: [],
  loading: false,
  error: null,
  success: false,
  message: "",
  currentShipment: null,
  assignmentSuccess: false,
};

const shipmentsSlice = createSlice({
  name: "shipments",
  initialState,
  reducers: {
    clearShipmentStatus(state) {
      state.error = null;
      state.success = false;
      state.message = "";
    },
    setCurrentShipment(state, action) {
      state.currentShipment = action.payload;
    },
    clearShipmentError(state) {
      state.error = null;
    },
    clearShipmentSuccess(state) {
      state.success = false;
    },
    clearAssignmentStatus(state) {
      state.assignmentSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Crear envío
      .addCase(createNewShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createNewShipment.fulfilled, (state, action) => {
        state.loading = false;
        state.shipments.push(action.payload);
        state.success = true;
        state.message = "Envío creado correctamente";
        state.currentShipment = action.payload;
      })
      .addCase(createNewShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Envíos del usuario
      .addCase(fetchUserShipments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserShipments.fulfilled, (state, action) => {
        state.loading = false;
        state.shipments = action.payload;
      })
      .addCase(fetchUserShipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Envíos pendientes
      .addCase(fetchPendingShipments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingShipments.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingShipments = action.payload;
      })
      .addCase(fetchPendingShipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Asignar ruta
      .addCase(assignRoute.pending, (state) => {
        state.loading = true;
        state.assignmentSuccess = false;
        state.error = null;
      })
      .addCase(assignRoute.fulfilled, (state, action) => {
        state.loading = false;
        state.assignmentSuccess = true;
        state.pendingShipments = state.pendingShipments.filter(
          (shipment) => shipment.id !== action.payload.id
        );
      })
      .addCase(assignRoute.rejected, (state, action) => {
        state.loading = false;
        state.assignmentSuccess = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearShipmentStatus,
  setCurrentShipment,
  clearShipmentError,
  clearShipmentSuccess,
  clearAssignmentStatus,
} = shipmentsSlice.actions;

export default shipmentsSlice.reducer;
