import { useState } from "react";

interface StepDelayItemProps {
  delay: number;
  stepId: string;
  onUpdateStepDelay: (stepId: string, newDelay: number) => void;
}

export const StepDelayItem = ({
  delay,
  stepId,
  onUpdateStepDelay,
}: StepDelayItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [delayInput, setDelayInput] = useState(delay.toString());

  const handleSave = (): void => {
    const trimmedDelay = delayInput.trim();
    const parsedDelay = parseInt(trimmedDelay, 10);

    if (!isNaN(parsedDelay) && parsedDelay >= 0 && parsedDelay !== delay) {
      onUpdateStepDelay(stepId, parsedDelay);
    }
    setIsEditing(false);
  };

  const handleCancel = (): void => {
    setDelayInput(delay.toString());
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (delay === 0) return null;

  if (isEditing) {
    return (
      <div className="flex justify-center py-1 group-last:hidden h-8">
        <div className="rounded border border-slate-300 bg-white px-3 py-1 text-xs flex items-center gap-2">
          <input
            type="number"
            value={delayInput}
            onChange={(e) => setDelayInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-none rounded px-2 py-1 text-xs focus:outline-none focus:border-slate-500 w-16"
            autoFocus
            min="0"
          />
          <span>ms</span>
          <button
            onClick={handleSave}
            className="text-green-600 hover:text-green-700 px-1"
            title="Save"
          >
            ✓
          </button>
          <button
            onClick={handleCancel}
            className="text-red-600 hover:text-red-700 px-1"
            title="Cancel"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-1 h-8 group-last:hidden group/delay">
      <div className="rounded border border-slate-300 bg-slate-50 px-3 py-1 text-xs text-slate-600 flex items-center gap-1">
        <span>{delay}ms</span>
        <button
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover/delay:opacity-100 text-slate-500 hover:text-slate-700 px-1"
          title="Edit delay"
        >
          ✎
        </button>
      </div>
    </div>
  );
};
