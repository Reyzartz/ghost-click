import { MacroStep } from "@/models";
import {
  Play,
  Check,
  AlertCircle,
  MousePointerClickIcon,
  TextCursorInputIcon,
  KeyboardIcon,
} from "lucide-react";
import { Text } from "@/design-system";

interface StepListItemProps {
  step: MacroStep;
  index: number;
  isCurrent: boolean;
  isCompleted: boolean;
  isErrored: boolean;
}

const StepTypeToIcon: Record<string, React.ComponentType<{ size?: number }>> = {
  CLICK: MousePointerClickIcon,
  INPUT: TextCursorInputIcon,
  KEYPRESS: KeyboardIcon,
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
      className={`rounded px-3 py-2 text-xs ${
        isCurrent
          ? "bg-green-100 border border-green-300 font-medium"
          : isCompleted
          ? "bg-slate-100 border border-slate-200 text-slate-500"
          : "bg-white border border-slate-200"
      } ${isErrored ? "border-red-300 bg-red-50 text-red-700" : ""}`}
      autoFocus={isCurrent}
      ref={(el) => {
        if (isCurrent && el) {
          el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }}
    >
      <div
        className={`flex items-center gap-2 ${
          isCompleted && isErrored ? "text-red-600" : ""
        } ${isCompleted && !isErrored ? "text-green-600" : ""}`}
      >
        <IconComponent size={16} />
        <Text variant="small">{step.name}</Text>
        {isCurrent && !isErrored && (
          <Play size={14} className="ml-auto text-green-600" />
        )}
        {isCompleted && !isErrored && (
          <Check size={14} className="ml-auto text-green-600" />
        )}
        {isErrored && (
          <AlertCircle size={14} className="ml-auto text-red-600" />
        )}
      </div>
    </li>
  );
};
