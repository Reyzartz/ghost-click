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
} from "@/design-system";

interface EditKeyPressStepProps {
  step: KeyPressStep;
  isOpen: boolean;
  onUpdateStep: (stepId: string, step: Partial<KeyPressStep>) => void;
  onClose: () => void;
}

const EditKeyPressStep = memo<EditKeyPressStepProps>(
  ({ step, isOpen, onUpdateStep, onClose }) => {
    const [updatedStep, setUpdatedStep] = useState(step);
    const [isRecording, setIsRecording] = useState(false);
    const recordingInputRef = useRef<HTMLInputElement>(null);

    const handleSave = (): void => {
      onUpdateStep(step.id, updatedStep);
      onClose();
    };

    const handleCancel = (): void => {
      setUpdatedStep(step);
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
          <KeyboardIcon size={20} className="text-slate-600" />
          <Text variant="h2">Edit Key Press Step</Text>
        </ModalHeader>

        <ModalBody className="space-y-2">
          <StepNameInput
            name={updatedStep.name}
            onChange={(name) => setUpdatedStep((prev) => ({ ...prev, name }))}
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
              isRecording ? "border-blue-400 bg-blue-50" : "bg-slate-50"
            )}
            placeholder="Click to record"
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

export { EditKeyPressStep };
