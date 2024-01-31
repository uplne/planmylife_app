import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import remove from 'lodash/remove';

import { idType } from '../../types/idtype';


export enum NOTIFICATION_TYPE {
  'SUCCESS' = 'success',
};

export type NotificationType = {
  id?: idType | undefined,
  message: string,
  type: NOTIFICATION_TYPE,
}

export type NotificationStore = {
  activeNotifications: NotificationType[],
};

interface NotificationStoreTypes extends NotificationStore {
  addNotification: ({ message, type}: { message: string, type: NOTIFICATION_TYPE}) => void, 
  removeNotification: (id: idType) => void,
};

export const NotificationDefault: NotificationType = {
  id: undefined,
  message: '',
  type: NOTIFICATION_TYPE.SUCCESS,
};

export const useNotificationStore = create<NotificationStoreTypes>((set, get) => ({
  activeNotifications: [],
  addNotification: ({ message, type = NOTIFICATION_TYPE.SUCCESS}) => {
    const notifications = [...get().activeNotifications];
    notifications.push({
      id: uuidv4(),
      message,
      type,
    });
    set({ activeNotifications: notifications });
  },
  removeNotification: (id: idType) => {
    const notifications = [...get().activeNotifications];
    remove(notifications, (notif) => notif.id === id);
    set({ activeNotifications: notifications });
  },
}));