import { memo } from "react";
import { cva } from "class-variance-authority";
import {
  CheckCircle,
  XCircle,
  Info,
  CircleDot,
  Save,
  Play,
  Square,
  Pause,
} from "lucide-react";
import { Icon, Text } from "@/design-system";
import { Notification } from "@/content/viewmodels/NotificationViewModel";

const notificationIcons = {
  "circle-dot": CircleDot,
  save: Save,
  play: Play,
  square: Square,
  "check-circle": CheckCircle,
  "x-circle": XCircle,
  info: Info,
  pause: Pause,
};

const notificationContainer = cva(
  "pointer-events-auto flex flex-col min-w-60 max-w-xl items-stretch gap-2 rounded px-5 py-3 text-sm font-medium shadow-lg border border-solid",
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

interface NotifiactionCardProps {
  notification: Notification;
}

const NotificationCard = memo<NotifiactionCardProps>(({ notification }) => {
  return (
    <div
      key={notification.id}
      style={{ animation: "slide-down 0.3s ease-out" }}
      className={notificationContainer({ type: notification.type })}
    >
      {notification.id === "pauseMessage" && (
        <div className="bg-background-secondary border-border mb-1 flex gap-2 rounded border border-solid p-1 px-2">
          <Icon icon={Info} size="sm" color="muted" />
          <Text variant="small" color="muted">
            Press the <strong>Resume</strong> button to continue playback.
          </Text>
        </div>
      )}

      <div className="flex items-center justify-start gap-2">
        <Icon
          icon={notificationIcons[notification.icon]}
          size="sm"
          color={notification.type}
        />
        <Text
          variant="h4"
          color={notification.type}
          className="wrap-break-words"
        >
          {notification.message}
        </Text>
      </div>
    </div>
  );
});

NotificationCard.displayName = "NotificationCard";

export { NotificationCard };
