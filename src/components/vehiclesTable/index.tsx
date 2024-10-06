import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../store';
import { selectAllVehicles } from '../../features/vehicles/selectors';
import { useNavigate } from 'react-router-dom';
import { TELEMETRY_KEYS } from '../../utils/constants';
import { formatCoordinates, isThresholdExceeded, sortVehiclesByKey } from '../../utils/utils';
import ChevronUp from '../../assets/icons/chevron-up.svg';
import ChevronDown from '../../assets/icons/chevron-down.svg';
import styles from './styles.module.css';

type SortState = 'asc' | 'desc' | 'off';

interface SortIconProps {
  sortState: SortState;
}

const SortIcon = (props: SortIconProps) => {
  if (props.sortState === 'off') {
    return null;
  }

  return <img alt="chevron" src={props.sortState === 'asc' ? ChevronUp : ChevronDown} width={16} height={16} />;
};

interface TableHeaderProps {
  sortingState: SortState[];
  toggleColumnHeader: (index: number) => void;
}

const TableHeader = (props: TableHeaderProps) => {
  const { t } = useTranslation();

  return (
    <thead>
      <tr>
        {/* // !NOTE: It doesn't make sense to sort by id or geo location */}
        <th className={styles.idCellHeader}>{t('dashboard.dataPointTitle.id')}</th>
        {TELEMETRY_KEYS.map((key, i) => {
          if (key === 'gpsLocation') {
            return <th key={`table_colum_key_${key}`}>{t(`dashboard.dataPointTitle.${key}`)}</th>;
          }
          return (
            <th key={`table_colum_key_${key}`} onClick={() => props.toggleColumnHeader(i)}>
              <div className={styles.sortableHeaderCell}>
                {t(`dashboard.dataPointTitle.${key}`)}
                <SortIcon sortState={props.sortingState[i]} />
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

const VehiclesTable = () => {
  const { t } = useTranslation();
  const vehicles = useAppSelector(selectAllVehicles);
  const [sortingState, setSortingState] = React.useState<SortState[]>(
    TELEMETRY_KEYS.map((key) => (key === 'speed' ? 'asc' : 'off'))
  );
  const navigate = useNavigate();

  //!NOTE: Click on column header enables sorting
  const toggleColumnHeader = (indexToToggle: number) => {
    setSortingState((prevState) =>
      prevState.map((currentState, currentIndex) => {
        if (currentIndex !== indexToToggle) {
          return 'off';
        }
        switch (currentState) {
          case 'off':
          case 'desc':
            return 'asc';
          case 'asc':
            return 'desc';
          default:
            return 'off';
        }
      })
    );
  };

  const sortedVehiclesData = React.useMemo(() => {
    const activeSortIndex = sortingState.findIndex((state) => state !== 'off');
    const activeSortOrder = sortingState[activeSortIndex] as 'asc' | 'desc';
    const activeSortKey = TELEMETRY_KEYS[activeSortIndex];
    const vehiclesData = Array.from(Object.values(vehicles));

    if (activeSortIndex > -1) {
      return [...vehiclesData].sort((a, b) => sortVehiclesByKey(a, b, activeSortKey, activeSortOrder));
    }
    return vehiclesData;
  }, [vehicles, sortingState]);

  if (!Boolean(Object.keys(vehicles).length)) {
    return <div className={styles.noVehiclesMessage}>{t('dashboard.vehiclesTable.noVehiclesMessage')}</div>;
  }

  const handleOnRowClick = (vehicleId: string) => {
    //!NOTE: Click on row redirects to vehiche detail route
    navigate(`/vehicle/${vehicleId}`);
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <TableHeader sortingState={sortingState} toggleColumnHeader={toggleColumnHeader} />
        <tbody>
          {sortedVehiclesData.map((vehicle) => (
            <tr key={`table_row_key_${vehicle.id}`} onClick={() => handleOnRowClick(vehicle.id)}>
              <td className={styles.idCell}>{vehicle.id.substring(0, 8)}</td>
              <td className={isThresholdExceeded('speed', vehicle.speed) ? styles.dangerCell : ''}>{vehicle.speed}</td>
              <td className={isThresholdExceeded('batteryLevel', vehicle.batteryLevel) ? styles.dangerCell : ''}>
                {vehicle.batteryLevel}
              </td>
              <td className={isThresholdExceeded('tirePressure', vehicle.tirePressure) ? styles.dangerCell : ''}>
                {vehicle.tirePressure}
              </td>
              <td className={isThresholdExceeded('motorEfficiency', vehicle.motorEfficiency) ? styles.dangerCell : ''}>
                {vehicle.motorEfficiency}
              </td>
              <td>
                {vehicle.regenerativeBraking ? t('dashboard.dataPointValue.on') : t('dashboard.dataPointValue.off')}
              </td>
              <td
                className={
                  isThresholdExceeded('batteryTemperature', vehicle.batteryTemperature) ? styles.dangerCell : ''
                }
              >
                {vehicle.batteryTemperature}
              </td>
              <td
                className={isThresholdExceeded('energyConsumption', vehicle.energyConsumption) ? styles.dangerCell : ''}
              >
                {vehicle.energyConsumption}
              </td>
              <td>{formatCoordinates(vehicle.gpsLocation.lat, vehicle.gpsLocation.lon)}</td>
              <td
                className={isThresholdExceeded('suspensionStatus', vehicle.suspensionStatus) ? styles.dangerCell : ''}
              >
                {vehicle.suspensionStatus}
              </td>
              <td className={isThresholdExceeded('odometer', vehicle.odometer) ? styles.dangerCell : ''}>
                {vehicle.odometer}
              </td>
              <td>{vehicle.chargingStatus ? t('dashboard.dataPointValue.on') : t('dashboard.dataPointValue.off')}</td>
              <td className={isThresholdExceeded('temperature', vehicle.temperature) ? styles.dangerCell : ''}>
                {vehicle.temperature}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehiclesTable;
