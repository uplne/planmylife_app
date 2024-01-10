
import { BasicButton } from '../Buttons/BasicButton';
// import DeleteAccount from './DeleteAccount';

import { useConfirmStore } from '../../store/Confirm';

import './Confirm.css';

export const Confirm = () => {
  const {
    isOpen,
    title,
    subtitle,
    modalType,
    isLoading,
    confirmLabel,
    cancelLabel,
  } = useConfirmStore();

  const confirm = () => {
    // dispatch({ type: 'confirm/confirm'});
  };

  const cancel = () => {
    // dispatch({ type: 'confirm/cancel'});
  };

  if (!isOpen) {
    return null;
  }

  // if (modalType === 'DeleteAccount') {
  //   return <DeleteAccount />;
  // }

  return (
    <div className="confirm">
      <div className="confirm__wrapper">
        <h2 className="confirm__title">{title}</h2>
        {subtitle && <p className="confirm__subtitle">{subtitle}</p>}
        <div className="confirm__actions">
          <BasicButton
            className="modal__button"
            ternary
            onClick={cancel}
          >{cancelLabel}</BasicButton>
          <BasicButton
            className="modal__button"
            onClick={confirm}
            loading={isLoading}
            disabled={isLoading}
          >{confirmLabel}</BasicButton>
        </div>
      </div>
    </div>
  );
};
