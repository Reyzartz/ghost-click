import { NavigateStep } from "@/models";
import { memo, useState } from "react";
import { StepDelayInput } from "./StepDelayInput";
import { StepNameInput } from "./StepNameInput";
import { Navigation } from "lucide-react";
import {
  Text,
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/design-system";

interface EditNavigateStepProps {
  step: NavigateStep;
  isOpen: boolean;
  onUpdateStep: (stepId: string, step: Partial<NavigateStep>) => void;
  onClose: () => void;
}

export const EditNavigateStep = memo<EditNavigateStepProps>(
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
          <Navigation size={20} className="text-slate-600" />
          <Text variant="h2">Edit Navigate Step</Text>
        </ModalHeader>

        <ModalBody className="space-y-2">
          <StepNameInput
            name={updatedStep.name}
            onChange={(name) => setUpdatedStep((prev) => ({ ...prev, name }))}
          />

          <Input
            type="url"
            label="URL"
            value={updatedStep.url}
            onChange={(e) =>
              setUpdatedStep((prev) => ({ ...prev, url: e.target.value }))
            }
            placeholder="https://example.com"
          />

          <StepDelayInput
            delay={updatedStep.delay}
            onChange={(delay) => setUpdatedStep((prev) => ({ ...prev, delay }))}
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

EditNavigateStep.displayName = "EditNavigateStep";
