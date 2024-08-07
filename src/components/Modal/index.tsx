import { useRef, useEffect } from "react";

import { BasicButton } from "../Buttons/BasicButton";
import { useModalStore } from "../../store/Modal";

import "./Modal.css";

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
    resetModal,
  } = useModalStore();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    document.body.style.position = isOpen ? "fixed" : "relative";
  }, [isOpen]);

  const closeModal = () => {
    resetModal();
  };

  const onClose = (e: any) => {
    if (
      modalRef &&
      modalRef.current &&
      !modalRef.current.contains(e.target) &&
      !disableAutoClose
    ) {
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
  };

  if (!isOpen || !content) {
    return null;
  }

  return (
    <div className="modal" onClick={onClose}>
      <div ref={modalRef} className="modal__wrapper">
        <h2 className="modal__header font-bold">{title}</h2>
        <div className="modal__content overflow-x-auto overflow-y-scroll p-20">
          <div className="h-[80%]">{content}</div>
        </div>
        <div className="modal__actions">
          <BasicButton className="modal__button" ternary onClick={closeModal}>
            {cancelLabel}
          </BasicButton>
          {!noOnSave && (
            <BasicButton
              className="modal__button"
              primary
              onClick={saveModal}
              loading={isLoading}
              disabled={saveDisabled || isLoading}
            >
              {saveLabel}
            </BasicButton>
          )}
        </div>
      </div>
    </div>
  );
};
