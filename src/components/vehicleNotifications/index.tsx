import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../store';
import { selectNotificationsByVehicleId } from '../../features/notifications/selectors';
import styles from './styles.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import React from 'react';
import { Trans } from 'react-i18next';

const VehicleNotifications = (props: { vehicleId: string }) => {
  const { vehicleId } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const notifications = useAppSelector(React.useMemo(() => selectNotificationsByVehicleId(vehicleId), [vehicleId]));

  if (!notifications?.length) {
    return null;
  }

  const handleOnClick = () => {
    const vehicleDetailsRoute = `/vehicle/${vehicleId}`;
    //!NOTE: Click on notification redirects to vehiche detail route, unless we are already on it
    if (location.pathname !== vehicleDetailsRoute) {
      navigate(vehicleDetailsRoute);
    }
  };

  return (
    <div className={styles.notificationContainer} onClick={handleOnClick}>
      <div className={styles.notificationHeader}>
        <span>{t('dashboard.dataPointTitle.id')}: </span>
        {vehicleId}
      </div>
      <div className={styles.notificationBody}>
        {notifications.map((notification) => {
          return (
            <div className={styles.message} key={`vehicle_${vehicleId}_notification_${notification.dataPoint}`}>
              <span className={styles.title}>{t(`dashboard.dataPointTitle.${notification.dataPoint}`)}: </span>
              {/* //!NOTE: Highlight the important values within translation */}
              <Trans
                i18nKey={`dashboard.notifications.message.${notification.dataPoint}.${notification.type}`}
                values={{ value: notification.value }}
                components={{ bold: <strong /> }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VehicleNotifications;
