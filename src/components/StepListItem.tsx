import { MacroStep } from "@/models";
import { clsx } from "clsx";
import {
  Check,
  AlertCircle,
  MousePointerClickIcon,
  TextCursorInputIcon,
  KeyboardIcon,
  GlobeIcon,
  LucideIcon,
  PauseIcon,
  LoaderCircleIcon,
} from "lucide-react";
import { Text, Icon, Card } from "@/design-system";
import { useMemo } from "react";

interface StepListItemProps {
  step: MacroStep;
  index: number;
  isCurrent: boolean;
  isCompleted: boolean;
  isErrored: boolean;
  isPaused: boolean;
}

const StepTypeToIcon: Record<MacroStep["type"], LucideIcon> = {
  CLICK: MousePointerClickIcon,
  INPUT: TextCursorInputIcon,
  KEYPRESS: KeyboardIcon,
  NAVIGATE: GlobeIcon,
};

export const StepListItem = ({
  step,
  isCurrent,
  isCompleted,
  isErrored,
  isPaused,
}: StepListItemProps) => {
  const IconComponent = StepTypeToIcon[step.type];

  const cardVariant = useMemo(() => {
    if (isErrored) return "errored";
    if (isCurrent) return "selected";
    if (isCompleted) return "secondary";

    return "default";
  }, [isErrored, isCurrent, isCompleted]);

  const textAndIconColor = useMemo(() => {
    if (isCurrent && !isErrored) return "info";
    if (isCompleted && isErrored) return "error";
    if (isCompleted && !isErrored) return "success";
  }, [isCurrent, isCompleted, isErrored]);

  const iconType = useMemo(() => {
    if (isCurrent && isPaused) return PauseIcon;
    if (isCurrent) return LoaderCircleIcon;
    if (isCompleted && isErrored) return AlertCircle;
    if (isCompleted && !isErrored) return Check;
    return null;
  }, [isCurrent, isCompleted, isErrored, isPaused]);

  return (
    <Card
      as="li"
      variant={cardVariant}
      autoScroll={isCurrent}
      autoFocus={isCurrent}
    >
      <div
        className={clsx(
          "flex items-center gap-2",
          isCompleted && isErrored && "text-error-icon",
          isCompleted && !isErrored && "text-success-icon"
        )}
      >
        <Icon icon={IconComponent} size="sm" color={textAndIconColor} />
        <Text
          variant="small"
          color={textAndIconColor}
          className="truncate"
          title={step.name}
        >
          {step.name}
        </Text>
        {iconType && (
          <Icon
            icon={iconType}
            size="sm"
            color={textAndIconColor}
            className={clsx(
              "ml-auto",
              isCurrent && !isPaused && "animate-spin"
            )}
          />
        )}
      </div>
    </Card>
  );
};
