import { MacroStep } from "@/models";
import { useCallback, useState, useRef, useEffect } from "react";
import { EditClickStep } from "./EditClickStep";
import { EditInputStep } from "./EditInputStep";
import { EditKeyPressStep } from "./EditKeyPressStep";
import {
  Undo2,
  Trash2,
  MousePointerClickIcon,
  TextCursorInputIcon,
  KeyboardIcon,
  Play,
  Check,
  AlertCircle,
} from "lucide-react";
import { IconButton, Text, Button } from "@/design-system";
import { TextColor } from "@/design-system/Text";

interface EditStepItemProps {
  step: MacroStep;
  index: number;
  isDeleted: boolean;
  handleUpdateStep: (stepId: string, step: Partial<MacroStep>) => void;
  handleDeleteStep: (stepId: string) => void;
  handleUndoDelete: (stepId: string) => void;
  isEditDisabled?: boolean;
  isCurrent?: boolean;
  isCompleted?: boolean;
  isErrored?: boolean;
}

const StepTypeToIcon: Record<
  string,
  React.FC<{ size?: number; className?: string }>
> = {
  CLICK: MousePointerClickIcon,
  INPUT: TextCursorInputIcon,
  KEYPRESS: KeyboardIcon,
};

export const EditStepItem = ({
  step,
  isDeleted,
  handleUpdateStep,
  handleDeleteStep,
  handleUndoDelete,
  isEditDisabled = false,
  isCurrent = false,
  isCompleted = false,
  isErrored = false,
}: EditStepItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const stepRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (isCurrent && stepRef.current) {
      stepRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [isCurrent]);

  const onClose = (): void => {
    setIsEditing(false);
  };

  const onEditHandler = useCallback(() => {
    if (isDeleted || isEditDisabled) return;
    setIsEditing(true);
  }, [isDeleted, isEditDisabled]);

  const IconComponent = StepTypeToIcon[step.type];

  // Determine border and background colors based on status
  const getStatusStyles = () => {
    if (isDeleted) return "border-red-300 bg-red-50";
    if (isErrored) return "border-red-300 bg-red-50 text-red-700";
    if (isCurrent) return "border-green-300 bg-green-100";
    if (isCompleted) return "border-slate-200 bg-slate-100";
    return "border-slate-200 bg-white";
  };

  // Determine text color based on status
  const getTextColor = (): TextColor => {
    if (isDeleted) return "muted";
    if (isErrored) return "error";
    if (isCompleted) return "default";
    return "default";
  };

  // Get status icon
  const getStatusIcon = () => {
    if (isErrored)
      return <AlertCircle size={16} className="shrink-0 text-red-600" />;
    if (isCurrent)
      return <Play size={16} className="shrink-0 text-green-600" />;
    if (isCompleted)
      return <Check size={16} className="shrink-0 text-green-600" />;
    return null;
  };

  return (
    <>
      {isEditing && (
        <>
          {step.type === "CLICK" && (
            <EditClickStep
              step={step}
              isOpen={isEditing}
              onUpdateStep={handleUpdateStep}
              onClose={onClose}
            />
          )}
          {step.type === "INPUT" && (
            <EditInputStep
              step={step}
              isOpen={isEditing}
              onUpdateStep={handleUpdateStep}
              onClose={onClose}
            />
          )}
          {step.type === "KEYPRESS" && (
            <EditKeyPressStep
              step={step}
              isOpen={isEditing}
              onUpdateStep={handleUpdateStep}
              onClose={onClose}
            />
          )}
        </>
      )}

      <li
        ref={stepRef}
        className={`relative max-w-full list-none group/step border rounded ${getStatusStyles()} ${
          isEditDisabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={onEditHandler}
      >
        <div
          className={`flex items-start w-full gap-2 px-3 py-1.5 mx-auto max-w-max transition-all ${
            isDeleted ? "pr-20 opacity-50" : "opacity-100"
          } ${!isEditDisabled && !isDeleted ? "group-hover/step:pr-8" : ""}`}
        >
          <div>
            <Text
              variant="small"
              className={
                "flex grow truncate mb-0.5" + (isDeleted ? "line-through" : "")
              }
              color={getTextColor()}
            >
              <IconComponent size={16} className="shrink-0 mt-0.5 mr-1.5" />
              {step.name}
            </Text>
            <Text variant="small" color="muted" className="ml-6">
              {step.delay}ms delay
            </Text>
          </div>

          {getStatusIcon()}
        </div>

        {isDeleted ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleUndoDelete(step.id);
            }}
            variant="ghost"
            size="sm"
            icon={Undo2}
            className="absolute right-0 top-0"
          >
            Undo
          </Button>
        ) : (
          <div
            className={`z-50 absolute right-0.5 top-1 items-center overflow-hidden w-0 transition-all duration-200 ${
              isEditDisabled ? "hidden" : "group-hover/step:w-6"
            }`}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteStep(step.id);
              }}
              icon={Trash2}
              size="sm"
              variant="danger"
              title="Delete step"
            />
          </div>
        )}
      </li>
    </>
  );
};
