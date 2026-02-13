import { ClickStep } from "@/models";
import { memo, useState } from "react";
import { StepDelayInput } from "./StepDelayInput";
import { StepNameInput } from "./StepNameInput";
import { StepRetryInput } from "./StepRetryInput";
import { StepTargetInput } from "./StepTargetInput";
import { MousePointerClickIcon } from "lucide-react";
import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  Icon,
} from "@/design-system";
import { MacroUtils } from "@/utils/MacroUtils";
import * as yup from "yup";

interface EditClickStepProps {
  step: ClickStep;
  isOpen: boolean;
  onUpdateStep: (stepId: string, step: ClickStep) => void;
  onClose: () => void;
}

const EditClickStep = memo<EditClickStepProps>(
  ({ step, isOpen, onUpdateStep, onClose }) => {
    const [updatedStep, setUpdatedStep] = useState(step);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateField = (field: string, value: unknown): void => {
      try {
        const schema = yup.reach(
          MacroUtils.clickStepSchema,
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
        MacroUtils.clickStepSchema.validateSync(updatedStep, {
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
          <Icon icon={MousePointerClickIcon} size="md" color="muted" />
          <Text variant="h2">Edit Click Step</Text>
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

          <StepDelayInput
            delay={updatedStep.delay}
            onChange={(delay) => {
              setUpdatedStep((prev) => ({ ...prev, delay }));
              validateField("delay", delay);
            }}
            error={errors.delay}
          />

          <Input
            type="number"
            label="Clicks Count"
            value={updatedStep.clicksCount}
            onChange={(e) => {
              const clicksCount = parseInt(e.target.value, 10);
              setUpdatedStep((prev) => ({ ...prev, clicksCount }));
              validateField("clicksCount", clicksCount);
            }}
            min={1}
            max={100}
            error={errors.clicksCount}
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

export { EditClickStep };
