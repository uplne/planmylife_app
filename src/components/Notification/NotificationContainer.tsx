import { CSSTransition, TransitionGroup } from "react-transition-group";

import { Notification } from "./Notification";
import { useNotificationStore } from "../../store/Notification";

import "./NotificationContainer.css";

export const NotificationContainer = () => {
  const notifications = useNotificationStore(
    (state) => state.activeNotifications,
  );

  return (
    <div className="notification-container">
      <TransitionGroup>
        {notifications.map((notif, index) => (
          <CSSTransition key={notif.id} classNames="notification" timeout={500}>
            <Notification
              key={index}
              id={notif.id || ""}
              message={notif.message}
              type={notif.type}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
};
