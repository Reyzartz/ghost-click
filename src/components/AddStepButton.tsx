import { ClickStep, InputStep, KeyPressStep, StepType } from "@/models";
import { memo, useState } from "react";
import { EditClickStep } from "./EditClickStep";
import { EditInputStep } from "./EditInputStep";
import { EditKeyPressStep } from "./EditKeyPressStep";

interface AddStepButtonProps {
  onAddStep: (step: ClickStep | InputStep | KeyPressStep) => void;
}

const AddStepButton = memo<AddStepButtonProps>(({ onAddStep }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedType, setSelectedType] = useState<StepType | null>(null);

  const handleSelectType = (type: StepType): void => {
    setSelectedType(type);
  };

  const handleClose = (): void => {
    setSelectedType(null);
    setIsAdding(false);
  };

  const createEmptyStep = (
    type: StepType
  ): ClickStep | InputStep | KeyPressStep => {
    const baseStep = {
      id: crypto.randomUUID(),
      name: `New ${type} step`,
      timestamp: Date.now(),
      delay: 1000,
      retryCount: 0,
      retryInterval: 1000,
      target: {
        id: "",
        className: "",
        xpath: "",
        defaultSelector: "xpath" as const,
      },
    };

    switch (type) {
      case "CLICK":
        return {
          ...baseStep,
          type: "CLICK",
        } as ClickStep;
      case "INPUT":
        return {
          ...baseStep,
          type: "INPUT",
          value: "",
        } as InputStep;
      case "KEYPRESS":
        return {
          ...baseStep,
          type: "KEYPRESS",
          key: "",
          code: "",
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
          metaKey: false,
        } as KeyPressStep;
    }
  };

  const handleAddStep = (
    _stepId: string,
    updates: Partial<ClickStep | InputStep | KeyPressStep>
  ): void => {
    if (!selectedType) return;

    const newStep = {
      ...createEmptyStep(selectedType),
      ...updates,
    } as ClickStep | InputStep | KeyPressStep;

    onAddStep(newStep);
    handleClose();
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="cursor-pointer flex items-center justify-center gap-2 w-5 h-5 rounded-full border border-dashed border-slate-300 text-slate-300 hover:border-slate-400 hover:text-slate-400 hover:bg-slate-50 transition-colors leading-3"
        title="Add new step"
      >
        +
      </button>
    );
  }

  if (!selectedType) {
    return (
      <div className="flex flex-col gap-2 p-2 border border-dashed border-slate-300 rounded bg-slate-50">
        <label className="text-slate-600 text-[10px]">Select Step Type:</label>

        <div className="flex gap-2">
          <button
            onClick={() => handleSelectType("CLICK")}
            className="cursor-pointer px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-sm hover:bg-slate-100 transition-colors flex items-center gap-2"
          >
            <span className="text-sm">🖱️</span>
            <span>Click</span>
          </button>
          <button
            onClick={() => handleSelectType("INPUT")}
            className="cursor-pointer px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-sm hover:bg-slate-100 transition-colors flex items-center gap-2"
          >
            <span className="text-sm">⌨️</span>
            <span>Input</span>
          </button>
          <button
            onClick={() => handleSelectType("KEYPRESS")}
            className="cursor-pointer px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-sm hover:bg-slate-100 transition-colors flex items-center gap-2"
          >
            <span className="text-sm">🎹</span>
            <span>Keypress</span>
          </button>
        </div>
        <button
          onClick={handleClose}
          className="cursor-pointer text-xs text-slate-500 hover:text-slate-700"
        >
          Cancel
        </button>
      </div>
    );
  }

  const emptyStep = createEmptyStep(selectedType);

  return (
    <div className="flex flex-col items-center">
      {selectedType === "CLICK" && (
        <EditClickStep
          step={emptyStep as ClickStep}
          onUpdateStep={handleAddStep}
          onClose={handleClose}
        />
      )}
      {selectedType === "INPUT" && (
        <EditInputStep
          step={emptyStep as InputStep}
          onUpdateStep={handleAddStep}
          onClose={handleClose}
        />
      )}
      {selectedType === "KEYPRESS" && (
        <EditKeyPressStep
          step={emptyStep as KeyPressStep}
          onUpdateStep={handleAddStep}
          onClose={handleClose}
        />
      )}
    </div>
  );
});

export { AddStepButton };
