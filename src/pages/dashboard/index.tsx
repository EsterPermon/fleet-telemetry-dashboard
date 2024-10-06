import React from 'react';
import { useTranslation } from 'react-i18next';
import VehiclesTable from '../../components/vehiclesTable';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectVehiclesError, selectIsLoadingVehicles, selectAllVehicles } from '../../features/vehicles/selectors';
import { fetchVehicles } from '../../features/vehicles/vehiclesSlice';
import { useNavigate } from 'react-router-dom';
import NotificationBellIcon from '../../assets/icons/notification-bell-icon.svg';
import { selectNotificationsLength } from '../../features/notifications/selectors';
import IconButton from '../../components/UI/iconButton';
import styles from './styles.module.css';

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const vehiclesError = useAppSelector(selectVehiclesError);
  const isLoadingVehicles = useAppSelector(selectIsLoadingVehicles);
  const notificationsLength = useAppSelector(selectNotificationsLength);
  const allVehicles = useAppSelector(selectAllVehicles);

  React.useEffect(() => {
    if (Object.keys(allVehicles).length === 0) {
      dispatch(fetchVehicles());
    }
  }, [dispatch, allVehicles]);

  if (isLoadingVehicles) {
    return <div className={styles.loadingVehiclesMessage}>{t('dashboard.loadingMessage')}</div>;
  }

  if (vehiclesError) {
    return (
      <div className={styles.errorVehiclesMessage}>
        {t('dashboard.errorMessage', {
          vehiclesError,
        })}
      </div>
    );
  }
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <IconButton
          onClick={() => navigate('/notifications')}
          label={`${notificationsLength}`}
          iconAlt="notification-bell-icon"
          icon={NotificationBellIcon}
        />
      </div>
      <VehiclesTable />
    </div>
  );
};

export default Dashboard;
