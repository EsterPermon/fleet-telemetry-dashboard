import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export const selectAllNotifications = (state: RootState) => state.notifications.allNotifications;

export const selectNotificationsLength = (state: RootState) => Object.keys(state.notifications.allNotifications).length;

export const selectVehicleIdsWithActiveNotifications = (state: RootState) =>
  Array.from(Object.keys(state.notifications.allNotifications));

export const selectHasNotifications = (state: RootState) =>
  Boolean(Object.keys(state.notifications.allNotifications).length);

export const selectNotificationsByVehicleId = (id: string) =>
  createSelector(selectAllNotifications, (allNotifications) => allNotifications[id]);
