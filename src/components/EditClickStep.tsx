import { ClickStep } from "@/models";
import { memo, useState } from "react";
import { StepDelayInput } from "./StepDelayInput";
import { StepNameInput } from "./StepNameInput";
import { StepRetryInput } from "./StepRetryInput";
import { StepTargetInput } from "./StepTargetInput";
import { MousePointerClickIcon } from "lucide-react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
} from "@/design-system";

interface EditClickStepProps {
  step: ClickStep;
  isOpen: boolean;
  onUpdateStep: (stepId: string, step: Partial<ClickStep>) => void;
  onClose: () => void;
}

const EditClickStep = memo<EditClickStepProps>(
  ({ step, isOpen, onUpdateStep, onClose }) => {
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
      <Modal isOpen={isOpen} onClose={handleCancel} maxWidth="md">
        <ModalHeader className="flex items-center gap-2">
          <MousePointerClickIcon size={20} className="text-slate-600" />
          <Text variant="h2">Edit Click Step</Text>
        </ModalHeader>

        <ModalBody className="space-y-2">
          <StepNameInput
            name={updatedStep.name}
            onChange={(name) => setUpdatedStep((prev) => ({ ...prev, name }))}
          />

          <StepDelayInput
            delay={updatedStep.delay}
            onChange={(delay) => setUpdatedStep((prev) => ({ ...prev, delay }))}
          />

          <StepTargetInput
            target={updatedStep.target}
            onChange={(target) =>
              setUpdatedStep((prev) => ({ ...prev, target }))
            }
          />

          <StepRetryInput
            retryCount={updatedStep.retryCount}
            retryInterval={updatedStep.retryInterval}
            onChange={(updates) =>
              setUpdatedStep((prev) => ({ ...prev, ...updates }))
            }
          />
        </ModalBody>

        <ModalFooter className="flex justify-end gap-2">
          <Button onClick={handleSave} variant="primary" fullWidth>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
);

export { EditClickStep };
