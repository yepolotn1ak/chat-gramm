/* eslint-disable react/prop-types */
import * as Types from '../../types/types';
import './Button.scss';

interface Props {
  type: Types.Button,
  disabled?: boolean,
  onCLick?: () => void,
}

export const Button: React.FC<Props> = ({ type, disabled, onCLick }) => {
  if (type === Types.Button.Login) {
    return <button className='btn__login'>Ввійти</button>;
  }

  if (type === Types.Button.Room) {
    return <div className="btn btn__room" />;
  }

  return (
    <button
      type={type === Types.Button.Refresh ? 'button' : 'submit'}
      className={`btn__container btn__container--${type}`}
      onClick={onCLick}
      disabled={disabled}
    >
      <div className={`btn btn__${type}`} />
    </button>
  );
};
