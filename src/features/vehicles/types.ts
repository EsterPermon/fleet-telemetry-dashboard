export interface Coordinates {
  lat: number;
  lon: number;
}
export interface TelemetryData {
  speed: number;
  batteryLevel: number;
  tirePressure: number;
  motorEfficiency: number;
  regenerativeBraking: boolean;
  batteryTemperature: number;
  energyConsumption: number;
  gpsLocation: Coordinates;
  suspensionStatus: number;
  odometer: number;
  chargingStatus: boolean;
  temperature: number;
}

export interface Vehicle {
  id: string;
  telemetry: TelemetryData;
}

export type VehicleData = TelemetryData & { id: string };

export type VehiclesByIdMap = Record<string, VehicleData>;

export type TelemetryKeysType = keyof TelemetryData;
