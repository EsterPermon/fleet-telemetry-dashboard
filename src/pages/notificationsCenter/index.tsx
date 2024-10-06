import { useTranslation } from 'react-i18next';
import { selectVehicleIdsWithActiveNotifications } from '../../features/notifications/selectors';
import { useAppSelector } from '../../store';
import { useNavigate } from 'react-router-dom';
import VehicleNotifications from '../../components/vehicleNotifications';
import styles from './styles.module.css';
import ChevronLeftIcon from '../../assets/icons/chevron-left.svg';
import IconButton from '../../components/UI/iconButton';

const NotificationsCenter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const vehicleIdsWithActiveNotifications = useAppSelector(selectVehicleIdsWithActiveNotifications);

  return (
    <div className={styles.notificationsCenterContainer}>
      <div className={styles.notificationsCenterHeader}>
        <IconButton onClick={() => navigate('/')} iconAlt="chevronLeft-icon" icon={ChevronLeftIcon} />
      </div>

      {Boolean(vehicleIdsWithActiveNotifications.length) ? (
        <div className={styles.notificationsList}>
          {vehicleIdsWithActiveNotifications.map((vehicleId) => {
            return <VehicleNotifications key={`notifications_${vehicleId}`} vehicleId={vehicleId} />;
          })}
        </div>
      ) : (
        <div className={styles.emptyNotificationsMessage}>{t('dashboard.notifications.noNotificationsMessage')}</div>
      )}
    </div>
  );
};

export default NotificationsCenter;
