import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createShipment,
  getUserShipments,
  getPendingShipments,
  getRoutes,
  getCarriers,
  assignRouteToShipment,
} from "../../api/shipmentApi";

// Async thunk para crear un nuevo envío
export const createNewShipment = createAsyncThunk(
  "shipments/create",
  async (shipmentData, { rejectWithValue }) => {
    try {
      const response = await createShipment(shipmentData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk para obtener los envíos del usuario
export const fetchUserShipments = createAsyncThunk(
  "shipments/fetchUserShipments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserShipments();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


//asignación de rutas

export const fetchPendingShipments = createAsyncThunk(
  'shipments/fetchPendingShipments',
  async () => {
    const response = await getPendingShipments();
    return response.data;
  }
);

export const fetchRoutes = createAsyncThunk(
  'shipments/fetchRoutes',
  async () => {
    const response = await getRoutes();
    return response.data;
  }
);

export const fetchCarriers = createAsyncThunk(
  'shipments/fetchCarriers',
  async () => {
    const response = await getCarriers();
    return response.data;
  }
);

export const assignRoute = createAsyncThunk(
  'shipments/assignRoute',
  async ({ shipmentId, routeId, carrierId }, { rejectWithValue }) => {
    try {
      const response = await assignRouteToShipment(shipmentId, routeId, carrierId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Error al asignar ruta');
    }
  }
);

// Estado inicial
const initialState = {
  shipments: [],
  pendingShipments: [],
  routes: [],
  carriers: [],
  loading: false,
  error: null,
  assignmentSuccess: false
};

// const initialState = {
//   shipments: [],
//   currentShipment: null,
//   loading: false,
//   error: null,
//   success: false,
// };

const shipmentsSlice = createSlice({
  name: "shipments",
  initialState,
  reducers: {
    clearShipmentStatus: (state) => {
      state.error = null;
      state.success = false;
      state.message = "";
    },
    setCurrentShipment: (state, action) => {
      state.currentShipment = action.payload;
    },
    clearShipmentError: (state) => {
      state.error = null;
    },
    clearShipmentSuccess: (state) => {
      state.success = false;
    },
    clearAssignmentStatus: (state) => {
      state.assignmentSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Crear nuevo envío
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
        state.success = false;
      })
      // Obtener envíos del usuario
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


      //asignación de rutas
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
        state.error = action.error.message;
      })

      // Fetch Routes
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
        state.error = action.error.message;
      })

      // Fetch Carriers
      .addCase(fetchCarriers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarriers.fulfilled, (state, action) => {
        state.loading = false;
        state.carriers = action.payload;
      })
      .addCase(fetchCarriers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Assign Route to Shipment
      .addCase(assignRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.assignmentSuccess = false;
      })
      .addCase(assignRoute.fulfilled, (state, action) => {
        state.loading = false;
        state.assignmentSuccess = true;
        // Eliminar el envío de la lista de pendientes
        state.pendingShipments = state.pendingShipments.filter(
          shipment => shipment.id !== action.payload.id
        );
      })
      .addCase(assignRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.assignmentSuccess = false;
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
