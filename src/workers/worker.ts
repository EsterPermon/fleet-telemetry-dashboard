import { Coordinates, TelemetryData, TelemetryKeysType, Vehicle } from '../features/vehicles/types';
import { TELEMETRY_KEYS } from '../utils/constants';
import { MainThreadEventType } from './types';

// !NOTE: Ideally we would generate new values consistenly based on the current ones
export const generateRandomTelemetryValue = (key: TelemetryKeysType): number | boolean | Coordinates => {
  switch (key) {
    case 'speed':
      return Math.floor(Math.random() * 151); // !NOTE: Between 0 and 150 km/h
    case 'batteryLevel':
      return Math.floor(Math.random() * 101); // !NOTE: Between 0 and 100%
    case 'tirePressure':
      return Math.floor(Math.random() * 31 + 20); // !NOTE: Between 20 and 50 psi
    case 'motorEfficiency':
      return Math.floor(Math.random() * 101); // !NOTE: Between 0 and 100%
    case 'regenerativeBraking':
      return Math.random() > 0.5; // !NOTE: Boolean value
    case 'batteryTemperature':
      return Math.floor(Math.random() * 71 - 10); // !NOTE: Between -10°C and 60°C
    case 'energyConsumption':
      return Math.floor(Math.random() * 41 + 10); // !NOTE: Between 10 and 50 kWh/100 km
    case 'gpsLocation':
      return {
        lat: Math.random() * 180 - 90, // !NOTE: Between -90 and 90
        lon: Math.random() * 360 - 180, // !NOTE: Between -180 and 180
      };
    case 'suspensionStatus':
      return Math.floor(Math.random() * 101); // !NOTE: Between 0 and 100%
    case 'odometer':
      return Math.floor(Math.random() * 60001); // !NOTE: Between 0 and 60,000 km
    case 'chargingStatus':
      return Math.random() > 0.5; // !NOTE: Boolean value
    case 'temperature':
      return Math.floor(Math.random() * 71 - 20); // !NOTE: Between -20°C and 50°C
    default:
      throw new Error(`Unknown telemetry key ${key}`);
  }
};

const pickRandomVehicles = (vehicleIds: string[]): string[] => {
  const numberOfVehiclesToPick = Math.floor(Math.random() * vehicleIds.length) + 1;
  const shuffledVehicles = vehicleIds.sort(() => 0.5 - Math.random());
  return shuffledVehicles.slice(0, numberOfVehiclesToPick);
};

const pickRandomTelemetryFields = (): TelemetryKeysType[] => {
  const numberOfFieldsToPick = Math.floor(Math.random() * TELEMETRY_KEYS.length) + 1;
  const shuffledFields = TELEMETRY_KEYS.sort(() => 0.5 - Math.random());
  return shuffledFields.slice(0, numberOfFieldsToPick);
};

const fetchTelemetryDataUpdates = async (allVehicleIds: string[]): Promise<Vehicle[]> => {
  return new Promise((resolve, _reject) => {
    // !NOTE: This timeout is used to simulate a real http request
    setTimeout(() => {
      const selectedVehicles = pickRandomVehicles(allVehicleIds);
      const selectedFields = pickRandomTelemetryFields();
      resolve(
        selectedVehicles.map((vehicleId) => {
          const newTelemetryData = selectedFields.reduce((acc: TelemetryData, field: TelemetryKeysType) => {
            const newValue = generateRandomTelemetryValue(field);
            acc = { ...acc, [field]: newValue };
            return acc;
          }, {} as TelemetryData);

          return { id: vehicleId, telemetry: newTelemetryData };
        })
      );
    }, 1000);
  });
};

onmessage = (event: MessageEvent<MainThreadEventType>) => {
  // console.log('Received message from the main thread:', event.data);

  const { type, payload } = event.data;
  switch (type) {
    //!NOTE: Every 3 secs we pick a random amount of cars and fields and generate new values to sumulate real events
    case 'fetchUpdates': {
      try {
        setInterval(async () => {
          const updatedVehicles = await fetchTelemetryDataUpdates(payload.allVehicleIds);
          postMessage({ type: 'latestStatus', payload: { vehicles: updatedVehicles } });
        }, 3000);
      } catch (error) {
        if (error instanceof Error) {
          postMessage({ type: 'error', payload: error.message });
        }
      }
      break;
    }
    default:
      break;
  }
};
