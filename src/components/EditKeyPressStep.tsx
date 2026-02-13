import { KeyPressStep } from "@/models";
import { clsx } from "clsx";
import { memo, useRef, useState } from "react";
import { StepDelayInput } from "./StepDelayInput";
import { StepNameInput } from "./StepNameInput";
import { KeyboardIcon } from "lucide-react";
import { StepRetryInput } from "./StepRetryInput";
import { StepTargetInput } from "./StepTargetInput";
import {
  Text,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Icon,
} from "@/design-system";
import { MacroUtils } from "@/utils/MacroUtils";
import * as yup from "yup";

interface EditKeyPressStepProps {
  step: KeyPressStep;
  isOpen: boolean;
  onUpdateStep: (stepId: string, step: KeyPressStep) => void;
  onClose: () => void;
}

const EditKeyPressStep = memo<EditKeyPressStepProps>(
  ({ step, isOpen, onUpdateStep, onClose }) => {
    const [updatedStep, setUpdatedStep] = useState(step);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isRecording, setIsRecording] = useState(false);
    const recordingInputRef = useRef<HTMLInputElement>(null);

    const validateField = (field: string, value: unknown): void => {
      try {
        const schema = yup.reach(
          MacroUtils.keyPressStepSchema,
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
        MacroUtils.keyPressStepSchema.validateSync(updatedStep, {
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (!isRecording) {
        if (e.key === "Escape") {
          handleCancel();
        } else if (e.key === "Enter") {
          handleSave();
        }
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      // Skip pure modifier keys
      if (["Control", "Shift", "Alt", "Meta"].includes(e.key)) {
        return;
      }

      setUpdatedStep({
        ...updatedStep,
        key: e.key,
        code: e.code,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey,
      });
      validateField("key", e.key);
      setIsRecording(false);

      // Blur the input to stop recording
      recordingInputRef.current?.blur();
    };

    const formatKeyDisplay = (): string => {
      const modifiers: string[] = [];
      if (updatedStep.ctrlKey) modifiers.push("Ctrl");
      if (updatedStep.shiftKey) modifiers.push("Shift");
      if (updatedStep.altKey) modifiers.push("Alt");
      if (updatedStep.metaKey) modifiers.push("Cmd");

      const parts = [...modifiers, updatedStep.key];
      return parts.join(" + ");
    };

    const onStartRecording = (): void => {
      setIsRecording(true);
    };

    const onStopRecording = (): void => {
      setIsRecording(false);
    };

    return (
      <Modal isOpen={isOpen} onClose={handleCancel} maxWidth="md">
        <ModalHeader className="flex items-center gap-2">
          <Icon icon={KeyboardIcon} size="md" color="muted" />
          <Text variant="h2">Edit Key Press Step</Text>
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
            ref={recordingInputRef}
            type="text"
            label="Key Combination"
            value={isRecording ? "Press any key..." : formatKeyDisplay()}
            onKeyDown={handleKeyDown}
            onFocus={onStartRecording}
            onBlur={onStopRecording}
            readOnly
            className={clsx(
              "cursor-pointer",
              isRecording ? "border-info-border bg-info-bg" : "bg-surface-muted"
            )}
            placeholder="Click to record"
            error={errors.key}
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

export { EditKeyPressStep };
