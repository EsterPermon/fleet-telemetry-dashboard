import { TelemetryKeysType } from '../features/vehicles/types';

export const THRESHOLDS: Record<string, number> = {
  MAX_SPEED: 120,
  LOW_BATTERY: 20,
  HIGH_TIRE_PRESSURE: 40,
  LOW_TIRE_PRESSURE: 30,
  LOW_MOTOR_EFFICIENCY: 70,
  LOW_BATTERY_TEMPERATURE: 0,
  HIGH_BATTERY_TEMPERATURE: 50,
  HIGH_ENERGY_CONSUMPTION: 35,
  LOW_SUSPENSION_STATUS: 60,
  ODOMETER_CHECK_INTERVAL: 10000,
  LOW_TEMPERATURE: -10,
  HIGH_TEMPERATURE: 40,
};

export const TELEMETRY_KEYS: TelemetryKeysType[] = [
  'speed',
  'batteryLevel',
  'tirePressure',
  'motorEfficiency',
  'regenerativeBraking',
  'batteryTemperature',
  'energyConsumption',
  'gpsLocation',
  'suspensionStatus',
  'odometer',
  'chargingStatus',
  'temperature',
];
