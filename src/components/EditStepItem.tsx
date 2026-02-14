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
  LucideIcon,
} from "lucide-react";
import { Text, Button, Badge, Icon, Card } from "@/design-system";
import { cva } from "class-variance-authority";

const stepContentVariants = cva(
  "mx-auto flex w-full max-w-max items-start gap-2 transition-all duration-200 delay-200",
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

const StepTypeToIcon: Record<string, LucideIcon> = {
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

  const cardVariant = useMemo(() => {
    if (isDeleted) return "deleted";
    if (isErrored) return "errored";
    if (isCurrent) return "selected";
    if (isCompleted) return "success";

    return "default";
  }, [isDeleted, isErrored, isCurrent, isCompleted]);

  const textColor = useMemo(() => {
    if (isDeleted) return "muted";
    if (isErrored) return "error";
    if (isCurrent) return "info";
    if (isCompleted) return "success";
    return "default";
  }, [isDeleted, isErrored, isCurrent, isCompleted]);

  const iconType = useMemo(() => {
    if (isCurrent) return Play;
    if (isCompleted && isErrored) return AlertCircle;
    if (isCompleted && !isErrored) return Check;
    return null;
  }, [isCurrent, isCompleted, isErrored]);

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

      <Card
        as="li"
        ref={stepRef}
        variant={cardVariant}
        size="md"
        onClick={onEditHandler}
        autoScroll={isCurrent}
        className={clsx(
          "group/step relative max-w-full",
          isEditDisabled && "cursor-not-allowed"
        )}
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
                color={textColor}
              >
                <Icon
                  icon={IconComponent}
                  size="sm"
                  className="mt-0.5 mr-1.5"
                  color={textColor}
                />
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

          {iconType && <Icon icon={iconType} size="sm" color={textColor} />}
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
      </Card>
    </>
  );
};
