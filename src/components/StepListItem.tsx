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
import { Text, Icon } from "@/design-system";

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
  return (
    <li
      className={clsx(
        "rounded px-3 py-2",
        isCurrent
          ? "border-success-border bg-success-bg-hover border font-medium"
          : isCompleted
            ? "border-border bg-surface-hover text-text-muted border"
            : "border-border bg-surface border",
        isErrored && "border-error-border bg-error-bg text-error-text"
      )}
      autoFocus={isCurrent}
      ref={(el) => {
        if (isCurrent && el) {
          el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }}
    >
      <div
        className={clsx(
          "flex items-center gap-2",
          isCompleted && isErrored && "text-error-icon",
          isCompleted && !isErrored && "text-success-icon"
        )}
      >
        <Icon icon={IconComponent} size="sm" />
        <Text variant="small">{step.name}</Text>
        {isCurrent && !isErrored && (
          <Icon icon={Play} size="sm" color="success" className="ml-auto" />
        )}
        {isCompleted && !isErrored && (
          <Icon icon={Check} size="sm" color="success" className="ml-auto" />
        )}
        {isErrored && (
          <Icon
            icon={AlertCircle}
            size="sm"
            color="error"
            className="ml-auto"
          />
        )}
      </div>
    </li>
  );
};
