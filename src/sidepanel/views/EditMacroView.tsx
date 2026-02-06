import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { SidePanelApp } from "../SidePanelApp";
import { Alert, Button, Input, Text } from "@/design-system";
import { ArrowDown, Trash2, Play, Pause, Square } from "lucide-react";
import { EditStepItem } from "@/components/EditStepItem";
import { AddStepButton } from "@/components/AddStepButton";
import {
  ClickStep,
  InputStep,
  KeyPressStep,
  NavigateStep,
  MacroStep,
} from "@/models";
import { DisplayFavicon } from "@/components/DisplayFavicon";
import { ConfirmActionButton } from "@/components/ConfirmActionModal";
import { EditMacroState } from "../viewmodels/EditMacroViewModel";
import { Layout } from "@/components/Layout";

export const EditMacroView = ({ app }: { app: SidePanelApp }) => {
  const [state, setState] = useState<EditMacroState>({
    loading: false,
    macro: null,
    error: null,
    success: false,
    deletedStepIds: new Set(),
    newStepIds: new Set(),
    isPlaying: false,
    isPaused: false,
    currentStepId: null,
    erroredStepIds: [],
    completedStepIds: [],
    isCreating: false,
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
      (step) => !state.deletedStepIds.has(step.id)
    );
    const macroToPlay = { ...state.macro, steps: filteredSteps };

    app.emitter.emit("PLAY_MACRO_PREVIEW", { macro: macroToPlay });
  };

  const handleUpdateStep = (stepId: string, step: Partial<MacroStep>): void => {
    void app.editMacroViewModel.updateStep(stepId, step);
  };

  const handleAddStep = (
    newStep: ClickStep | InputStep | KeyPressStep | NavigateStep,
    position: number
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
    <Layout
      header={
        <Layout.Header
          title={state.isCreating ? "Create Macro" : "Edit Macro"}
          onBack={handleBack}
        />
      }
    >
      {state.macro && (
        <div className="flex justify-between gap-2">
          <div className="flex items-center gap-2">
            <DisplayFavicon
              faviconUrl={state.macro.faviconUrl}
              name={state.macro.name}
            />

            <Text variant="h3">{state.macro?.name}</Text>
          </div>

          <div className="flex shrink-0 items-center gap-2">
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
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handlePause}
                    icon={Pause}
                  >
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

                {!state.isCreating && (
                  <ConfirmActionButton
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                    title="Delete Macro"
                    message="Are you sure you want to delete this macro? This action cannot be undone."
                    confirmText="Delete"
                    onClick={() => void handleDelete()}
                  >
                    Delete
                  </ConfirmActionButton>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {state.error && <Alert variant="error">{state.error}</Alert>}

      {state.macro &&
        state.macro.steps.length > 0 &&
        state.macro.steps[0].type !== "NAVIGATE" && (
          <Alert variant="warning">
            First step should be a Navigate step to ensure the macro starts on
            the correct page.
          </Alert>
        )}

      {state.success && (
        <Alert variant="success">Macro updated successfully!</Alert>
      )}

      {state.loading && !state.macro ? (
        <div className="py-8 text-center text-slate-500">Loading...</div>
      ) : state.macro ? (
        <div className="flex grow flex-col gap-3 overflow-hidden">
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

          <div className="flex grow flex-col overflow-hidden">
            <Text variant="body" className="mb-2 font-medium">
              Steps ({state.macro.steps.length})
            </Text>
            <div className="grow overflow-scroll rounded-lg border border-slate-200 bg-slate-50">
              {state.macro.steps.length === 0 ? (
                <div className="px-3 py-4 text-center text-slate-500">
                  <Text>No steps added yet.</Text>
                </div>
              ) : (
                <div className="p-4">
                  <div className="flex w-full flex-col items-center">
                    <AddStepButton
                      onAddStep={(step) => handleAddStep(step, 0)}
                      disabled={state.isPlaying}
                    />
                    <div
                      className={clsx(
                        "text-slate-300 transition-[height] duration-200",
                        state.isPlaying ? "h-0 overflow-hidden" : "h-4"
                      )}
                    >
                      <ArrowDown size={16} />
                    </div>
                  </div>

                  {state.macro.steps.map((step, index) => {
                    const isFirstStep = index === 0;
                    const isDeletable =
                      !isFirstStep || step.type !== "NAVIGATE";

                    return (
                      <div
                        key={step.id}
                        className="group flex w-full flex-col items-center"
                      >
                        <EditStepItem
                          step={step}
                          index={index}
                          handleUpdateStep={handleUpdateStep}
                          handleDeleteStep={handleDeleteStep}
                          isDeleted={state.deletedStepIds.has(step.id)}
                          isNew={state.newStepIds.has(step.id)}
                          isEditDisabled={state.isPlaying}
                          handleUndoDelete={handleUndoDelete}
                          isCurrent={state.currentStepId === step.id}
                          isCompleted={state.completedStepIds.includes(step.id)}
                          isErrored={state.erroredStepIds.includes(step.id)}
                          isDeletable={isDeletable}
                        />
                        <div className="text-xs text-slate-300">|</div>
                        <AddStepButton
                          onAddStep={(step) => handleAddStep(step, index + 1)}
                          disabled={state.isPlaying}
                        />
                        <div className="text-slate-300 group-last:hidden">
                          <ArrowDown size={16} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex shrink-0 gap-2 pt-2">
            <ConfirmActionButton
              variant="danger"
              fullWidth
              onClick={handleCancel}
              title={state.isCreating ? "Discard Macro" : "Discard Changes"}
              message={
                state.isCreating
                  ? "Are you sure you want to discard this macro?"
                  : "Are you sure you want to discard your changes?"
              }
              confirmText="Discard"
            >
              {state.isCreating ? "Discard Macro" : "Discard Changes"}
            </ConfirmActionButton>

            <Button
              onClick={() => void handleSave()}
              disabled={state.loading || !state.macro?.name.trim()}
              fullWidth
            >
              {state.loading
                ? "Saving..."
                : state.isCreating
                  ? "Create Macro"
                  : "Save Changes"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center text-slate-500">No macro selected</div>
      )}
    </Layout>
  );
};
