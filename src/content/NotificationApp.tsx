import { useState, useEffect } from "react";
import { cva } from "class-variance-authority";
import {
  CheckCircle,
  XCircle,
  Info,
  CircleDot,
  Save,
  Play,
  Square,
} from "lucide-react";
import { NotificationState } from "./viewmodels/NotificationViewModel";
import { Icon, Text } from "@/design-system";

interface NotificationAppDeps {
  notificationViewModel: {
    subscribe: (listener: (state: NotificationState) => void) => () => void;
  };
}

const notificationIcons = {
  "circle-dot": CircleDot,
  save: Save,
  play: Play,
  square: Square,
  "check-circle": CheckCircle,
  "x-circle": XCircle,
  info: Info,
};

const notificationContainer = cva(
  "pointer-events-auto flex w-60 items-center gap-2 rounded px-5 py-3 text-sm font-medium shadow-lg border border-solid",
  {
    variants: {
      type: {
        success: "bg-success-bg border-success",
        error: "bg-error-bg border-error",
        info: "bg-info-bg border-info",
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
      {notificationState.notifications.map((notification) => {
        return (
          <div
            key={notification.id}
            style={{ animation: "slide-down 0.3s ease-out" }}
            className={notificationContainer({ type: notification.type })}
          >
            <Icon
              icon={notificationIcons[notification.icon]}
              size="sm"
              color={notification.type}
            />
            <Text variant="h4" color={notification.type}>
              {notification.message}
            </Text>
          </div>
        );
      })}
    </div>
  );
}

export default NotificationApp;
