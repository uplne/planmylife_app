import { useRef, useEffect } from 'react';

import { BasicButton } from '../Buttons/BasicButton';

import { useModalStore } from '../../store/Modal';

import './Modal.css';

export const Modal = () => {
  const modalRef = useRef<HTMLInputElement | null>(null);
  const {
    isOpen,
    content,
    onSave,
    title,
    saveDisabled,
    noOnSave,
    cancelLabel,
    saveLabel,
    disableAutoClose,
    isLoading,
    setIsLoading,
  } = useModalStore();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const closeModal = () => {
    // dispatch(toggleModal({
    //   isOpen: false,
    // }));
  }

  const onClose= (e:any) => {
    if (modalRef && modalRef.current && !modalRef.current.contains(e.target) && !disableAutoClose) {
      closeModal();
    }
  };

  const saveModal = async () => {
    if (!onSave) {
      return;
    }
    
    await setIsLoading(true);
    await onSave();
    await setIsLoading(false);
  }

  if (!isOpen || !content) {
    return null;
  }

  return (
    <div className="modal" onClick={onClose}>
      <div ref={modalRef} className="modal__wrapper">
        <h2 className="modal__header">{title}</h2>
        <div className="modal__content">
          {content}
        </div>
        <div className="modal__actions">
          <BasicButton
            className="modal__button"
            ternary
            onClick={closeModal}
          >{cancelLabel}</BasicButton>
          {!noOnSave &&
          <BasicButton
            className="modal__button"
            onClick={saveModal}
            loading={isLoading}
            disabled={saveDisabled || isLoading}
          >{saveLabel}</BasicButton>
          }
        </div>
      </div>
    </div>
  );
};
