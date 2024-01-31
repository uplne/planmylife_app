import { useEffect } from 'react';
import classnames from 'classnames';

import { useNotificationStore, NOTIFICATION_TYPE } from '../../store/Notification';
import { idType } from '../../types/idtype';

import './Notification.css';

type ComponentTypes = {
  className?: string,
  message: string,
  type?: string,
  id: idType,
};

export const Notification = ({
  className = '',
  message,
  type = NOTIFICATION_TYPE.SUCCESS,
  id,
}: ComponentTypes) => {
  const removeNotification = useNotificationStore((state) => state.removeNotification);
  const classes = classnames('notification', className, {
    'notification--success': type === NOTIFICATION_TYPE.SUCCESS,
  });

  useEffect(() => {
    let timer = setTimeout(() => removeNotification(id), 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={classes}>
      {message}
    </div>
  );
};
