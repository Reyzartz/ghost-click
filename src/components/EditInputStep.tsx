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
  Icon,
} from "@/design-system";
import { MacroUtils } from "@/utils/MacroUtils";
import * as yup from "yup";

interface EditInputStepProps {
  step: InputStep;
  isOpen: boolean;
  onUpdateStep: (stepId: string, step: InputStep) => void;
  onClose: () => void;
}

const EditInputStep = memo<EditInputStepProps>(
  ({ step, isOpen, onUpdateStep, onClose }) => {
    const [updatedStep, setUpdatedStep] = useState(step);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateField = (field: string, value: unknown): void => {
      try {
        const schema = yup.reach(
          MacroUtils.inputStepSchema,
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
        MacroUtils.inputStepSchema.validateSync(updatedStep, {
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
          <Icon icon={TextCursorInputIcon} size="md" color="muted" />
          <Text variant="h2">Edit Input Step</Text>
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
            type="text"
            label="Value"
            value={updatedStep.value}
            onChange={(e) => {
              const value = e.target.value;
              setUpdatedStep((prev) => ({ ...prev, value }));
              validateField("value", value);
            }}
            placeholder="Enter value"
            error={errors.value}
          />

          <StepDelayInput
            delay={updatedStep.delay}
            onChange={(delay) => {
              setUpdatedStep((prev) => ({ ...prev, delay }));
              validateField("delay", delay);
            }}
            error={errors.delay}
          />

          <StepTargetInput
            target={updatedStep.target}
            onChange={(target) => {
              setUpdatedStep((prev) => ({ ...prev, target }));
              validateField("target", target);
            }}
            error={errors.target}
          />

          <StepRetryInput
            retryCount={updatedStep.retryCount}
            retryInterval={updatedStep.retryInterval}
            onChange={(updates) => {
              setUpdatedStep((prev) => ({ ...prev, ...updates }));
              validateField("retryCount", updates.retryCount);
              validateField("retryInterval", updates.retryInterval);
            }}
            retryCountError={errors.retryCount}
            retryIntervalError={errors.retryInterval}
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
