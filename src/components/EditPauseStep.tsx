import { PauseStep } from "@/models";
import { memo, useState } from "react";
import { StepDelayInput } from "./StepDelayInput";
import { StepNameInput } from "./StepNameInput";
import { CirclePauseIcon } from "lucide-react";
import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/design-system";
import { MacroUtils } from "@/utils/MacroUtils";
import * as yup from "yup";

interface EditPauseStepProps {
  step: PauseStep;
  isOpen: boolean;
  onUpdateStep: (stepId: string, step: PauseStep) => void;
  onClose: () => void;
}

export const EditPauseStep = memo<EditPauseStepProps>(
  ({ step, isOpen, onUpdateStep, onClose }) => {
    const [updatedStep, setUpdatedStep] = useState(step);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateField = (field: string, value: unknown): void => {
      try {
        const schema = yup.reach(
          MacroUtils.pauseStepSchema,
          field
        ) as yup.Schema;
        schema.validateSync(value);
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          setErrors((prev) => ({ ...prev, [field]: err.message }));
        }
      }
    };

    const validateAll = (): boolean => {
      try {
        MacroUtils.pauseStepSchema.validateSync(updatedStep, {
          abortEarly: false,
        });
        setErrors({});
        return true;
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          const newErrors: Record<string, string> = {};
          err.inner.forEach((error) => {
            if (error.path) {
              newErrors[error.path] = error.message;
            }
          });
          setErrors(newErrors);
        }
        return false;
      }
    };

    const handleSave = (): void => {
      if (!validateAll()) {
        return;
      }
      onUpdateStep(step.id, updatedStep);
      onClose();
    };

    const handleCancel = (): void => {
      setUpdatedStep(step);
      setErrors({});
      onClose();
    };

    return (
      <Modal isOpen={isOpen} onClose={handleCancel} maxWidth="md">
        <ModalHeader icon={CirclePauseIcon} title="Edit Pause Step" />

        <ModalBody className="space-y-2">
          <StepNameInput
            name={updatedStep.name}
            onChange={(name) => {
              setUpdatedStep((prev) => ({ ...prev, name }));
              validateField("name", name);
            }}
            error={errors.name}
          />

          <Input
            type="text"
            label="User instruction"
            info="This text is shown to the user during playback. Write a clear, actionable instruction — e.g. 'Log in, then click Resume' or 'Complete the CAPTCHA, then click Resume'."
            value={updatedStep.message}
            onChange={(e) => {
              const message = e.target.value;
              setUpdatedStep((prev) => ({ ...prev, message }));
            }}
            placeholder="e.g. Log in, then click Resume"
          />

          <StepDelayInput
            delay={updatedStep.delay}
            onChange={(delay) => {
              setUpdatedStep((prev) => ({ ...prev, delay }));
              validateField("delay", delay);
            }}
            error={errors.delay}
          />
        </ModalBody>

        <ModalFooter className="flex justify-end gap-2">
          <Button onClick={handleSave}>Save</Button>
        </ModalFooter>
      </Modal>
    );
  }
);

EditPauseStep.displayName = "EditPauseStep";
