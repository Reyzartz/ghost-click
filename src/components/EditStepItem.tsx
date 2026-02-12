import { MacroStep } from "@/models";
import { clsx } from "clsx";
import { useCallback, useState, useRef, useEffect, useMemo } from "react";
import { EditClickStep } from "./EditClickStep";
import { EditInputStep } from "./EditInputStep";
import { EditKeyPressStep } from "./EditKeyPressStep";
import { EditNavigateStep } from "./EditNavigateStep";
import { StepMeta } from "./StepMeta";
import {
  Undo2,
  Trash2,
  MousePointerClickIcon,
  TextCursorInputIcon,
  KeyboardIcon,
  Play,
  Check,
  AlertCircle,
  GlobeIcon,
} from "lucide-react";
import { Text, Button, Badge } from "@/design-system";
import { cva } from "class-variance-authority";

const stepItemVariants = cva(
  "group/step relative max-w-full list-none rounded border",
  {
    variants: {
      status: {
        deleted: "border-error-border bg-error-bg",
        errored: "border-error-border bg-error-bg text-error-text",
        current: "border-success-border bg-success-bg-hover",
        completed: "border-border bg-surface-hover",
        default: "border-border bg-surface",
      },
      isEditDisabled: {
        true: "cursor-not-allowed",
        false: "cursor-pointer",
      },
    },
    defaultVariants: {
      status: "default",
      isEditDisabled: false,
    },
  }
);

const stepContentVariants = cva(
  "mx-auto flex w-full max-w-max items-start gap-2 p-3 py-1.5 transition-all duration-200 delay-200",
  {
    variants: {
      isDeleted: {
        true: "pr-20 opacity-50",
        false: "opacity-100",
      },
      isHoverable: {
        true: "group-hover/step:pr-8",
        false: "",
      },
      isDeletable: {
        true: "",
        false: "pr-3!",
      },
    },
    defaultVariants: {
      isDeleted: false,
      isHoverable: false,
      isDeletable: true,
    },
  }
);

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
  NAVIGATE: GlobeIcon,
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

  const stepStatus = useMemo(() => {
    if (isDeleted) return "deleted";
    if (isErrored) return "errored";
    if (isCurrent) return "current";
    if (isCompleted) return "completed";

    return "default";
  }, [isDeleted, isErrored, isCurrent, isCompleted]);

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
        className={stepItemVariants({
          status: stepStatus,
          isEditDisabled,
        })}
        onClick={onEditHandler}
      >
        <div
          className={stepContentVariants({
            isDeletable,
            isDeleted,
            isHoverable: !isEditDisabled && !isDeleted,
          })}
        >
          <div className="flex min-w-0 grow flex-col">
            <div className="flex items-center gap-1.5">
              <Text
                variant="small"
                className={clsx(
                  "mb-0.5 flex grow truncate",
                  isDeleted && "line-through"
                )}
                color={isDeleted ? "muted" : isErrored ? "error" : "default"}
              >
                <IconComponent size={16} className="mt-0.5 mr-1.5 shrink-0" />
                {step.name}
              </Text>

              {isNew && !isDeleted && (
                <Badge
                  variant="success"
                  className="-mr-1.5 w-8 shrink-0 overflow-hidden transition-all delay-200 duration-200 group-hover/step:w-0 group-hover/step:border-0 group-hover/step:px-0"
                >
                  New
                </Badge>
              )}
            </div>

            <StepMeta step={step} className="ml-5 pl-0.5" />
          </div>

          {isErrored && (
            <AlertCircle size={16} className="text-error-icon shrink-0" />
          )}
          {isCurrent && (
            <Play size={16} className="text-success-icon shrink-0" />
          )}
          {isCompleted && (
            <Check size={16} className="text-success-icon shrink-0" />
          )}
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
                "absolute top-1 right-0.5 z-50 w-0 items-center overflow-hidden transition-all delay-200 duration-200",
                isEditDisabled ? "hidden" : "group-hover/step:w-6"
              )}
            >
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteStep(step.id);
                }}
                icon={Trash2}
                size="sm"
                variant="danger"
                title="Delete step"
                className="p-0.75!"
              />
            </div>
          )
        )}
      </li>
    </>
  );
};
