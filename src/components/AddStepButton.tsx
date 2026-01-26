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
  disabled?: boolean;
}

const AddStepButton = memo<AddStepButtonProps>(({ onAddStep, disabled=false }) => {
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
    type: StepType,
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
    updates: Partial<ClickStep | InputStep | KeyPressStep>,
  ): void => {
    if (!selectedType) return;

    const newStep = {
      ...createEmptyStep(selectedType),
      ...updates,
    } as ClickStep | InputStep | KeyPressStep;

    onAddStep(newStep);
    handleClose();
  };

  if (!selectedType || !isAdding) {
    return (
      <div
        className={`group/add flex flex-col gap-2 p-2 border-dashed border-[1.5px] border-slate-300 bg-slate-50 transition-all duration-300 ease-in-out overflow-hidden ${
          disabled? "w-0 h-0 cursor-not-allowed overflow-hidden px-0 py-0" :
            !isAdding
              ? "cursor-pointer items-center justify-center w-6 h-6 rounded-2xl hover:border-slate-400"
              : "w-74 h-28 rounded"
        }`}
      >
        {!selectedType && isAdding && (
          <>
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
          </>
        )}

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            title="Add new step"
            className={`duration-300 flex justify-center items-center text-slate-300 group-hover/add:text-slate-400 ${disabled ? "cursor-not-allowed" : "cursor-pointer" }`}
            disabled={disabled}
          >
            <PlusIcon size={14} />
          </button>
        )}
      </div>
    );
  }

  const emptyStep = createEmptyStep(selectedType);

  return (
    <div className="flex flex-col items-center">
      {selectedType === "CLICK" && (
        <EditClickStep
          step={emptyStep as ClickStep}
          isOpen={true}
          onUpdateStep={handleAddStep}
          onClose={handleClose}
        />
      )}
      {selectedType === "INPUT" && (
        <EditInputStep
          step={emptyStep as InputStep}
          isOpen={true}
          onUpdateStep={handleAddStep}
          onClose={handleClose}
        />
      )}
      {selectedType === "KEYPRESS" && (
        <EditKeyPressStep
          step={emptyStep as KeyPressStep}
          isOpen={true}
          onUpdateStep={handleAddStep}
          onClose={handleClose}
        />
      )}
    </div>
  );
});

export { AddStepButton };
