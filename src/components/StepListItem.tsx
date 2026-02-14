import { MacroStep } from "@/models";
import { clsx } from "clsx";
import {
  Play,
  Check,
  AlertCircle,
  MousePointerClickIcon,
  TextCursorInputIcon,
  KeyboardIcon,
  GlobeIcon,
  LucideIcon,
} from "lucide-react";
import { Text, Icon, Card } from "@/design-system";
import { useMemo } from "react";

interface StepListItemProps {
  step: MacroStep;
  index: number;
  isCurrent: boolean;
  isCompleted: boolean;
  isErrored: boolean;
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
    if (isCurrent) return Play;
    if (isCompleted && isErrored) return AlertCircle;
    if (isCompleted && !isErrored) return Check;
    return null;
  }, [isCurrent, isCompleted, isErrored]);

  return (
    <Card
      as="li"
      variant={cardVariant}
      size="sm"
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
        <Text variant="small" color={textAndIconColor}>
          {step.name}
        </Text>
        {iconType && (
          <Icon
            icon={iconType}
            size="sm"
            color={textAndIconColor}
            className="ml-auto"
          />
        )}
      </div>
    </Card>
  );
};
