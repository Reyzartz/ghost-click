import { Icon, IconSize } from "@/design-system";
import { StepType } from "@/models";
import clsx from "clsx";
import {
  Loader2Icon,
  AlertCircle,
  Check,
  GlobeIcon,
  KeyboardIcon,
  LucideIcon,
  MousePointerClickIcon,
  TextCursorInputIcon,
  PauseIcon,
} from "lucide-react";
import { memo, useMemo } from "react";

interface StepIconWithStateProps {
  type: StepType;
  isCompleted?: boolean;
  isErrored?: boolean;
  isCurrent?: boolean;
  isPlaying?: boolean;
  isPaused?: boolean;
  isDeleted?: boolean;
  size?: IconSize;
  className?: string;
}

const StepTypeToIcon: Record<StepType, LucideIcon> = {
  CLICK: MousePointerClickIcon,
  INPUT: TextCursorInputIcon,
  KEYPRESS: KeyboardIcon,
  NAVIGATE: GlobeIcon,
};

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
  }) => {
    const textColor = useMemo(() => {
      if (isDeleted) return "muted";
      if (isErrored) return "error";
      if (isCurrent) return "info";
      if (isCompleted) return "success";
      return "default";
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
      <Icon
        icon={iconType}
        size={size}
        color={textColor}
        className={clsx(className, {
          "animate-spin": isCurrent && isPlaying && !isPaused,
        })}
      />
    );
  }
);

export default StepIconWithState;
