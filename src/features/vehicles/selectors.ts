import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export const selectVehiclesError = (state: RootState) => state.vehicles.error;

export const selectIsLoadingVehicles = (state: RootState) => state.vehicles.loading;

export const selectAllVehicles = (state: RootState) => state.vehicles.allVehicles;

export const selectVehicleById = (id: string) => createSelector(selectAllVehicles, (allVehicles) => allVehicles[id]);
