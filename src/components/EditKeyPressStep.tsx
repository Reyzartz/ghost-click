import { KeyPressStep } from "@/models";
import { memo, useRef, useState } from "react";

interface EditKeyPressStepProps {
  step: KeyPressStep;
  onUpdateStep: (stepId: string, step: Partial<KeyPressStep>) => void;
  onClose: () => void;
}

const EditKeyPressStep = memo<EditKeyPressStepProps>(
  ({ step, onUpdateStep, onClose }) => {
    const [nameInput, setNameInput] = useState(step.name);
    const [isRecording, setIsRecording] = useState(false);
    const [keyData, setKeyData] = useState({
      key: step.key,
      code: step.code,
      ctrlKey: step.ctrlKey,
      shiftKey: step.shiftKey,
      altKey: step.altKey,
      metaKey: step.metaKey,
    });
    const recordingInputRef = useRef<HTMLInputElement>(null);

    const handleSave = (): void => {
      const trimmedName = nameInput.trim();
      const updates: Partial<KeyPressStep> = {};

      if (trimmedName && trimmedName !== step.name) {
        updates.name = trimmedName;
      }

      if (
        keyData.key !== step.key ||
        keyData.code !== step.code ||
        keyData.ctrlKey !== step.ctrlKey ||
        keyData.shiftKey !== step.shiftKey ||
        keyData.altKey !== step.altKey ||
        keyData.metaKey !== step.metaKey
      ) {
        updates.key = keyData.key;
        updates.code = keyData.code;
        updates.ctrlKey = keyData.ctrlKey;
        updates.shiftKey = keyData.shiftKey;
        updates.altKey = keyData.altKey;
        updates.metaKey = keyData.metaKey;
      }

      if (Object.keys(updates).length > 0) {
        onUpdateStep(step.id, updates);
      }
      onClose();
    };

    const handleCancel = (): void => {
      setNameInput(step.name);
      setKeyData({
        key: step.key,
        code: step.code,
        ctrlKey: step.ctrlKey,
        shiftKey: step.shiftKey,
        altKey: step.altKey,
        metaKey: step.metaKey,
      });
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

      setKeyData({
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
      if (keyData.ctrlKey) modifiers.push("Ctrl");
      if (keyData.shiftKey) modifiers.push("Shift");
      if (keyData.altKey) modifiers.push("Alt");
      if (keyData.metaKey) modifiers.push("Cmd");

      const parts = [...modifiers, keyData.key];
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
        <div className="flex items-center gap-2">
          <label className="text-slate-600 w-16">Name:</label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCancel();
              else if (e.key === "Enter") handleSave();
            }}
            className="border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-slate-500"
            autoFocus
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-slate-600 w-16">Key:</label>
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
            <button
              onClick={toggleRecording}
              className="text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 whitespace-nowrap"
              title="Record key press"
            >
              {isRecording ? "Recording..." : "🎤 Record"}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={handleSave}
            className="cursor-pointer text-green-600 hover:text-green-700 px-2 py-1 rounded hover:bg-green-50"
            title="Save"
          >
            ✓ Save
          </button>
          <button
            onClick={handleCancel}
            className="cursor-pointer text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
            title="Cancel"
          >
            ✕ Cancel
          </button>
        </div>
      </li>
    );
  }
);

export { EditKeyPressStep };
