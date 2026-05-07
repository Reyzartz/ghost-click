import { MacroStep, StepType } from "@/models";
import { useMemo, useState } from "react";
import { Modal, ModalHeader, ModalBody, Button } from "@/design-system";
import {
  GlobeIcon,
  KeyboardIcon,
  MousePointerClickIcon,
  TextCursorInputIcon,
} from "lucide-react";
import { MacroUtils } from "@/utils/MacroUtils";
import { EditClickStep } from "./EditClickStep";
import { EditInputStep } from "./EditInputStep";
import { EditKeyPressStep } from "./EditKeyPressStep";
import { EditNavigateStep } from "./EditNavigateStep";

interface StepEditorModalProps {
  step?: MacroStep;
  isOpen: boolean;
  onClose: () => void;
  onSave: (stepId: string, step: MacroStep) => void;
}

export const StepEditorModal = ({
  step,
  isOpen,
  onClose,
  onSave,
}: StepEditorModalProps) => {
  const [selectedType, setSelectedType] = useState<StepType | null>(
    step?.type ?? null
  );

  const handleClose = (): void => {
    setSelectedType(null);
    onClose();
  };

  const handleUpdateStep = (stepId: string, updatedStep: MacroStep): void => {
    onSave(stepId, updatedStep);
    handleClose();
  };

  const stepToEdit = useMemo(() => {
    if (step) return step;

    switch (selectedType) {
      case "CLICK":
        return MacroUtils.createClickStep();
      case "INPUT":
        return MacroUtils.createInputStep();
      case "KEYPRESS":
        return MacroUtils.createKeyPressStep();
      case "NAVIGATE":
        return MacroUtils.createNavigateStep();
      default:
        return null;
    }
  }, [step, selectedType]);

  if (selectedType) {
    switch (stepToEdit?.type) {
      case "CLICK":
        return (
          <EditClickStep
            step={stepToEdit}
            isOpen={isOpen}
            onUpdateStep={handleUpdateStep}
            onClose={handleClose}
          />
        );
      case "INPUT":
        return (
          <EditInputStep
            step={stepToEdit}
            isOpen={isOpen}
            onUpdateStep={handleUpdateStep}
            onClose={handleClose}
          />
        );
      case "KEYPRESS":
        return (
          <EditKeyPressStep
            step={stepToEdit}
            isOpen={isOpen}
            onUpdateStep={handleUpdateStep}
            onClose={handleClose}
          />
        );
      case "NAVIGATE":
        return (
          <EditNavigateStep
            step={stepToEdit}
            isOpen={isOpen}
            onUpdateStep={handleUpdateStep}
            onClose={handleClose}
          />
        );
      default:
        return null;
    }
  }

  return (
    <Modal isOpen={isOpen && !selectedType} onClose={handleClose} maxWidth="sm">
      <ModalHeader title="Select step type" />

      <ModalBody borderless>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => setSelectedType("CLICK")}
            variant="outlined"
            color="secondary"
            icon={MousePointerClickIcon}
          >
            Click
          </Button>
          <Button
            onClick={() => setSelectedType("INPUT")}
            variant="outlined"
            color="secondary"
            icon={TextCursorInputIcon}
          >
            Input
          </Button>
          <Button
            onClick={() => setSelectedType("KEYPRESS")}
            variant="outlined"
            color="secondary"
            icon={KeyboardIcon}
          >
            Key Press
          </Button>
          <Button
            onClick={() => setSelectedType("NAVIGATE")}
            variant="outlined"
            color="secondary"
            icon={GlobeIcon}
          >
            Navigate
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};
