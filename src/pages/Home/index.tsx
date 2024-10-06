import React from 'react';
import { createNotifications } from '../../utils/utils';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateTelemetryData } from '../../features/vehicles/vehiclesSlice';
import { WorkerEventType } from '../../workers/types';
import { updateNotifications } from '../../features/notifications/notificationsSlice';
import { Outlet } from 'react-router-dom';
import { selectAllVehicles } from '../../features/vehicles/selectors';

const Home = () => {
  const dispatch = useAppDispatch();
  const [worker, setWorker] = React.useState<Worker>();
  const [startedPolling, setStartedPolling] = React.useState(false);
  const allVehicles = useAppSelector(selectAllVehicles);

  React.useEffect(() => {
    // !NOTE: Assemble the full URL to the worker.ts, relative to this file
    const myWorker = new Worker(new URL('../../workers/worker.ts', import.meta.url));

    myWorker.onmessage = (event: MessageEvent<WorkerEventType>) => {
      // console.log('Received result from worker:', event.data);

      const { type, payload } = event.data;

      switch (type) {
        case 'latestStatus': {
          dispatch(updateTelemetryData(payload.vehicles));
          break;
        }
        // !NOTE: Ideally this error should be reported internally and suppressed to the user
        case 'error': {
          console.log(`error: ${payload}`);
          break;
        }
        default:
          break;
      }
    };
    setWorker(myWorker);

    return () => {
      //!NOTE: Terminate work when component unmount to avoid memory leak
      console.log('TERMINATE WORKER');
      myWorker.terminate();
    };
  }, [dispatch]);

  React.useEffect(() => {
    const allVehicleIds = Array.from(Object.keys(allVehicles));
    //!NOTE: Assures we start the polling only once
    if (worker && allVehicleIds.length > 0 && !startedPolling) {
      worker.postMessage({ type: 'fetchUpdates', payload: { allVehicleIds } });
      setStartedPolling(true);
    }
  }, [worker, allVehicles, startedPolling]);

  React.useEffect(() => {
    //!NOTE: Every time vehicles are updated we need to re-check all data and update notifications
    const notifications = createNotifications(allVehicles);
    dispatch(updateNotifications(notifications));
  }, [allVehicles, dispatch]);

  //!NOTE: Outlet takes care of rendering /dashboard by default
  return <Outlet />;
};

export default Home;
