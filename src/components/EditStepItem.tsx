import { MacroStep } from "@/models";
import { useState } from "react";
import { EditClickStep } from "./EditClickStep";
import { EditInputStep } from "./EditInputStep";
import { EditKeyPressStep } from "./EditKeyPressStep";

interface EditStepItemProps {
  step: MacroStep;
  index: number;
  isDeleted: boolean;
  handleUpdateStep: (stepId: string, step: Partial<MacroStep>) => void;
  handleDeleteStep: (stepId: string) => void;
  handleUndoDelete: (stepId: string) => void;
}

export const EditStepItem = ({
  step,
  index,
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
              <button
                onClick={handleSave}
                className="text-green-600 hover:text-green-700 px-1"
                title="Save"
              >
                ✓
              </button>
              <button
                onClick={handleCancel}
                className="text-red-600 hover:text-red-700 px-1"
                title="Cancel"
              >
                ✕
              </button>
            </div>
          </li>
        );
    }
  }

  return (
    <li
      className={`list-none group/step border rounded bg-white ${
        isDeleted ? "opacity-50 border-red-300 bg-red-50" : "border-slate-200"
      }`}
    >
      <div
        className={`cursor-pointer px-3 h-8 flex items-center text-xs mx-auto max-w-max transition-all`}
        onClick={() => !isDeleted && setIsEditing(true)}
      >
        <div className="flex items-start gap-2">
          <span className="text-slate-400">#{index + 1}</span>

          <span className={isDeleted ? "line-through text-slate-500" : ""}>
            {step.name}
          </span>

          {isDeleted ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUndoDelete(step.id);
              }}
              className="cursor-pointer ml-2 text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 text-xs font-medium"
              title="Undo delete"
            >
              ↶ Undo
            </button>
          ) : (
            <div className="flex items-center gap-1 opacity-0 group-hover/step:opacity-100 transition-opacity duration-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="cursor-pointer text-slate-500 hover:text-slate-700 px-1"
                title="Edit step"
              >
                ✎
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteStep(step.id);
                }}
                className="cursor-pointer text-red-500 hover:text-red-700 px-1"
                title="Delete step"
              >
                🗑️
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="-mt-1 rounded w-full bg-slate-50 px-3 py-1 text-xs text-slate-600 flex items-center gap-1 border-t-0 rounded-t-none group-last-of-type:/step:hidden">
        <span>{step.delay}ms</span>
      </div>
    </li>
  );
};
