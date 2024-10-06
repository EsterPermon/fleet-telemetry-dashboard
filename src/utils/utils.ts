import formatcoords from 'formatcoords';
import { TelemetryKeysType, VehicleData, VehiclesByIdMap } from '../features/vehicles/types';
import { Notification, NotificationsByVehicleMap } from '../features/notifications/types';
import { THRESHOLDS } from './constants';

export const formatCoordinates = (lat: number, lon: number) => {
  return formatcoords(lon, lat).format('DD MM ss X', {
    latLonSeparator: ', ',
    decimalPlaces: 0,
  });
};

export const sortVehiclesByKey = (
  vehicleA: VehicleData,
  vehicleB: VehicleData,
  field: TelemetryKeysType,
  order: 'asc' | 'desc'
) => {
  const aValue = vehicleA[field];
  const bValue = vehicleB[field];

  if (typeof aValue === 'number' && typeof bValue === 'number') {
    return order === 'asc' ? aValue - bValue : bValue - aValue;
  }

  if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
    return order === 'asc' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
  }

  //!NOTE: ignoring sort if field is gpsLocation or id
  return 0;
};

export const checkThresholds = (vehicleData: VehicleData): Notification[] => {
  const notifications: Notification[] = [];

  if (vehicleData.speed > THRESHOLDS.MAX_SPEED) {
    notifications.push({
      dataPoint: 'speed',
      value: vehicleData.speed,
      type: 'highSpeed',
    });
  }

  if (vehicleData.batteryLevel < THRESHOLDS.LOW_BATTERY) {
    notifications.push({
      dataPoint: 'batteryLevel',
      value: vehicleData.batteryLevel,
      type: 'lowBattery',
    });
  }

  if (vehicleData.tirePressure < THRESHOLDS.LOW_TIRE_PRESSURE) {
    notifications.push({
      dataPoint: 'tirePressure',
      value: vehicleData.tirePressure,
      type: 'lowTirePressure',
    });
  } else if (vehicleData.tirePressure > THRESHOLDS.HIGH_TIRE_PRESSURE) {
    notifications.push({
      dataPoint: 'tirePressure',
      value: vehicleData.tirePressure,
      type: 'highTirePressure',
    });
  }

  if (vehicleData.motorEfficiency < THRESHOLDS.LOW_MOTOR_EFFICIENCY) {
    notifications.push({
      dataPoint: 'motorEfficiency',
      value: vehicleData.motorEfficiency,
      type: 'lowMotorEfficiency',
    });
  }

  if (vehicleData.batteryTemperature < THRESHOLDS.LOW_BATTERY_TEMPERATURE) {
    notifications.push({
      dataPoint: 'batteryTemperature',
      value: vehicleData.batteryTemperature,
      type: 'highBatteryTemperature',
    });
  } else if (vehicleData.batteryTemperature > THRESHOLDS.HIGH_BATTERY_TEMPERATURE) {
    notifications.push({
      dataPoint: 'batteryTemperature',
      value: vehicleData.batteryTemperature,
      type: 'lowBatteryTemperature',
    });
  }

  if (vehicleData.energyConsumption > THRESHOLDS.HIGH_ENERGY_CONSUMPTION) {
    notifications.push({
      dataPoint: 'energyConsumption',
      value: vehicleData.energyConsumption,
      type: 'highEnergyConsumption',
    });
  }

  if (vehicleData.suspensionStatus < THRESHOLDS.LOW_SUSPENSION_STATUS) {
    notifications.push({
      dataPoint: 'suspensionStatus',
      value: vehicleData.suspensionStatus,
      type: 'lowSuspensionStatus',
    });
  }

  // !NOTE: warn everytime odometer reaches a 10k km count to maintenance purposes
  if (vehicleData.odometer % THRESHOLDS.ODOMETER_CHECK_INTERVAL === 0 && vehicleData.odometer !== 0) {
    notifications.push({
      dataPoint: 'odometer',
      value: vehicleData.odometer,
      type: 'odometerValue',
    });
  }

  if (vehicleData.temperature < THRESHOLDS.LOW_TEMPERATURE) {
    notifications.push({
      dataPoint: 'temperature',
      value: vehicleData.temperature,
      type: 'lowTemperature',
    });
  } else if (vehicleData.temperature > THRESHOLDS.HIGH_TEMPERATURE) {
    notifications.push({
      dataPoint: 'temperature',
      value: vehicleData.temperature,
      type: 'highTemperature',
    });
  }

  return notifications;
};

export const createNotifications = (vehicles: VehiclesByIdMap): NotificationsByVehicleMap => {
  // !NOTE: Notifications are created, counted and grouped based on the vehicle.
  return Array.from(Object.values(vehicles)).reduce((map, vehicle) => {
    const vehicleNotifications = checkThresholds(vehicle);

    if (vehicleNotifications.length > 0) {
      map[vehicle.id] = vehicleNotifications;
    }

    return map;
  }, {} as NotificationsByVehicleMap);
};

export const isThresholdExceeded = (key: TelemetryKeysType, value: number): boolean => {
  switch (key) {
    case 'speed':
      return value > THRESHOLDS.MAX_SPEED;
    case 'batteryLevel':
      return value < THRESHOLDS.LOW_BATTERY;
    case 'tirePressure':
      return value > THRESHOLDS.HIGH_TIRE_PRESSURE || value < THRESHOLDS.LOW_TIRE_PRESSURE;
    case 'motorEfficiency':
      return value < THRESHOLDS.LOW_MOTOR_EFFICIENCY;
    case 'batteryTemperature':
      return value > THRESHOLDS.HIGH_BATTERY_TEMPERATURE || value < THRESHOLDS.LOW_BATTERY_TEMPERATURE;
    case 'energyConsumption':
      return value > THRESHOLDS.HIGH_ENERGY_CONSUMPTION;
    case 'suspensionStatus':
      return value < THRESHOLDS.LOW_SUSPENSION_STATUS;
    case 'odometer':
      return value % THRESHOLDS.ODOMETER_CHECK_INTERVAL === 0 && value !== 0;
    case 'temperature':
      return value > THRESHOLDS.HIGH_TEMPERATURE || value < THRESHOLDS.LOW_TEMPERATURE;
    default:
      return false;
  }
};
