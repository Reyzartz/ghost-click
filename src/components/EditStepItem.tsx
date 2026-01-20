import { MacroStep } from "@/models";
import { useState } from "react";
import { EditClickStep } from "./EditClickStep";
import { EditInputStep } from "./EditInputStep";
import { EditKeyPressStep } from "./EditKeyPressStep";
import {
  Check,
  X,
  Undo2,
  Edit,
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

const StepTypeToIcon: Record<string, React.ComponentType<{ size?: number }>> = {
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
  const [nameInput, setNameInput] = useState(step.name);

  const handleSave = (): void => {
    const trimmedName = nameInput.trim();
    if (trimmedName && trimmedName !== step.name) {
      handleUpdateStep(step.id, { name: trimmedName });
    }
    setIsEditing(false);
  };

  const handleCancel = (): void => {
    setNameInput(step.name);
    onClose();
  };

  const onClose = (): void => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    switch (step.type) {
      case "CLICK":
        return (
          <EditClickStep
            step={step}
            onUpdateStep={handleUpdateStep}
            onClose={onClose}
          />
        );
      case "INPUT":
        return (
          <EditInputStep
            step={step}
            onUpdateStep={handleUpdateStep}
            onClose={onClose}
          />
        );
      case "KEYPRESS":
        return (
          <EditKeyPressStep
            step={step}
            onUpdateStep={handleUpdateStep}
            onClose={onClose}
          />
        );
      default:
        return (
          <li className="rounded px-3 h-8 flex items-center text-xs bg-white border border-slate-300 mx-auto max-w-max list-none">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="border border-slate-300 h-8 border-none rounded px-2 py-1 text-xs focus:outline-none focus:border-slate-500"
                autoFocus
              />
              <IconButton
                onClick={handleSave}
                icon={Check}
                variant="ghost"
                size="sm"
                title="Save"
              />
              <IconButton
                onClick={handleCancel}
                icon={X}
                variant="danger"
                size="sm"
                title="Cancel"
              />
            </div>
          </li>
        );
    }
  }

  const IconComponent = StepTypeToIcon[step.type];

  return (
    <li
      className={`list-none group/step border rounded bg-white ${
        isDeleted ? "opacity-50 border-red-300 bg-red-50" : "border-slate-200"
      }`}
    >
      <div
        className={`cursor-pointer relative px-3 h-8 flex items-center text-xs mx-auto max-w-max transition-all`}
        onClick={() => !isDeleted && setIsEditing(true)}
      >
        <div className="flex items-start gap-2">
          <IconComponent size={16} />

          <Text
            className={isDeleted ? "line-through" : ""}
            color={isDeleted ? "muted" : "default"}
          >
            {step.name}
          </Text>

          {isDeleted ? (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleUndoDelete(step.id);
              }}
              variant="ghost"
              size="sm"
              icon={Undo2}
              className="ml-2"
            >
              Undo
            </Button>
          ) : (
            <div className="flex flex-col absolute right-0 top-0 items-center gap-1 opacity-0 group-hover/step:opacity-100 group-hover/step:-right-7 transition-all duration-200 ">
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

              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                icon={Edit}
                size="sm"
                title="Edit step"
              />
            </div>
          )}
        </div>
      </div>

      <div className="-mt-1 pl-9 rounded w-full bg-slate-50 px-3 py-1 text-xs text-slate-600 flex items-center gap-1 border-t-0 rounded-t-none group-last-of-type:/step:hidden">
        <Text color="muted" variant="small">
          {step.delay}ms
        </Text>
      </div>
    </li>
  );
};
