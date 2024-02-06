import { create } from "zustand";

export type ModalStore = {
  isOpen: boolean;
  content?: React.ReactNode | null;
  onSave?: (() => void) | null;
  title: string;
  saveDisabled?: boolean;
  noOnSave?: boolean;
  cancelLabel?: string;
  saveLabel?: string;
  disableAutoClose?: boolean;
  isLoading?: boolean;
};

interface ModalStoreTypes extends ModalStore {
  toggleModal: (values: ModalStore) => void;
  resetModal: () => void;
  setIsLoading: (value: boolean) => void;
  toggleSaveDisable: (value: boolean) => void;
}

export const ModalStoreDefault: ModalStore = {
  isOpen: false,
  content: null,
  onSave: null,
  title: "",
  saveDisabled: true,
  noOnSave: false,
  cancelLabel: "Cancel",
  saveLabel: "Save",
  disableAutoClose: false,
  isLoading: false,
};

export const useModalStore = create<ModalStoreTypes>((set) => ({
  isOpen: ModalStoreDefault.isOpen,
  content: ModalStoreDefault.content,
  onSave: ModalStoreDefault.onSave,
  title: ModalStoreDefault.title,
  saveDisabled: ModalStoreDefault.saveDisabled,
  noOnSave: ModalStoreDefault.noOnSave,
  cancelLabel: ModalStoreDefault.cancelLabel,
  saveLabel: ModalStoreDefault.saveLabel,
  disableAutoClose: ModalStoreDefault.disableAutoClose,
  isLoading: ModalStoreDefault.isLoading,

  toggleModal: async ({
    isOpen,
    content,
    onSave,
    title,
    noOnSave = ModalStoreDefault.noOnSave,
    cancelLabel = ModalStoreDefault.cancelLabel,
    saveLabel = ModalStoreDefault.saveLabel,
    saveDisabled = ModalStoreDefault.saveDisabled,
    disableAutoClose = ModalStoreDefault.disableAutoClose,
  }) => {
    await set({
      isOpen,
      content: !isOpen ? null : content,
      onSave: !isOpen ? null : onSave,
      title: title,
      saveDisabled: saveDisabled,
      noOnSave: noOnSave,
      cancelLabel: cancelLabel,
      saveLabel: saveLabel,
      disableAutoClose: disableAutoClose,
    });
  },
  resetModal: async () => {
    await set({
      isOpen: false,
      content: null,
      title: "",
      onSave: () => {},
      isLoading: false,
    });
  },
  setIsLoading: async (value) => {
    await set({ isLoading: value });
  },
  toggleSaveDisable: async (value: boolean) => {
    await set({ saveDisabled: value });
  },
}));
