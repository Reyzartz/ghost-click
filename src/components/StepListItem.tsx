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
} from "lucide-react";
import { Text } from "@/design-system";

interface StepListItemProps {
  step: MacroStep;
  index: number;
  isCurrent: boolean;
  isCompleted: boolean;
  isErrored: boolean;
}

const StepTypeToIcon: Record<
  MacroStep["type"],
  React.ComponentType<{ size?: number }>
> = {
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
        <IconComponent size={16} />
        <Text variant="small">{step.name}</Text>
        {isCurrent && !isErrored && (
          <Play size={14} className="text-success-icon ml-auto" />
        )}
        {isCompleted && !isErrored && (
          <Check size={14} className="text-success-icon ml-auto" />
        )}
        {isErrored && (
          <AlertCircle size={14} className="text-error-icon ml-auto" />
        )}
      </div>
    </li>
  );
};
