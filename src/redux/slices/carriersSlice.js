import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCarriers, createCarrier  } from "../../api/carrierApi";

export const fetchCarriers = createAsyncThunk(
  "carriers/fetchCarriers",
  async (_, { rejectWithValue }) => {
    try {
      const result = await getAllCarriers();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNewCarrier = createAsyncThunk(
  "carriers/createCarrier",
  async (carrierData, { rejectWithValue }) => {
    try {
      return await createCarrier(carrierData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const carriersSlice = createSlice({
  name: "carriers",
  initialState: {
    carriers: [],
    loading: false,
    error: null,
    success: false,
    message: "",
  },
  reducers: {
    clearCarriersError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
        state.error = action.payload;
      })

      // crear nuevo transportador
      .addCase(createNewCarrier.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createNewCarrier.fulfilled, (state, action) => {
        state.loading = false;
        state.carriers = [...(state.carriers || []), action.payload]
        state.success = true;
        state.message = "Transportista creado exitosamente";
      })
      .addCase(createNewCarrier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearCarriersError } = carriersSlice.actions;
export default carriersSlice.reducer;
