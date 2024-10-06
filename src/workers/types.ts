import { Vehicle } from '../features/vehicles/types';

type FetchUpdates = { type: 'fetchUpdates'; payload: { allVehicleIds: string[] } };
export type MainThreadEventType = FetchUpdates;

type SendLatestStatus = { type: 'latestStatus'; payload: { vehicles: Vehicle[] } };
type ReportError = { type: 'error'; payload: string };
export type WorkerEventType = SendLatestStatus | ReportError;
