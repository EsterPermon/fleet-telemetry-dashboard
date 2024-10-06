import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Vehicle, VehiclesByIdMap } from './types';

interface VehiclesState {
  allVehicles: VehiclesByIdMap;
  loading: boolean;
  error?: string;
}

const initialState: VehiclesState = {
  allVehicles: {},
  loading: false,
  error: undefined,
};

// !NOTE: Using createAsyncThunk to support real api requests in the future
export const fetchVehicles = createAsyncThunk('vehicles/fetchVehicles', async (): Promise<{ vehicles: Vehicle[] }> => {
  try {
    const response = await require('../../assets/mockApi.json');
    return response;
  } catch (e) {
    return Promise.reject(e);
  }
});

//!NOTE: We keep the data in a map for better performance: get is O(1)
const convertVehiclesArrayToMap = (vehicles: Vehicle[]): VehiclesByIdMap => {
  return vehicles?.reduce((map: VehiclesByIdMap, vehicle: Vehicle) => {
    map[vehicle.id] = { id: vehicle.id, ...vehicle.telemetry };
    return map;
  }, {});
};

export const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    updateTelemetryData: (state: VehiclesState, action: PayloadAction<Vehicle[]>) => {
      const vehicles = action.payload;

      vehicles.forEach((vehicle) => {
        const currentState = state.allVehicles[vehicle.id];
        state.allVehicles[vehicle.id] = { ...currentState, ...vehicle.telemetry };
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.allVehicles = convertVehiclesArrayToMap(action.payload.vehicles);
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateTelemetryData } = vehiclesSlice.actions;

export default vehiclesSlice.reducer;
