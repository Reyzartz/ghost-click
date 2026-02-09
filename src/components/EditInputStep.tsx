import { InputStep } from "@/models";
import { memo, useState } from "react";
import { StepDelayInput } from "./StepDelayInput";
import { StepNameInput } from "./StepNameInput";
import { StepRetryInput } from "./StepRetryInput";
import { StepTargetInput } from "./StepTargetInput";
import { TextCursorInputIcon } from "lucide-react";
import {
  Text,
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/design-system";

interface EditInputStepProps {
  step: InputStep;
  isOpen: boolean;
  onUpdateStep: (stepId: string, step: InputStep) => void;
  onClose: () => void;
}

const EditInputStep = memo<EditInputStepProps>(
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
          <TextCursorInputIcon size={20} className="text-slate-600" />
          <Text variant="h2">Edit Input Step</Text>
        </ModalHeader>

        <ModalBody className="space-y-2">
          <StepNameInput
            name={updatedStep.name}
            onChange={(name) => setUpdatedStep((prev) => ({ ...prev, name }))}
          />

          <Input
            type="text"
            label="Value"
            value={updatedStep.value}
            onChange={(e) =>
              setUpdatedStep((prev) => ({ ...prev, value: e.target.value }))
            }
            placeholder="Enter value"
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

export { EditInputStep };
