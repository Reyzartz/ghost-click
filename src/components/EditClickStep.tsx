import { ClickStep } from "@/models";
import { memo, useState } from "react";
import { StepDelayInput } from "./StepDelayInput";
import { StepNameInput } from "./StepNameInput";
import { StepRetryInput } from "./StepRetryInput";
import { StepTargetInput } from "./StepTargetInput";
import { Check, X } from "lucide-react";
import { Button } from "@/design-system";

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

        <StepDelayInput
          delay={updatedStep.delay}
          onChange={(delay) => setUpdatedStep((prev) => ({ ...prev, delay }))}
        />

        <div className="flex items-center gap-2 justify-end">
          <Button onClick={handleSave} variant="success" size="sm" icon={Check}>
            Save
          </Button>
          <Button onClick={handleCancel} variant="danger" size="sm" icon={X}>
            Cancel
          </Button>
        </div>
      </li>
    );
  }
);

export { EditClickStep };
