import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { NotificationsByVehicleMap } from './types';

interface NotificationsState {
  allNotifications: NotificationsByVehicleMap;
}

const initialState: NotificationsState = {
  allNotifications: {},
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    updateNotifications: (state: NotificationsState, action: PayloadAction<NotificationsByVehicleMap>) => {
      state.allNotifications = action.payload;
    },
  },
});

export const { updateNotifications } = notificationsSlice.actions;

export default notificationsSlice.reducer;
