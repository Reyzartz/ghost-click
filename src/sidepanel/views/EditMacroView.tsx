import { useEffect, useState } from "react";
import { SidePanelApp } from "../SidePanelApp";
import { Alert, Button, Input, Text } from "@/design-system";
import {
  ArrowDown,
  ArrowLeft,
  Trash2,
  Play,
  Pause,
  Square,
} from "lucide-react";
import { EditStepItem } from "@/components/EditStepItem";
import { AddStepButton } from "@/components/AddStepButton";
import { ClickStep, InputStep, KeyPressStep, MacroStep } from "@/models";
import { DisplayFavicon } from "@/components/DisplayFavicon";
import { ConfirmActionButton } from "@/components/ConfirmActionModal";
import { EditMacroState } from "../viewmodels/EditMacroViewModel";

export const EditMacroView = ({ app }: { app: SidePanelApp }) => {
  const [state, setState] = useState<EditMacroState>({
    loading: false,
    macro: null,
    error: null,
    success: false,
    deletedStepIds: new Set(),
    isPlaying: false,
    isPaused: false,
    currentStepId: null,
    erroredStepIds: [],
    completedStepIds: [],
  });

  useEffect(() => {
    const unsubscribe = app.editMacroViewModel.subscribe(setState);
    return () => unsubscribe();
  }, [app]);

  const handleCancel = (): void => {
    app.viewService.navigateToView("macroList");
    app.editMacroViewModel.reset();
  };

  const handleSave = async (): Promise<void> => {
    if (state.macro === null) return;
    await app.editMacroViewModel.updateMacro(state.macro);
    app.viewService.navigateToView("macroList");
  };

  const handleBack = (): void => {
    app.viewService.navigateToView("macroList");
    app.editMacroViewModel.reset();
  };

  const handleDelete = async (): Promise<void> => {
    if (state.macro === null) return;
    await app.macroListViewModel.deleteMacro(state.macro.id);
    app.viewService.navigateToView("macroList");
  };

  const handlePlayPreview = (): void => {
    if (state.macro === null) return;

    // Filter out deleted steps before playing
    const filteredSteps = state.macro.steps.filter(
      (step) => !state.deletedStepIds.has(step.id),
    );
    const macroToPlay = { ...state.macro, steps: filteredSteps };

    app.emitter.emit("PLAY_MACRO_PREVIEW", { macro: macroToPlay });
  };

  const handleUpdateStep = (stepId: string, step: Partial<MacroStep>): void => {
    void app.editMacroViewModel.updateStep(stepId, step);
  };

  const handleAddStep = (
    newStep: ClickStep | InputStep | KeyPressStep,
    position: number,
  ): void => {
    app.editMacroViewModel.addStep(newStep, position);
  };

  const handleDeleteStep = (stepId: string): void => {
    app.editMacroViewModel.deleteStep(stepId);
  };

  const handleUndoDelete = (stepId: string): void => {
    app.editMacroViewModel.undoDeleteStep(stepId);
  };

  const handlePause = (): void => {
    app.emitter.emit("PAUSE_PLAYBACK", undefined, {
      currentTab: false,
    });
  };

  const handleResume = (): void => {
    app.emitter.emit("RESUME_PLAYBACK", undefined, {
      currentTab: false,
    });
  };

  const handleStop = (): void => {
    app.emitter.emit("STOP_PLAYBACK", undefined, {
      currentTab: false,
    });
  };

  return (
    <div className="p-4 space-y-4 text-sm text-slate-900">
      <Button onClick={handleBack} variant="ghost" size="sm" icon={ArrowLeft}>
        Back
      </Button>

      <div className="flex justify-between items-end">
        <div>
          <Text variant="h2" className="mb-1">
            Edit Macro
          </Text>

          <div className="flex items-center gap-1 ">
            <DisplayFavicon
              faviconUrl={state.macro?.faviconUrl || null}
              name={state.macro?.domain || ""}
              size="small"
            />

            {state.macro?.domain && (
              <Text variant="small" color="muted">
                {` • ${state.macro.domain}`}
              </Text>
            )}
          </div>
        </div>

        {state.macro && (
          <div className="flex items-center gap-2">
            {state.isPlaying ? (
              <>
                {state.isPaused ? (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={handleResume}
                    icon={Play}
                  >
                    Resume
                  </Button>
                ) : (
                  <Button size="sm" onClick={handlePause} icon={Pause}>
                    Pause
                  </Button>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleStop}
                  icon={Square}
                >
                  Stop
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handlePlayPreview}
                  variant="primary"
                  size="sm"
                  icon={Play}
                  disabled={
                    !state.macro?.name.trim() || state.macro.steps.length === 0
                  }
                >
                  Test Run
                </Button>
                <ConfirmActionButton
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  title="Delete Macro"
                  message="Are you sure you want to delete this macro? This action cannot be undone."
                  confirmText="Delete"
                  onClick={handleDelete}
                >
                  Delete
                </ConfirmActionButton>
              </>
            )}
          </div>
        )}
      </div>

      {state.error && <Alert variant="error">{state.error}</Alert>}

      {state.success && (
        <Alert variant="success">Macro updated successfully!</Alert>
      )}

      {state.loading && !state.macro ? (
        <div className="text-center py-8 text-slate-500">Loading...</div>
      ) : state.macro ? (
        <div className="space-y-4">
          <Input
            label="Macro Name"
            type="text"
            value={state.macro.name}
            onChange={(e) =>
              app.editMacroViewModel.updateMacroName(e.target.value)
            }
            placeholder="Enter macro name"
            disabled={state.loading}
          />

          <div>
            <Text variant="body" className="font-medium mb-2">
              Steps ({state.macro.steps.length})
            </Text>
            <div
              className="rounded-lg border border-slate-200 bg-slate-50 overflow-y-auto"
              style={{ height: "calc(100vh - 300px)" }}
            >
              {state.macro.steps.length === 0 ? (
                <div className="px-3 py-4 text-center text-slate-500">
                  <Text>No steps added yet.</Text>
                </div>
              ) : (
                <div className="p-4">
                  {state.macro.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="items-center flex flex-col group w-full"
                    >
                      <EditStepItem
                        step={step}
                        index={index}
                        handleUpdateStep={handleUpdateStep}
                        handleDeleteStep={handleDeleteStep}
                        isDeleted={state.deletedStepIds.has(step.id)}
                        isEditDisabled={state.isPlaying}
                        handleUndoDelete={handleUndoDelete}
                        isCurrent={state.currentStepId === step.id}
                        isCompleted={state.completedStepIds.includes(step.id)}
                        isErrored={state.erroredStepIds.includes(step.id)}
                      />
                      <div className="text-slate-300 text-xs">|</div>
                      <AddStepButton
                        onAddStep={(step) => handleAddStep(step, index + 1)}
                      />
                      <div className="text-slate-300 group-last:hidden">
                        <ArrowDown size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <ConfirmActionButton
              variant="danger"
              fullWidth
              onClick={handleCancel}
              title="Discard Changes"
              message="Are you sure you want to discard your changes?"
              confirmText="Discard"
            >
              Discard Changes
            </ConfirmActionButton>

            <Button
              onClick={handleSave}
              disabled={state.loading || !state.macro?.name.trim()}
              fullWidth
            >
              {state.loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500">No macro selected</div>
      )}
    </div>
  );
};
