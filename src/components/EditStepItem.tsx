import { MacroStep } from "@/models";
import { clsx } from "clsx";
import { useCallback, useState, useRef, useEffect } from "react";
import { EditClickStep } from "./EditClickStep";
import { EditInputStep } from "./EditInputStep";
import { EditKeyPressStep } from "./EditKeyPressStep";
import { EditNavigateStep } from "./EditNavigateStep";
import {
  Undo2,
  Trash2,
  MousePointerClickIcon,
  TextCursorInputIcon,
  KeyboardIcon,
  Navigation,
  Play,
  Check,
  AlertCircle,
} from "lucide-react";
import { IconButton, Text, Button, Badge } from "@/design-system";
import { TextColor } from "@/design-system/Text";

interface EditStepItemProps {
  step: MacroStep;
  index: number;
  isDeleted: boolean;
  isNew?: boolean;
  handleUpdateStep: (stepId: string, step: Partial<MacroStep>) => void;
  handleDeleteStep: (stepId: string) => void;
  handleUndoDelete: (stepId: string) => void;
  isEditDisabled?: boolean;
  isCurrent?: boolean;
  isCompleted?: boolean;
  isErrored?: boolean;
  isDeletable?: boolean;
}

const StepTypeToIcon: Record<
  string,
  React.FC<{ size?: number; className?: string }>
> = {
  CLICK: MousePointerClickIcon,
  INPUT: TextCursorInputIcon,
  KEYPRESS: KeyboardIcon,
  NAVIGATE: Navigation,
};

export const EditStepItem = ({
  step,
  isDeleted,
  isNew = false,
  handleUpdateStep,
  handleDeleteStep,
  handleUndoDelete,
  isEditDisabled = false,
  isCurrent = false,
  isCompleted = false,
  isErrored = false,
  isDeletable = true,
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
          {step.type === "NAVIGATE" && (
            <EditNavigateStep
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
        className={clsx(
          "group/step relative max-w-full list-none rounded border",
          getStatusStyles(),
          isEditDisabled ? "cursor-not-allowed" : "cursor-pointer"
        )}
        onClick={onEditHandler}
      >
        <div
          className={clsx(
            "mx-auto flex w-full max-w-max items-start gap-2 p-3 py-1.5 transition-all duration-200",
            isDeleted ? "pr-20 opacity-50" : "opacity-100",
            !isEditDisabled && !isDeleted && "group-hover/step:pr-8"
          )}
        >
          <div className="flex min-w-0 grow flex-col">
            <div className="flex items-center gap-1.5">
              <Text
                variant="small"
                className={clsx(
                  "mb-0.5 flex grow truncate",
                  isDeleted && "line-through"
                )}
                color={getTextColor()}
              >
                <IconComponent size={16} className="mt-0.5 mr-1.5 shrink-0" />
                {step.name}
              </Text>

              {isNew && !isDeleted && (
                <Badge
                  variant="success"
                  className="-mr-1.5 w-8 shrink-0 overflow-hidden transition-all duration-200 group-hover/step:w-0 group-hover/step:border-0 group-hover/step:px-0"
                >
                  New
                </Badge>
              )}
            </div>

            <Text variant="xs" color="muted" className="ml-5 pl-0.5">
              {step.delay}ms delay{" "}
              {step.retryCount > 0 && `• ${step.retryCount} retries`}
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
            className="absolute top-0 right-0"
          >
            Undo
          </Button>
        ) : (
          isDeletable && (
            <div
              className={clsx(
                "absolute top-1 right-0.5 z-50 w-0 items-center overflow-hidden transition-all duration-200",
                isEditDisabled ? "hidden" : "group-hover/step:w-6"
              )}
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
          )
        )}
      </li>
    </>
  );
};
