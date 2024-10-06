import { TelemetryKeysType, VehicleData } from '../features/vehicles/types';
import { THRESHOLDS } from './constants';
import { checkThresholds, isThresholdExceeded, sortVehiclesByKey } from './utils';

describe('sortVehiclesByKey', () => {
  let vehicleA: VehicleData;
  let vehicleB: VehicleData;

  beforeEach(() => {
    vehicleA = {
      id: '1',
      speed: 100,
      batteryLevel: 80,
      tirePressure: 35,
      motorEfficiency: 90,
      regenerativeBraking: true,
      batteryTemperature: 40,
      energyConsumption: 20,
      gpsLocation: { lat: 0, lon: 0 },
      suspensionStatus: 80,
      odometer: 5000,
      chargingStatus: false,
      temperature: 25,
    };

    vehicleB = {
      id: '2',
      speed: 120,
      batteryLevel: 60,
      tirePressure: 38,
      motorEfficiency: 85,
      regenerativeBraking: false,
      batteryTemperature: 35,
      energyConsumption: 25,
      gpsLocation: { lat: 0, lon: 0 },
      suspensionStatus: 70,
      odometer: 10000,
      chargingStatus: true,
      temperature: 30,
    };
  });

  it('should sort numeric fields in ascending order', () => {
    expect(sortVehiclesByKey(vehicleA, vehicleB, 'speed', 'asc')).toBeLessThan(0);
    expect(sortVehiclesByKey(vehicleA, vehicleB, 'batteryLevel', 'asc')).toBeGreaterThan(0);
    expect(sortVehiclesByKey(vehicleA, vehicleB, 'tirePressure', 'asc')).toBeLessThan(0);
  });

  it('should sort numeric fields in descending order', () => {
    expect(sortVehiclesByKey(vehicleA, vehicleB, 'speed', 'desc')).toBeGreaterThan(0);
    expect(sortVehiclesByKey(vehicleA, vehicleB, 'batteryLevel', 'desc')).toBeLessThan(0);
    expect(sortVehiclesByKey(vehicleA, vehicleB, 'tirePressure', 'desc')).toBeGreaterThan(0);
  });

  it('should sort boolean fields in ascending order', () => {
    expect(sortVehiclesByKey(vehicleA, vehicleB, 'regenerativeBraking', 'asc')).toBeGreaterThan(0);
    expect(sortVehiclesByKey(vehicleA, vehicleB, 'chargingStatus', 'asc')).toBeLessThan(0);
  });

  it('should sort boolean fields in descending order', () => {
    expect(sortVehiclesByKey(vehicleA, vehicleB, 'regenerativeBraking', 'desc')).toBeLessThan(0);
    expect(sortVehiclesByKey(vehicleA, vehicleB, 'chargingStatus', 'desc')).toBeGreaterThan(0);
  });

  it('should return 0 for unsupported fields like gpsLocation', () => {
    expect(sortVehiclesByKey(vehicleA, vehicleB, 'gpsLocation', 'asc')).toBe(0);
    expect(sortVehiclesByKey(vehicleA, vehicleB, 'gpsLocation', 'desc')).toBe(0);
  });

  it('should return 0 if values are undefined', () => {
    // !NOTE: casting to any to run test without typing errors
    const vehicleAWithUndefined: VehicleData = { ...vehicleA, speed: undefined as any };
    expect(sortVehiclesByKey(vehicleAWithUndefined, vehicleB, 'speed', 'asc')).toBe(0);
    expect(sortVehiclesByKey(vehicleAWithUndefined, vehicleB, 'speed', 'desc')).toBe(0);
  });
});

describe('checkThresholds', () => {
  let vehicleData: VehicleData;
  beforeEach(() => {
    vehicleData = {
      id: '',
      speed: THRESHOLDS.MAX_SPEED,
      batteryLevel: THRESHOLDS.LOW_BATTERY,
      tirePressure: THRESHOLDS.LOW_TIRE_PRESSURE,
      motorEfficiency: THRESHOLDS.LOW_MOTOR_EFFICIENCY,
      regenerativeBraking: false,
      batteryTemperature: THRESHOLDS.LOW_BATTERY_TEMPERATURE,
      energyConsumption: THRESHOLDS.HIGH_ENERGY_CONSUMPTION,
      gpsLocation: { lat: 0, lon: 0 },
      suspensionStatus: THRESHOLDS.LOW_SUSPENSION_STATUS,
      odometer: THRESHOLDS.ODOMETER_CHECK_INTERVAL - 1,
      chargingStatus: false,
      temperature: THRESHOLDS.LOW_TEMPERATURE,
    };
  });

  it('should generate a high speed notification if speed exceeds the threshold', () => {
    vehicleData.speed = THRESHOLDS.MAX_SPEED + 1;
    const notifications = checkThresholds(vehicleData);
    expect(notifications).toEqual([
      {
        dataPoint: 'speed',
        value: vehicleData.speed,
        type: 'highSpeed',
      },
    ]);
  });

  it('should generate a low battery notification if battery level is below the threshold', () => {
    vehicleData.batteryLevel = THRESHOLDS.LOW_BATTERY - 1;
    const notifications = checkThresholds(vehicleData);
    expect(notifications).toEqual([
      {
        dataPoint: 'batteryLevel',
        value: vehicleData.batteryLevel,
        type: 'lowBattery',
      },
    ]);
  });

  it('should generate a low tire pressure notification if tire pressure is below the threshold', () => {
    vehicleData.tirePressure = THRESHOLDS.LOW_TIRE_PRESSURE - 1;
    const notifications = checkThresholds(vehicleData);
    expect(notifications).toEqual([
      {
        dataPoint: 'tirePressure',
        value: vehicleData.tirePressure,
        type: 'lowTirePressure',
      },
    ]);
  });

  it('should generate a high tire pressure notification if tire pressure exceeds the threshold', () => {
    vehicleData.tirePressure = THRESHOLDS.HIGH_TIRE_PRESSURE + 1;
    const notifications = checkThresholds(vehicleData);
    expect(notifications).toEqual([
      {
        dataPoint: 'tirePressure',
        value: vehicleData.tirePressure,
        type: 'highTirePressure',
      },
    ]);
  });

  it('should generate a low motor efficiency notification if motor efficiency is below the threshold', () => {
    vehicleData.motorEfficiency = THRESHOLDS.LOW_MOTOR_EFFICIENCY - 1;
    const notifications = checkThresholds(vehicleData);
    expect(notifications).toEqual([
      {
        dataPoint: 'motorEfficiency',
        value: vehicleData.motorEfficiency,
        type: 'lowMotorEfficiency',
      },
    ]);
  });

  it('should generate a low battery temperature notification if battery temperature is below the threshold', () => {
    vehicleData.batteryTemperature = THRESHOLDS.LOW_BATTERY_TEMPERATURE - 1;
    const notifications = checkThresholds(vehicleData);
    expect(notifications).toEqual([
      {
        dataPoint: 'batteryTemperature',
        value: vehicleData.batteryTemperature,
        type: 'highBatteryTemperature',
      },
    ]);
  });

  it('should generate a high battery temperature notification if battery temperature exceeds the threshold', () => {
    vehicleData.batteryTemperature = THRESHOLDS.HIGH_BATTERY_TEMPERATURE + 1;
    const notifications = checkThresholds(vehicleData);
    expect(notifications).toEqual([
      {
        dataPoint: 'batteryTemperature',
        value: vehicleData.batteryTemperature,
        type: 'lowBatteryTemperature',
      },
    ]);
  });

  it('should generate a high energy consumption notification if energy consumption exceeds the threshold', () => {
    vehicleData.energyConsumption = THRESHOLDS.HIGH_ENERGY_CONSUMPTION + 1;
    const notifications = checkThresholds(vehicleData);
    expect(notifications).toEqual([
      {
        dataPoint: 'energyConsumption',
        value: vehicleData.energyConsumption,
        type: 'highEnergyConsumption',
      },
    ]);
  });

  it('should generate a low suspension status notification if suspension status is below the threshold', () => {
    vehicleData.suspensionStatus = THRESHOLDS.LOW_SUSPENSION_STATUS - 1;
    const notifications = checkThresholds(vehicleData);
    expect(notifications).toEqual([
      {
        dataPoint: 'suspensionStatus',
        value: vehicleData.suspensionStatus,
        type: 'lowSuspensionStatus',
      },
    ]);
  });

  it('should generate an odometer notification if odometer reaches the check interval', () => {
    vehicleData.odometer = THRESHOLDS.ODOMETER_CHECK_INTERVAL;
    const notifications = checkThresholds(vehicleData);
    expect(notifications).toEqual([
      {
        dataPoint: 'odometer',
        value: vehicleData.odometer,
        type: 'odometerValue',
      },
    ]);
  });

  it('should generate a low temperature notification if temperature is below the threshold', () => {
    vehicleData.temperature = THRESHOLDS.LOW_TEMPERATURE - 1;
    const notifications = checkThresholds(vehicleData);
    expect(notifications).toEqual([
      {
        dataPoint: 'temperature',
        value: vehicleData.temperature,
        type: 'lowTemperature',
      },
    ]);
  });

  it('should generate a high temperature notification if temperature exceeds the threshold', () => {
    vehicleData.temperature = THRESHOLDS.HIGH_TEMPERATURE + 1;
    const notifications = checkThresholds(vehicleData);
    expect(notifications).toEqual([
      {
        dataPoint: 'temperature',
        value: vehicleData.temperature,
        type: 'highTemperature',
      },
    ]);
  });

  it('should generate multiple notifications if multiple thresholds are exceeded', () => {
    vehicleData.speed = THRESHOLDS.MAX_SPEED + 10;
    vehicleData.batteryLevel = THRESHOLDS.LOW_BATTERY - 5;
    vehicleData.tirePressure = THRESHOLDS.HIGH_TIRE_PRESSURE + 1;

    const notifications = checkThresholds(vehicleData);
    expect(notifications).toEqual([
      {
        dataPoint: 'speed',
        value: vehicleData.speed,
        type: 'highSpeed',
      },
      {
        dataPoint: 'batteryLevel',
        value: vehicleData.batteryLevel,
        type: 'lowBattery',
      },
      {
        dataPoint: 'tirePressure',
        value: vehicleData.tirePressure,
        type: 'highTirePressure',
      },
    ]);
  });

  it('should return an empty array if no thresholds are exceeded', () => {
    const notifications = checkThresholds(vehicleData);
    expect(notifications).toEqual([]);
  });
});

describe('isThresholdExceeded', () => {
  it('should detect speed exceeding the threshold', () => {
    expect(isThresholdExceeded('speed', THRESHOLDS.MAX_SPEED + 1)).toBe(true);
    expect(isThresholdExceeded('speed', THRESHOLDS.MAX_SPEED)).toBe(false);
  });

  it('should detect battery level below the threshold', () => {
    expect(isThresholdExceeded('batteryLevel', THRESHOLDS.LOW_BATTERY - 1)).toBe(true);
    expect(isThresholdExceeded('batteryLevel', THRESHOLDS.LOW_BATTERY)).toBe(false);
  });

  it('should detect tire pressure exceeding or below the threshold', () => {
    expect(isThresholdExceeded('tirePressure', THRESHOLDS.HIGH_TIRE_PRESSURE + 1)).toBe(true);
    expect(isThresholdExceeded('tirePressure', THRESHOLDS.LOW_TIRE_PRESSURE - 1)).toBe(true);
    expect(isThresholdExceeded('tirePressure', THRESHOLDS.HIGH_TIRE_PRESSURE)).toBe(false);
    expect(isThresholdExceeded('tirePressure', THRESHOLDS.LOW_TIRE_PRESSURE)).toBe(false);
  });

  it('should detect motor efficiency below the threshold', () => {
    expect(isThresholdExceeded('motorEfficiency', THRESHOLDS.LOW_MOTOR_EFFICIENCY - 1)).toBe(true);
    expect(isThresholdExceeded('motorEfficiency', THRESHOLDS.LOW_MOTOR_EFFICIENCY)).toBe(false);
  });

  it('should detect battery temperature exceeding or below the threshold', () => {
    expect(isThresholdExceeded('batteryTemperature', THRESHOLDS.HIGH_BATTERY_TEMPERATURE + 1)).toBe(true);
    expect(isThresholdExceeded('batteryTemperature', THRESHOLDS.LOW_BATTERY_TEMPERATURE - 1)).toBe(true);
    expect(isThresholdExceeded('batteryTemperature', THRESHOLDS.HIGH_BATTERY_TEMPERATURE)).toBe(false);
    expect(isThresholdExceeded('batteryTemperature', THRESHOLDS.LOW_BATTERY_TEMPERATURE)).toBe(false);
  });

  it('should detect energy consumption exceeding the threshold', () => {
    expect(isThresholdExceeded('energyConsumption', THRESHOLDS.HIGH_ENERGY_CONSUMPTION + 1)).toBe(true);
    expect(isThresholdExceeded('energyConsumption', THRESHOLDS.HIGH_ENERGY_CONSUMPTION)).toBe(false);
  });

  it('should detect suspension status below the threshold', () => {
    expect(isThresholdExceeded('suspensionStatus', THRESHOLDS.LOW_SUSPENSION_STATUS - 1)).toBe(true);
    expect(isThresholdExceeded('suspensionStatus', THRESHOLDS.LOW_SUSPENSION_STATUS)).toBe(false);
  });

  it('should detect when odometer reaches the check interval', () => {
    expect(isThresholdExceeded('odometer', THRESHOLDS.ODOMETER_CHECK_INTERVAL)).toBe(true);
    expect(isThresholdExceeded('odometer', THRESHOLDS.ODOMETER_CHECK_INTERVAL + 1)).toBe(false);
    expect(isThresholdExceeded('odometer', 0)).toBe(false);
  });

  it('should detect temperature exceeding or below the threshold', () => {
    expect(isThresholdExceeded('temperature', THRESHOLDS.HIGH_TEMPERATURE + 1)).toBe(true);
    expect(isThresholdExceeded('temperature', THRESHOLDS.LOW_TEMPERATURE - 1)).toBe(true);
    expect(isThresholdExceeded('temperature', THRESHOLDS.HIGH_TEMPERATURE)).toBe(false);
    expect(isThresholdExceeded('temperature', THRESHOLDS.LOW_TEMPERATURE)).toBe(false);
  });

  it('should return false for an unknown telemetry key', () => {
    expect(isThresholdExceeded('unknown' as TelemetryKeysType, 100)).toBe(false);
  });
});
