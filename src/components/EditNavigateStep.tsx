import { NavigateStep } from "@/models";
import { memo, useState } from "react";
import { StepDelayInput } from "./StepDelayInput";
import { StepNameInput } from "./StepNameInput";
import { GlobeIcon } from "lucide-react";
import {
  Text,
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/design-system";
import { MacroUtils } from "@/utils/MacroUtils";
import * as yup from "yup";

interface EditNavigateStepProps {
  step: NavigateStep;
  isOpen: boolean;
  onUpdateStep: (stepId: string, step: NavigateStep) => void;
  onClose: () => void;
}

export const EditNavigateStep = memo<EditNavigateStepProps>(
  ({ step, isOpen, onUpdateStep, onClose }) => {
    const [updatedStep, setUpdatedStep] = useState(step);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateField = (field: string, value: unknown): void => {
      try {
        const schema = yup.reach(
          MacroUtils.navigateStepSchema,
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
        MacroUtils.navigateStepSchema.validateSync(updatedStep, {
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
        <ModalHeader className="flex items-center gap-2">
          <GlobeIcon size={20} className="text-text-muted" />
          <Text variant="h2">Edit Navigate Step</Text>
        </ModalHeader>

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
            type="url"
            label="URL"
            value={updatedStep.url}
            onChange={(e) => {
              const url = e.target.value;
              setUpdatedStep((prev) => ({ ...prev, url }));
              validateField("url", url);
            }}
            placeholder="https://example.com"
            error={errors.url}
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
          <Button onClick={handleSave} variant="primary" fullWidth>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
);

EditNavigateStep.displayName = "EditNavigateStep";
