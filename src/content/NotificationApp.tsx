import { useState, useEffect } from "react";
import { NotificationState } from "./viewmodels/NotificationViewModel";
import { NotificationCard } from "@/components/NotificationCard";

interface NotificationAppDeps {
  notificationViewModel: {
    subscribe: (listener: (state: NotificationState) => void) => () => void;
    resume: () => void;
    stop: () => void;
  };
}

function NotificationApp({ app }: { app: NotificationAppDeps }) {
  const [notificationState, setNotificationState] = useState<NotificationState>(
    { notifications: [], pauseMessage: null }
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
      {notificationState.pauseMessage && (
        <NotificationCard
          notification={{
            id: "pauseMessage",
            message: notificationState.pauseMessage,
            type: "info",
            icon: "pause",
          }}
        />
      )}

      {notificationState.notifications.map((notification) => {
        return (
          <NotificationCard key={notification.id} notification={notification} />
        );
      })}
    </div>
  );
}

export default NotificationApp;
