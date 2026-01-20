import { KeyPressStep } from "@/models";
import { memo, useRef, useState } from "react";
import { StepDelayInput } from "./StepDelayInput";
import { StepNameInput } from "./StepNameInput";
import { Check, KeyboardIcon, X } from "lucide-react";
import { StepRetryInput } from "./StepRetryInput";
import { StepTargetInput } from "./StepTargetInput";
import { Text as TextComponent, Button } from "@/design-system";

interface EditKeyPressStepProps {
  step: KeyPressStep;
  onUpdateStep: (stepId: string, step: Partial<KeyPressStep>) => void;
  onClose: () => void;
}

const EditKeyPressStep = memo<EditKeyPressStepProps>(
  ({ step, onUpdateStep, onClose }) => {
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

    const toggleRecording = (): void => {
      if (isRecording) {
        setIsRecording(false);
        return;
      }

      setIsRecording(true);
      setTimeout(() => {
        recordingInputRef.current?.focus();
      }, 0);
    };

    return (
      <li className="rounded px-3 py-2 flex flex-col gap-2 text-xs bg-white border border-slate-300 mx-auto max-w-max list-none">
        <StepNameInput
          name={updatedStep.name}
          onChange={(name) => setUpdatedStep((prev) => ({ ...prev, name }))}
        />

        <div className="flex items-center gap-2">
          <TextComponent variant="small" color="muted" className="w-12">
            Key:
          </TextComponent>
          <div className="flex items-center gap-2">
            <input
              ref={recordingInputRef}
              type="text"
              value={isRecording ? "Press any key..." : formatKeyDisplay()}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsRecording(true)}
              onBlur={() => setIsRecording(false)}
              readOnly
              className={`border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500 cursor-pointer ${
                isRecording ? "bg-blue-50 border-blue-400" : "bg-slate-50"
              }`}
              placeholder="Click to record"
            />
            <Button onClick={toggleRecording} icon={KeyboardIcon} size="sm">
              {isRecording ? "Recording..." : "Record"}
            </Button>
          </div>
        </div>

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

export { EditKeyPressStep };
