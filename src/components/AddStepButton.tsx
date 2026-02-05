import {
  ClickStep,
  InputStep,
  KeyPressStep,
  NavigateStep,
  StepType,
} from "@/models";
import { clsx } from "clsx";
import { memo, useState } from "react";
import { EditClickStep } from "./EditClickStep";
import { EditInputStep } from "./EditInputStep";
import { EditKeyPressStep } from "./EditKeyPressStep";
import { Button, Text } from "@/design-system";
import {
  GlobeIcon,
  KeyboardIcon,
  MousePointerClickIcon,
  PlusIcon,
  TextCursorInputIcon,
} from "lucide-react";
import { MacroUtils } from "@/utils/MacroUtils";
import { EditNavigateStep } from "./EditNavigateStep";

interface AddStepButtonProps {
  onAddStep: (
    step: ClickStep | InputStep | KeyPressStep | NavigateStep
  ) => void;
  disabled?: boolean;
}

const AddStepButton = memo<AddStepButtonProps>(
  ({ onAddStep, disabled = false }) => {
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
    ): ClickStep | InputStep | KeyPressStep | NavigateStep => {
      const baseStep = {
        id: MacroUtils.generateStepId(),
        name: MacroUtils.getStepName("<unknown>", type),
        // TODO: this filed will remove in the future, need to update all related code
        // eslint-disable-next-line react-hooks/purity
        timestamp: Date.now(),
        delay: 1000,
        retryCount: MacroUtils.DEFAULT_RETRY_COUNT,
        retryInterval: MacroUtils.DEFAULT_RETRY_INTERVAL_MS,
        target: {
          id: "",
          className: "",
          xpath: "",
          defaultSelector: MacroUtils.DEFAULT_SELECTOR_TYPE,
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
        case "NAVIGATE":
          return {
            ...baseStep,
            type: "NAVIGATE",
            url: "",
          } as NavigateStep;
      }
    };

    const handleAddStep = (
      _stepId: string,
      updates: Partial<ClickStep | InputStep | KeyPressStep | NavigateStep>
    ): void => {
      if (!selectedType) return;

      const newStep = {
        ...createEmptyStep(selectedType),
        ...updates,
      } as ClickStep | InputStep | KeyPressStep | NavigateStep;

      onAddStep(newStep);
      handleClose();
    };

    if (!selectedType || !isAdding) {
      return (
        <div
          className={clsx(
            "group/add flex flex-col gap-2 overflow-hidden border-[1.5px] border-dashed border-slate-300 bg-slate-50 transition-all duration-300 ease-in-out",
            disabled
              ? "h-0 w-0 cursor-not-allowed overflow-hidden px-0 py-0"
              : !isAdding
                ? "h-6 w-6 cursor-pointer rounded-2xl hover:border-slate-400"
                : "h-37 w-74 rounded p-2"
          )}
        >
          {!selectedType && isAdding && (
            <>
              <Text variant="small" color="muted">
                Select Step Type:
              </Text>

              <div className="grid grid-cols-2 gap-2">
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
                <Button
                  onClick={() => handleSelectType("NAVIGATE")}
                  variant="secondary"
                  size="sm"
                  icon={GlobeIcon}
                >
                  Navigate
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
              className={clsx(
                "flex h-full w-full items-center justify-center text-slate-300 duration-300 group-hover/add:text-slate-400",
                disabled ? "cursor-not-allowed" : "cursor-pointer"
              )}
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
        {selectedType === "NAVIGATE" && (
          <EditNavigateStep
            step={emptyStep as NavigateStep}
            isOpen={true}
            onUpdateStep={handleAddStep}
            onClose={handleClose}
          />
        )}
      </div>
    );
  }
);

export { AddStepButton };
