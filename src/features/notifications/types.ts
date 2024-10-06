import { TelemetryKeysType } from '../vehicles/types';

export interface Notification {
  dataPoint: TelemetryKeysType;
  value: number | boolean;
  type: string;
}

export type NotificationsByVehicleMap = Record<string, Notification[]>;
