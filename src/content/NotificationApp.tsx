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

const TRANSLUCENCY_DELAY_MS = 1000;

function NotificationApp({ app }: { app: NotificationAppDeps }) {
  const [notificationState, setNotificationState] = useState<NotificationState>(
    { notifications: [], pauseMessage: null }
  );
  const [isTranslucent, setIsTranslucent] = useState(false);

  useEffect(() => {
    const unsubscribe =
      app.notificationViewModel.subscribe(setNotificationState);
    return () => unsubscribe();
  }, [app]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleMouseMove = () => {
      setIsTranslucent(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(
        () => setIsTranslucent(false),
        TRANSLUCENCY_DELAY_MS
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      style={{ zIndex: 10000 }}
      className={`pointer-events-none fixed top-4 mx-auto flex w-screen flex-col items-center gap-2 transition-opacity duration-300 ${
        isTranslucent ? "opacity-30" : "opacity-100"
      }`}
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
