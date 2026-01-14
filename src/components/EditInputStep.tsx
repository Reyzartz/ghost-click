import { InputStep } from "@/models";
import { memo, useState } from "react";
import { StepNameInput } from "./StepNameInput";
import { StepTargetInput } from "./StepTargetInput";

interface EditInputStepProps {
  step: InputStep;
  onUpdateStep: (stepId: string, step: Partial<InputStep>) => void;
  onClose: () => void;
}

const EditInputStep = memo<EditInputStepProps>(
  ({ step, onUpdateStep, onClose }) => {
    const [updatedStep, setUpdatedStep] = useState(step);

    const handleSave = (): void => {
      onUpdateStep(step.id, updatedStep);
      onClose();
    };

    const handleCancel = (): void => {
      setUpdatedStep(step);
      onClose();
    };

    return (
      <li className="rounded px-3 py-2 flex flex-col gap-2 text-xs bg-white border border-slate-300 mx-auto max-w-max list-none">
        <StepNameInput
          name={updatedStep.name}
          onChange={(name) => setUpdatedStep((prev) => ({ ...prev, name }))}
        />

        <div className="flex items-center gap-2">
          <label className="text-slate-600 w-12">Value:</label>
          <input
            type="text"
            value={updatedStep.value}
            onChange={(e) =>
              setUpdatedStep((prev) => ({ ...prev, value: e.target.value }))
            }
            className="border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-slate-500"
          />
        </div>

        <StepTargetInput
          target={updatedStep.target}
          onChange={(target) => setUpdatedStep((prev) => ({ ...prev, target }))}
        />

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
