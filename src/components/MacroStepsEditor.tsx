import { clsx } from "clsx";
import { AddStepButton } from "@/components/AddStepButton";
import { EditStepItem } from "@/components/EditStepItem";
import { Text, Card } from "@/design-system";
import { ArrowDown } from "lucide-react";
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
  return (
    <div className="flex grow flex-col overflow-hidden">
      <Text variant="body" className="mb-2 font-medium">
        Steps ({macro.steps.length})
      </Text>

      <Card className="grow overflow-scroll" variant="selected">
        {macro.steps.length === 0 ? (
          <Text className="px-3 py-4 text-center" color="muted">
            No steps added yet.
          </Text>
        ) : (
          <div className="flex w-full flex-col items-center p-4">
            <AddStepButton onAddStep={(step) => onAddStep(step, 0)} />
            <div
              className={clsx(
                "text-text-disabled transition-[height] duration-200",
                isPlaying ? "h-0 overflow-hidden" : "h-4"
              )}
            >
              <ArrowDown size={16} />
            </div>

            {macro.steps.map((step, index) => {
              const isFirstStep = index === 0;
              const isDeletable = !isFirstStep || step.type !== "NAVIGATE";

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
                    isCurrent={currentStepId === step.id}
                    isCompleted={completedStepIds.includes(step.id)}
                    isErrored={erroredStepIds.includes(step.id)}
                    isDeletable={isDeletable}
                  />

                  <div className="text-text-disabled text-xs">|</div>
                  <AddStepButton onAddStep={(s) => onAddStep(s, index + 1)} />
                  <div className="text-text-disabled group-last:hidden">
                    <ArrowDown size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default MacroStepsEditor;
