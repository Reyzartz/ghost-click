import { useState, useEffect } from "react";
import { ContentApp } from "../ContentApp";
import {
  AppStatus,
  StatusIndicatorState,
} from "../viewmodels/StatusIndicatorViewModel";
import { NotificationState } from "../viewmodels/NotificationViewModel";

const statusStyles: Record<AppStatus, string> = {
  idle: "",
  recording: "border-solid border-4 border-red-500",
  playing: "border-solid border-4 border-green-500",
};

const notificationTypeStyles = {
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
  info: "bg-blue-500 text-white",
};

function App({ app }: { app: ContentApp }) {
  const [statusState, setStatusState] = useState<StatusIndicatorState>({
    status: "idle",
  });

  const [notificationState, setNotificationState] = useState<NotificationState>(
    {
      notifications: [],
    }
  );

  useEffect(() => {
    const unsubscribe = app.statusIndicatorViewModel.subscribe(setStatusState);
    return () => unsubscribe();
  }, [app]);

  useEffect(() => {
    const unsubscribe =
      app.notificationViewModel.subscribe(setNotificationState);
    return () => unsubscribe();
  }, [app]);

  return (
    <>
      <div
        style={{
          zIndex: 9999,
        }}
        className={`fixed inset-0 box-border pointer-events-none w-screen h-screen ${
          statusStyles[statusState.status]
        }`}
      />

      <div
        style={{ zIndex: 10000 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 pointer-events-none"
      >
        {notificationState.notifications.map((notification) => (
          <div
            key={notification.id}
            style={{
              animation: "slideDown 0.3s ease-out",
            }}
            className={`px-4 py-2 rounded shadow-lg text-sm font-medium pointer-events-auto ${
              notificationTypeStyles[notification.type]
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
