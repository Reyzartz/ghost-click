import { MacroStep } from "@/models";
import { useCallback, useState, useRef, useEffect, useMemo } from "react";
import { StepEditorModal } from "./StepEditorModal";
import { StepItemCard } from "./StepItemCard";
import { ArrowUp, ArrowDown, Trash2, EditIcon } from "lucide-react";

interface EditStepItemProps {
  step: MacroStep;
  index: number;
  isDeleted?: boolean;
  isNew?: boolean;
  handleUpdateStep: (stepId: string, step: Partial<MacroStep>) => void;
  handleDeleteStep?: (stepId: string) => void;
  handleUndoDelete?: (stepId: string) => void;
  onAddAbove?: (step: MacroStep) => void;
  onAddBelow?: (step: MacroStep) => void;
  isEditDisabled?: boolean;
  isCurrent?: boolean;
  isCompleted?: boolean;
  isErrored?: boolean;
  isPlaying?: boolean;
  isPaused?: boolean;
}

export const EditStepItem = ({
  step,
  handleUpdateStep,
  handleDeleteStep,
  handleUndoDelete,
  onAddAbove,
  onAddBelow,
  isNew = false,
  isDeleted = false,
  isEditDisabled = false,
  isCurrent = false,
  isCompleted = false,
  isErrored = false,
  isPlaying = false,
  isPaused = false,
}: EditStepItemProps) => {
  const [stepState, setStepState] = useState<"editing" | "adding" | null>(null);
  const [addDirection, setAddDirection] = useState<"above" | "below" | null>(
    null
  );
  const stepRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (isCurrent && stepRef.current) {
      stepRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [isCurrent]);

  const onEditHandler = useCallback(() => {
    if (isDeleted || isEditDisabled) return;
    setStepState("editing");
  }, [isDeleted, isEditDisabled]);

  const onAddAboveHandler = useCallback(() => {
    if (isDeleted) return;
    setAddDirection("above");
    setStepState("adding");
  }, [isDeleted]);

  const onAddBelowHandler = useCallback(() => {
    if (isDeleted) return;
    setAddDirection("below");
    setStepState("adding");
  }, [isDeleted]);

  const dropdownItems = useMemo(() => {
    if (isDeleted) return [];

    const items = [];
    if (!isEditDisabled) {
      items.push({
        label: "Edit step",
        icon: EditIcon,
        onClick: onEditHandler,
      });
    }
    if (onAddAbove) {
      items.push({
        label: "Add step above",
        icon: ArrowUp,
        onClick: onAddAboveHandler,
      });
    }
    if (onAddBelow) {
      items.push({
        label: "Add step below",
        icon: ArrowDown,
        onClick: onAddBelowHandler,
      });
    }
    if (handleDeleteStep) {
      items.push({
        label: "Delete step",
        icon: Trash2,
        variant: "danger" as const,
        onClick: () => handleDeleteStep(step.id),
      });
    }

    return items;
  }, [
    handleDeleteStep,
    isDeleted,
    isEditDisabled,
    onAddAbove,
    onAddAboveHandler,
    onAddBelow,
    onAddBelowHandler,
    onEditHandler,
    step.id,
  ]);

  const onAddStepHandler = useCallback(
    (newStep: MacroStep) => {
      switch (addDirection) {
        case "above":
          if (onAddAbove) onAddAbove(newStep);
          break;
        case "below":
          if (onAddBelow) onAddBelow(newStep);
          break;
      }
      setAddDirection(null);
    },
    [addDirection, onAddAbove, onAddBelow]
  );

  const onSaveStepHandler = useCallback(
    (stepId: string, updatedStep: MacroStep) => {
      switch (stepState) {
        case "editing":
          handleUpdateStep(stepId, updatedStep);
          break;
        case "adding":
          onAddStepHandler(updatedStep);
          break;
      }
      setStepState(null);
    },
    [handleUpdateStep, onAddStepHandler, stepState]
  );

  const onStepEditorCloseHandler = useCallback(() => {
    setStepState(null);
    setAddDirection(null);
  }, []);

  const stepToEdit = useMemo(() => {
    if (stepState === "editing") return step;
    if (stepState === "adding") return;
  }, [stepState, step]);

  return (
    <>
      {stepState && (
        <StepEditorModal
          step={stepToEdit}
          isOpen={stepState !== null}
          onClose={onStepEditorCloseHandler}
          onSave={onSaveStepHandler}
        />
      )}

      <StepItemCard
        ref={stepRef}
        step={step}
        isDeleted={isDeleted}
        isNew={isNew}
        isDisabled={isEditDisabled}
        isCurrent={isCurrent}
        isCompleted={isCompleted}
        isErrored={isErrored}
        isPlaying={isPlaying}
        isPaused={isPaused}
        dropdownItems={dropdownItems}
        onClick={onEditHandler}
        onUndoDelete={handleUndoDelete}
      />
    </>
  );
};
