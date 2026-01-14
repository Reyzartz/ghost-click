import { InputStep } from "@/models";
import { memo, useState } from "react";

interface EditInputStepProps {
  step: InputStep;
  onUpdateStep: (stepId: string, step: Partial<InputStep>) => void;
  onClose: () => void;
}

const EditInputStep = memo<EditInputStepProps>(
  ({ step, onUpdateStep, onClose }) => {
    const [nameInput, setNameInput] = useState(step.name);
    const [valueInput, setValueInput] = useState(step.value);

    const handleSave = (): void => {
      const trimmedName = nameInput.trim();
      const trimmedValue = valueInput.trim();

      const updates: Partial<InputStep> = {};

      if (trimmedName && trimmedName !== step.name) {
        updates.name = trimmedName;
      }

      if (trimmedValue !== step.value) {
        updates.value = trimmedValue;
      }

      if (Object.keys(updates).length > 0) {
        onUpdateStep(step.id, updates);
      }
      onClose();
    };

    const handleCancel = (): void => {
      setNameInput(step.name);
      setValueInput(step.value);
      onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === "Escape") {
        handleCancel();
        e.currentTarget.blur();
      } else if (e.key === "Enter") {
        handleSave();
        e.currentTarget.blur();
      }
    };

    return (
      <li className="rounded px-3 py-2 flex flex-col gap-2 text-xs bg-white border border-slate-300 mx-auto max-w-max list-none">
        <div className="flex items-center gap-2">
          <label className="text-slate-600 w-12">Name:</label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-slate-500"
            autoFocus
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-slate-600 w-12">Value:</label>
          <input
            type="text"
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-slate-500"
          />
        </div>
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={handleSave}
            className="cursor-pointer text-green-600 hover:text-green-700 px-2 py-1 rounded hover:bg-green-50"
            title="Save"
          >
            ✓ Save
          </button>
          <button
            onClick={handleCancel}
            className="cursor-pointer text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
            title="Cancel"
          >
            ✕ Cancel
          </button>
        </div>
      </li>
    );
  }
);

export { EditInputStep };
