import { MacroStep } from "@/models";
import { useState } from "react";
import { EditInputStep } from "./EditInputStep";
import { EditKeyPressStep } from "./EditKeyPressStep";

interface EditStepItemProps {
  step: MacroStep;
  index: number;
  handleUpdateStep: (stepId: string, step: Partial<MacroStep>) => void;
}

export const EditStepItem = ({
  step,
  index,
  handleUpdateStep,
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
      className="cursor-pointer rounded px-3 h-8 flex items-center text-xs bg-white border border-slate-200 mx-auto max-w-max list-none group/step"
      onClick={() => setIsEditing(true)}
    >
      <div className="flex items-center gap-2">
        <span className="text-slate-400">#{index + 1}</span>
        <span>{step.name}</span>

        <button
          className="cursor-pointer w-0 group-hover/step:w-4 overflow-hidden text-slate-500 hover:text-slate-700 transition-{width} duration-200 ease-in-out"
          title="Edit step name"
        >
          ✎
        </button>
      </div>
    </li>
  );
};
