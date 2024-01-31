import { create } from 'zustand';

export enum CONFIRM_MODAL_TYPE {
  'DEFAULT' = 'DEFAULT',
  'DELETE_ACCOUNT' = 'DELETE_ACCOUNT',
};

export type ConfirmStore = {
  isOpen: boolean,
  title?: string | undefined,
  subtitle?:  string | undefined,
  modalType: CONFIRM_MODAL_TYPE,
  isLoading: boolean,
  confirmLabel: string | 'Confirm',
  cancelLabel: string | 'Cancel',
  onConfirm: () => void,
  onCancel?: (() => void) | null,
};

interface ConfirmStoreTypes extends ConfirmStore {
  openConfirm: (values: Partial<ConfirmStore>) => void,
  resetConfirm: () => void,
  startLoading: (value: boolean) => void,
};

const ConfirmStoreDefault: ConfirmStore = {
  isOpen: false,
  title: '',
  subtitle: undefined,
  modalType: CONFIRM_MODAL_TYPE.DEFAULT,
  isLoading: false,
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  onConfirm: () => null,
  onCancel: null,
};

export const useConfirmStore = create<ConfirmStoreTypes>((set, get) => ({
  isOpen: ConfirmStoreDefault.isOpen,
  title: ConfirmStoreDefault.title,
  subtitle: ConfirmStoreDefault.subtitle,
  modalType: ConfirmStoreDefault.modalType,
  isLoading: ConfirmStoreDefault.isLoading,
  confirmLabel: ConfirmStoreDefault.confirmLabel,
  cancelLabel: ConfirmStoreDefault.cancelLabel,
  onConfirm: ConfirmStoreDefault.onConfirm,
  onCancel: ConfirmStoreDefault.onCancel,

  openConfirm: async (values: Partial<ConfirmStore>) => {
    await set({
      modalType: values.modalType || ConfirmStoreDefault.modalType,
      isOpen: true,
      title: values.title,
      subtitle: values.subtitle || ConfirmStoreDefault.subtitle,
      confirmLabel: values.confirmLabel || ConfirmStoreDefault.confirmLabel,
      cancelLabel: values.cancelLabel || ConfirmStoreDefault.cancelLabel,
      onConfirm: values.onConfirm,
    });
  },
  resetConfirm: async () => {
    await set({ ...ConfirmStoreDefault });
  },
  startLoading: async () => {
    await set({ isLoading: true });
  },
}));