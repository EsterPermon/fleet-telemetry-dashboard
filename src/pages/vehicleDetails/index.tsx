import { useTranslation } from 'react-i18next';
import formatcoords from 'formatcoords';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../store';
import { selectVehicleById } from '../../features/vehicles/selectors';
import VehicleNotifications from '../../components/vehicleNotifications';
import ChevronLeftIcon from '../../assets/icons/chevron-left.svg';
import IconButton from '../../components/UI/iconButton';
import styles from './styles.module.css';
import { isThresholdExceeded } from '../../utils/utils';

const VehicleDetails = () => {
  const { t } = useTranslation();
  const { vehicleId = '' } = useParams();
  const vehicleData = useAppSelector(selectVehicleById(vehicleId));
  const navigate = useNavigate();

  if (!vehicleData) {
    return <div className={styles.vehicleNotFound}>{t('dashboard.vehiclesDetails.vehicleNotFoundMessage')}</div>;
  }

  return (
    <>
      <div className={styles.vehicleDetailsPageHeader}>
        <IconButton bgColorType="blue" onClick={() => navigate(-1)} iconAlt="chevronLeft-icon" icon={ChevronLeftIcon} />
      </div>
      <div className={styles.vehicleDetailsPageBody}>
        <div className={styles.vehicleDetailsContainer}>
          <div className={styles.vehicleDetailsHeader}>
            <span>{t('dashboard.dataPointTitle.id')}: </span>
            {vehicleData.id}
          </div>
          <div className={styles.vehicleDataPoint}>
            <span className={styles.vehicleDataPointHeader}>{t('dashboard.dataPointTitle.speed')}: </span>
            <span className={isThresholdExceeded('speed', vehicleData.speed) ? styles.dangerValue : ''}>
              {vehicleData.speed}
            </span>
          </div>
          <div className={styles.vehicleDataPoint}>
            <span className={styles.vehicleDataPointHeader}>{t('dashboard.dataPointTitle.batteryLevel')}: </span>
            <span className={isThresholdExceeded('batteryLevel', vehicleData.batteryLevel) ? styles.dangerValue : ''}>
              {vehicleData.batteryLevel}
            </span>
          </div>
          <div className={styles.vehicleDataPoint}>
            <span className={styles.vehicleDataPointHeader}>{t('dashboard.dataPointTitle.tirePressure')}: </span>
            <span className={isThresholdExceeded('tirePressure', vehicleData.tirePressure) ? styles.dangerValue : ''}>
              {vehicleData.tirePressure}
            </span>
          </div>
          <div className={styles.vehicleDataPoint}>
            <span className={styles.vehicleDataPointHeader}>{t('dashboard.dataPointTitle.motorEfficiency')}: </span>
            <span
              className={isThresholdExceeded('motorEfficiency', vehicleData.motorEfficiency) ? styles.dangerValue : ''}
            >
              {vehicleData.motorEfficiency}
            </span>
          </div>
          <div className={styles.vehicleDataPoint}>
            <span className={styles.vehicleDataPointHeader}>{t('dashboard.dataPointTitle.regenerativeBraking')}: </span>
            {vehicleData.regenerativeBraking ? t('dashboard.dataPointValue.on') : t('dashboard.dataPointValue.off')}
          </div>
          <div className={styles.vehicleDataPoint}>
            <span className={styles.vehicleDataPointHeader}>{t('dashboard.dataPointTitle.batteryTemperature')}: </span>
            <span
              className={
                isThresholdExceeded('batteryTemperature', vehicleData.batteryTemperature) ? styles.dangerValue : ''
              }
            >
              {vehicleData.batteryTemperature}
            </span>
          </div>
          <div className={styles.vehicleDataPoint}>
            <span className={styles.vehicleDataPointHeader}>{t('dashboard.dataPointTitle.energyConsumption')}: </span>
            <span
              className={
                isThresholdExceeded('energyConsumption', vehicleData.energyConsumption) ? styles.dangerValue : ''
              }
            >
              {vehicleData.energyConsumption}
            </span>
          </div>
          <div className={styles.vehicleDataPoint}>
            <span className={styles.vehicleDataPointHeader}>{t('dashboard.dataPointTitle.gpsLocation')}: </span>
            {formatcoords(vehicleData.gpsLocation.lon, vehicleData.gpsLocation.lat).format('DD MM ss X', {
              latLonSeparator: ', ',
              decimalPlaces: 0,
            })}
          </div>
          <div className={styles.vehicleDataPoint}>
            <span className={styles.vehicleDataPointHeader}>{t('dashboard.dataPointTitle.suspensionStatus')}: </span>
            <span
              className={
                isThresholdExceeded('suspensionStatus', vehicleData.suspensionStatus) ? styles.dangerValue : ''
              }
            >
              {vehicleData.suspensionStatus}
            </span>
          </div>
          <div className={styles.vehicleDataPoint}>
            <span className={styles.vehicleDataPointHeader}>{t('dashboard.dataPointTitle.odometer')}: </span>
            <span className={isThresholdExceeded('odometer', vehicleData.odometer) ? styles.dangerValue : ''}>
              {vehicleData.odometer}
            </span>
          </div>
          <div className={styles.vehicleDataPoint}>
            <span className={styles.vehicleDataPointHeader}>{t('dashboard.dataPointTitle.chargingStatus')}: </span>
            {vehicleData.chargingStatus ? t('dashboard.dataPointValue.on') : t('dashboard.dataPointValue.off')}
          </div>
          <div className={styles.vehicleDataPoint}>
            <span className={styles.vehicleDataPointHeader}>{t('dashboard.dataPointTitle.temperature')}: </span>
            <span className={isThresholdExceeded('temperature', vehicleData.temperature) ? styles.dangerValue : ''}>
              {vehicleData.temperature}
            </span>
          </div>
        </div>
        <VehicleNotifications vehicleId={vehicleId} />
      </div>
    </>
  );
};

export default VehicleDetails;
