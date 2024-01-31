import { NOTIFICATION_TYPE, useNotificationStore } from '../../store/Notification';

type ComponentTypes = {
  message: string,
  type: NOTIFICATION_TYPE,
};

export const showSuccessNotification = async (values?:ComponentTypes | null) => {
  let message = 'Successfully saved';
  let type = NOTIFICATION_TYPE.SUCCESS;

  if (values) {
    ({ message, type} = values);
  }

  const addNotification = useNotificationStore.getState().addNotification;

  await addNotification({
    message,
    type,
  });
};
