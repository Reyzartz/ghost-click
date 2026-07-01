import { Icon, IconSize } from "@/design-system";
import { StepType } from "@/models";
import clsx from "clsx";
import {
  Loader2Icon,
  AlertCircle,
  Check,
  CirclePauseIcon,
  GlobeIcon,
  KeyboardIcon,
  LucideIcon,
  MousePointerClickIcon,
  TextCursorInputIcon,
  PauseIcon,
} from "lucide-react";
import { memo, useMemo } from "react";
import { cva } from "class-variance-authority";

interface StepIconWithStateProps {
  type: StepType;
  isCompleted?: boolean;
  isErrored?: boolean;
  isCurrent?: boolean;
  isPlaying?: boolean;
  isPaused?: boolean;
  isDeleted?: boolean;
  size?: Extract<IconSize, "sm" | "md" | "lg">;
  className?: string;
  filled?: boolean;
}

const StepTypeToIcon: Record<StepType, LucideIcon> = {
  CLICK: MousePointerClickIcon,
  INPUT: TextCursorInputIcon,
  KEYPRESS: KeyboardIcon,
  NAVIGATE: GlobeIcon,
  PAUSE: CirclePauseIcon,
};

const stepTypeToFilledBackground = cva("", {
  variants: {
    color: {
      info: "bg-info-bg",
      error: "bg-error-bg-hover",
      success: "bg-success-bg-hover",
      secondary: "bg-background-secondary",
      muted: "bg-background-secondary",
    },
    size: {
      sm: "p-1.5 rounded-sm",
      md: "p-2.5 rounded",
      lg: "p-3.5 rounded-lg",
    },
  },
});

const StepIconWithState = memo<StepIconWithStateProps>(
  ({
    type,
    isDeleted = false,
    isCompleted = false,
    isErrored = false,
    isPlaying = false,
    isPaused = false,
    isCurrent = false,
    size = "md",
    className,
    filled = false,
  }) => {
    const textColor = useMemo(() => {
      if (isDeleted) return "muted";
      if (isErrored) return "error";
      if (isCurrent) return "info";
      if (isCompleted) return "success";
      return "secondary";
    }, [isDeleted, isErrored, isCurrent, isCompleted]);

    const iconType = useMemo(() => {
      if (!isPlaying && !isPaused) return StepTypeToIcon[type];
      if (isCurrent && isPaused) return PauseIcon;
      if (isCurrent) return Loader2Icon;
      if (isCompleted && isErrored) return AlertCircle;
      if (isCompleted && !isErrored) return Check;

      return StepTypeToIcon[type];
    }, [isPlaying, type, isCurrent, isPaused, isCompleted, isErrored]);

    return (
      <div
        className={clsx(
          filled &&
            stepTypeToFilledBackground({
              color: textColor,
              size,
            }),
          className
        )}
      >
        <Icon
          icon={iconType}
          size={size}
          color={textColor}
          className={clsx({
            "animate-spin": isCurrent && isPlaying && !isPaused,
          })}
        />
      </div>
    );
  }
);

export default StepIconWithState;
