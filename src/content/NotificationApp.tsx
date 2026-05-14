import { useState, useEffect } from "react";
import { cva } from "class-variance-authority";
import { NotificationState } from "./viewmodels/NotificationViewModel";

interface NotificationAppDeps {
  notificationViewModel: {
    subscribe: (listener: (state: NotificationState) => void) => () => void;
  };
}

const notificationContainer = cva(
  "pointer-events-auto flex w-60 justify-center rounded px-4 py-2 text-sm font-medium shadow-lg",
  {
    variants: {
      type: {
        success: "bg-success text-text-inverse",
        error: "bg-error text-text-inverse",
        info: "bg-info text-text-inverse",
      },
    },
    defaultVariants: { type: "info" },
  }
);

function NotificationApp({ app }: { app: NotificationAppDeps }) {
  const [notificationState, setNotificationState] = useState<NotificationState>(
    { notifications: [] }
  );

  useEffect(() => {
    const unsubscribe =
      app.notificationViewModel.subscribe(setNotificationState);
    return () => unsubscribe();
  }, [app]);

  return (
    <div
      style={{ zIndex: 10000 }}
      className="pointer-events-none fixed top-4 mx-auto flex w-screen flex-col items-center gap-2"
    >
      {notificationState.notifications.map((notification) => (
        <div
          key={notification.id}
          style={{ animation: "slide-down 0.3s ease-out" }}
          className={notificationContainer({ type: notification.type })}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
}

export default NotificationApp;
