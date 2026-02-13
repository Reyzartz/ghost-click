import { MacroStep, StepType } from "@/models";
import { clsx } from "clsx";
import { memo, useState } from "react";
import { EditClickStep } from "./EditClickStep";
import { EditInputStep } from "./EditInputStep";
import { EditKeyPressStep } from "./EditKeyPressStep";
import { Button, Text, Icon } from "@/design-system";
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
  onAddStep: (step: MacroStep) => void;
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

    const handleAddStep = (_stepId: string, updatedStep: MacroStep): void => {
      if (!selectedType) return;

      onAddStep(updatedStep);
      handleClose();
    };

    if (!selectedType || !isAdding) {
      return (
        <div
          className={clsx(
            "group/add border-border-secondary flex flex-col gap-2 overflow-hidden border-[1.5px] border-dashed transition-all duration-300 ease-in-out",
            disabled
              ? "h-0 w-0 cursor-not-allowed overflow-hidden px-0 py-0"
              : !isAdding
                ? "hover:border-border-hover h-6 w-6 cursor-pointer rounded-2xl"
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
                "text-text-disabled group-hover/add:text-text-muted flex h-full w-full items-center justify-center duration-300",
                disabled ? "cursor-not-allowed" : "cursor-pointer"
              )}
              disabled={disabled}
            >
              <Icon icon={PlusIcon} size="sm" color="muted" />
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center">
        {selectedType === "CLICK" && (
          <EditClickStep
            step={MacroUtils.createClickStep()}
            isOpen={true}
            onUpdateStep={handleAddStep}
            onClose={handleClose}
          />
        )}
        {selectedType === "INPUT" && (
          <EditInputStep
            step={MacroUtils.createInputStep()}
            isOpen={true}
            onUpdateStep={handleAddStep}
            onClose={handleClose}
          />
        )}
        {selectedType === "KEYPRESS" && (
          <EditKeyPressStep
            step={MacroUtils.createKeyPressStep()}
            isOpen={true}
            onUpdateStep={handleAddStep}
            onClose={handleClose}
          />
        )}
        {selectedType === "NAVIGATE" && (
          <EditNavigateStep
            step={MacroUtils.createNavigateStep()}
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
