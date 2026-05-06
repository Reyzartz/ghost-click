import { useState } from "react";
import { StepEditorModal } from "@/components/StepEditorModal";
import { EditStepItem } from "@/components/EditStepItem";
import { Text, Button } from "@/design-system";
import { Plus } from "lucide-react";
import { Macro, MacroStep } from "@/models";

interface MacroStepsEditorProps {
  macro: Macro;
  deletedStepIds: Set<string>;
  newStepIds: Set<string>;
  isPlaying: boolean;
  currentStepId: string | null;
  completedStepIds: string[];
  erroredStepIds: string[];
  onUpdateStep: (stepId: string, step: Partial<MacroStep>) => void;
  onAddStep: (step: MacroStep, position: number) => void;
  onDeleteStep: (stepId: string) => void;
  onUndoDelete: (stepId: string) => void;
}

export const MacroStepsEditor = ({
  macro,
  deletedStepIds,
  newStepIds,
  isPlaying,
  currentStepId,
  completedStepIds,
  erroredStepIds,
  onUpdateStep,
  onAddStep,
  onDeleteStep,
  onUndoDelete,
}: MacroStepsEditorProps) => {
  const [addModalPosition, setAddModalPosition] = useState<number | null>(null);

  return (
    <div className="flex grow flex-col overflow-hidden">
      <Text variant="small" className="mb-1" color="muted">
        Steps ({macro.steps.length})
      </Text>

      <StepEditorModal
        isOpen={addModalPosition !== null}
        onClose={() => setAddModalPosition(null)}
        onSave={(_, step) => {
          if (addModalPosition !== null) onAddStep(step, addModalPosition);
          setAddModalPosition(null);
        }}
      />

      <div className="grow overflow-scroll">
        {macro.steps.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <Text className="text-center" color="muted">
              No steps added yet.
            </Text>
            <Button
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={() => setAddModalPosition(0)}
              disabled={isPlaying}
            >
              Add step
            </Button>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center gap-1.5">
            {macro.steps.map((step, index) => {
              return (
                <div
                  key={step.id}
                  className="group flex w-full flex-col items-center"
                >
                  <EditStepItem
                    step={step}
                    index={index}
                    handleUpdateStep={onUpdateStep}
                    handleDeleteStep={onDeleteStep}
                    isDeleted={deletedStepIds.has(step.id)}
                    isNew={newStepIds.has(step.id)}
                    isEditDisabled={isPlaying}
                    handleUndoDelete={onUndoDelete}
                    onAddAbove={(s) => onAddStep(s, index)}
                    onAddBelow={(s) => onAddStep(s, index + 1)}
                    isCurrent={currentStepId === step.id}
                    isCompleted={completedStepIds.includes(step.id)}
                    isErrored={erroredStepIds.includes(step.id)}
                    isPlaying={isPlaying}
                  />
                </div>
              );
            })}

            <Button
              variant="secondary"
              className="border-dashed"
              onClick={() => setAddModalPosition(macro.steps.length)}
              fullWidth
              disabled={isPlaying}
            >
              Add step
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MacroStepsEditor;
