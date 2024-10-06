import { TelemetryKeysType } from '../features/vehicles/types';
import { generateRandomTelemetryValue } from './worker';

// !NOTE: Generating random values 10 times to assure consistency
describe('generateRandomTelemetryValue', () => {
  it('should generate a speed value between 0 and 150 km/h', () => {
    for (let i = 0; i < 10; i++) {
      const value = generateRandomTelemetryValue('speed') as number;
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(150);
    }
  });

  it('should generate a battery level between 0 and 100%', () => {
    for (let i = 0; i < 10; i++) {
      const value = generateRandomTelemetryValue('batteryLevel') as number;
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    }
  });

  it('should generate a tire pressure between 20 and 50 psi', () => {
    for (let i = 0; i < 10; i++) {
      const value = generateRandomTelemetryValue('tirePressure') as number;
      expect(value).toBeGreaterThanOrEqual(20);
      expect(value).toBeLessThanOrEqual(50);
    }
  });

  it('should generate a motor efficiency between 0 and 100%', () => {
    for (let i = 0; i < 10; i++) {
      const value = generateRandomTelemetryValue('motorEfficiency') as number;
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    }
  });

  it('should generate a regenerative braking status as a boolean', () => {
    for (let i = 0; i < 10; i++) {
      const value = generateRandomTelemetryValue('regenerativeBraking') as boolean;
      expect(typeof value).toBe('boolean');
    }
  });

  it('should generate a battery temperature between -10°C and 60°C', () => {
    for (let i = 0; i < 10; i++) {
      const value = generateRandomTelemetryValue('batteryTemperature') as number;
      expect(value).toBeGreaterThanOrEqual(-10);
      expect(value).toBeLessThanOrEqual(60);
    }
  });

  it('should generate energy consumption between 10 and 50 kWh/10 km', () => {
    for (let i = 0; i < 10; i++) {
      const value = generateRandomTelemetryValue('energyConsumption') as number;
      expect(value).toBeGreaterThanOrEqual(10);
      expect(value).toBeLessThanOrEqual(50);
    }
  });

  it('should generate a GPS location with latitude between -90 and 90, and longitude between -180 and 180', () => {
    for (let i = 0; i < 10; i++) {
      const value = generateRandomTelemetryValue('gpsLocation') as { lat: number; lon: number };
      expect(value.lat).toBeGreaterThanOrEqual(-90);
      expect(value.lat).toBeLessThanOrEqual(90);
      expect(value.lon).toBeGreaterThanOrEqual(-180);
      expect(value.lon).toBeLessThanOrEqual(180);
    }
  });

  it('should generate a suspension status between 0 and 100%', () => {
    for (let i = 0; i < 10; i++) {
      const value = generateRandomTelemetryValue('suspensionStatus') as number;
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    }
  });

  it('should generate an odometer value between 0 and 60,000 km', () => {
    for (let i = 0; i < 10; i++) {
      const value = generateRandomTelemetryValue('odometer') as number;
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(60000);
    }
  });

  it('should generate a charging status as a boolean', () => {
    for (let i = 0; i < 10; i++) {
      const value = generateRandomTelemetryValue('chargingStatus') as boolean;
      expect(typeof value).toBe('boolean');
    }
  });

  it('should generate a temperature between -20°C and 50°C', () => {
    for (let i = 0; i < 10; i++) {
      const value = generateRandomTelemetryValue('temperature') as number;
      expect(value).toBeGreaterThanOrEqual(-20);
      expect(value).toBeLessThanOrEqual(50);
    }
  });

  it('should throw an error for an unknown telemetry key', () => {
    expect(() => generateRandomTelemetryValue('unknown' as TelemetryKeysType)).toThrow('Unknown telemetry key');
  });
});
