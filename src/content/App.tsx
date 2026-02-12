import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { ContentApp } from "./ContentApp";
import {
  AppStatus,
  StatusIndicatorState,
} from "./viewmodels/StatusIndicatorViewModel";
import { NotificationState } from "./viewmodels/NotificationViewModel";
import { QuickActionsView } from "./views/QuickActionsView";

const statusStyles: Record<AppStatus, string> = {
  idle: "",
  recording: "border-solid border-4 border-error",
  playing: "border-solid border-4 border-success",
};

const notificationTypeStyles = {
  success: "bg-success text-text-inverse",
  error: "bg-error text-text-inverse",
  info: "bg-info text-text-inverse",
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
        className={clsx(
          "pointer-events-none fixed inset-0 box-border h-screen w-screen",
          statusStyles[statusState.status]
        )}
      />

      <div
        style={{ zIndex: 10000 }}
        className="pointer-events-none fixed top-4 mx-auto flex w-screen flex-col items-center gap-2"
      >
        {notificationState.notifications.map((notification) => (
          <div
            key={notification.id}
            style={{
              animation: "slideDown 0.3s ease-out",
            }}
            className={clsx(
              "pointer-events-auto flex w-60 justify-center rounded px-4 py-2 text-sm font-medium shadow-lg",
              notificationTypeStyles[notification.type]
            )}
          >
            {notification.message}
          </div>
        ))}
      </div>

      <QuickActionsView app={app} />
    </>
  );
}

export default App;
