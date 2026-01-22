import { MacroStep } from "@/models";
import { useCallback, useState } from "react";
import { EditClickStep } from "./EditClickStep";
import { EditInputStep } from "./EditInputStep";
import { EditKeyPressStep } from "./EditKeyPressStep";
import {
  Undo2,
  Trash2,
  MousePointerClickIcon,
  TextCursorInputIcon,
  KeyboardIcon,
} from "lucide-react";
import { IconButton, Text, Button } from "@/design-system";

interface EditStepItemProps {
  step: MacroStep;
  index: number;
  isDeleted: boolean;
  handleUpdateStep: (stepId: string, step: Partial<MacroStep>) => void;
  handleDeleteStep: (stepId: string) => void;
  handleUndoDelete: (stepId: string) => void;
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
}: EditStepItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const onClose = (): void => {
    setIsEditing(false);
  };

  const onEditHandler = useCallback(() => {
    if (isDeleted) return;
    setIsEditing(true);
  }, [isDeleted]);

  const IconComponent = StepTypeToIcon[step.type];

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
        className={`relative max-w-full list-none group/step border rounded bg-white ${
          isDeleted
            ? "border-red-300 bg-red-50"
            : "border-slate-200 cursor-pointer"
        }`}
        onClick={onEditHandler}
      >
        <div
          className={`flex items-center w-full gap-2 px-3 py-1 mx-auto max-w-max transition-all ${
            isDeleted ? "pr-20 opacity-50" : "opacity-100 group-hover/step:pr-8"
          }`}
        >
          <IconComponent size={16} className="shrink-0" />

          <Text
            className={"grow truncate " + (isDeleted ? "line-through" : "")}
            color={isDeleted ? "muted" : "default"}
          >
            {step.name}
          </Text>
        </div>

        <div
          className={`rounded w-full bg-slate-100 px-3 pb-1 text-slate-600 flex items-center gap-1 border-t-0 rounded-t-none group-last-of-type:/step:hidden ${
            isDeleted ? "opacity-50" : "opacity-100"
          }`}
        >
          <Text
            color="muted"
            variant="small"
            className={
              "text-center w-full" + (isDeleted ? " line-through" : "")
            }
          >
            {step.delay}ms
          </Text>
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
          <div className="z-50 absolute right-0.5 top-1 items-center overflow-hidden w-0 group-hover/step:w-6 transition-all duration-200">
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
