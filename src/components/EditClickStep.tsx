import { ClickStep } from "@/models";
import { memo, useState } from "react";
import { StepNameInput } from "./StepNameInput";
import { StepRetryInput } from "./StepRetryInput";
import { StepTargetInput } from "./StepTargetInput";

interface EditClickStepProps {
  step: ClickStep;
  onUpdateStep: (stepId: string, step: Partial<ClickStep>) => void;
  onClose: () => void;
}

const EditClickStep = memo<EditClickStepProps>(
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

        <StepTargetInput
          target={updatedStep.target}
          onChange={(target) => setUpdatedStep((prev) => ({ ...prev, target }))}
        />

        <StepRetryInput
          retryCount={updatedStep.retryCount}
          retryInterval={updatedStep.retryInterval}
          onChange={(updates) =>
            setUpdatedStep((prev) => ({ ...prev, ...updates }))
          }
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

export { EditClickStep };
