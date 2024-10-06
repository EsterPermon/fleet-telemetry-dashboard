import { MouseEvent } from 'react';
import styles from './styles.module.css';

type EventType = MouseEvent<HTMLButtonElement>;

interface IconButtonProps {
  onClick: (event: EventType) => void;
  icon: string;
  iconAlt: string;
  label?: string;
  //!NOTE: Ideally bgColor prop should be better defined
  bgColorType?: 'red' | 'blue';
}

const IconButton = (props: IconButtonProps) => {
  const buttonClass = props.bgColorType === 'blue' ? styles.blue : styles.red;

  return (
    <button className={`${styles.iconButton} ${buttonClass}`} onClick={props.onClick}>
      <img alt={props.iconAlt} src={props.icon} width={25} height={25} />
      {props.label}
    </button>
  );
};

export default IconButton;
