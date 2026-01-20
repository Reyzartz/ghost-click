import { ClickStep, InputStep, KeyPressStep, StepType } from "@/models";
import { memo, useState } from "react";
import { EditClickStep } from "./EditClickStep";
import { EditInputStep } from "./EditInputStep";
import { EditKeyPressStep } from "./EditKeyPressStep";
import { Button, Text } from "@/design-system";
import {
  KeyboardIcon,
  MousePointerClickIcon,
  PlusIcon,
  TextCursorInputIcon,
} from "lucide-react";

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
        className="cursor-pointer flex items-center justify-center gap-2 w-5 h-5 rounded-full border-[1.5px] border-dashed border-slate-300 text-slate-300 hover:border-slate-400 hover:text-slate-400 hover:bg-slate-50 transition-colors"
        title="Add new step"
      >
        <PlusIcon size={14} />
      </button>
    );
  }

  if (!selectedType) {
    return (
      <div className="flex flex-col gap-2 p-2 border border-dashed border-slate-300 rounded bg-slate-50">
        <Text variant="small" color="muted">
          Select Step Type:
        </Text>

        <div className="flex gap-2">
          <Button
            onClick={() => handleSelectType("CLICK")}
            variant="secondary"
            size="sm"
            icon={MousePointerClickIcon}
          >
            Click
          </Button>
          <Button
            onClick={() => handleSelectType("INPUT")}
            variant="secondary"
            size="sm"
            icon={TextCursorInputIcon}
          >
            Input
          </Button>
          <Button
            onClick={() => handleSelectType("KEYPRESS")}
            variant="secondary"
            size="sm"
            icon={KeyboardIcon}
          >
            Key Press
          </Button>
        </div>
        <Button variant="danger" size="sm" onClick={handleClose}>
          Cancel
        </Button>
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
