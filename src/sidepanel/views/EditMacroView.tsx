import { useEffect, useState } from "react";
import { SidePanelApp } from "../SidePanelApp";
import { Alert, Button, Input, Text } from "@/design-system";
import { MacroStep } from "@/models";
import { DisplayFavicon } from "@/components/DisplayFavicon";
import { ConfirmActionButton } from "@/components/ConfirmActionModal";
import { EditMacroHeaderControls } from "@/components/EditMacroHeaderControls";
import { MacroStepsEditor } from "@/components/MacroStepsEditor";
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
    app.editMacroViewModel.playPreview();
  };

  const handleUpdateStep = (stepId: string, step: Partial<MacroStep>): void => {
    void app.editMacroViewModel.updateStep(stepId, step);
  };

  const handleAddStep = (newStep: MacroStep, position: number): void => {
    app.editMacroViewModel.addStep(newStep, position);
  };

  const handleDeleteStep = (stepId: string): void => {
    app.editMacroViewModel.deleteStep(stepId);
  };

  const handleUndoDelete = (stepId: string): void => {
    app.editMacroViewModel.undoDeleteStep(stepId);
  };

  const handlePause = (): void => {
    app.editMacroViewModel.pausePlayback();
  };

  const handleResume = (): void => {
    app.editMacroViewModel.resumePlayback();
  };

  const handleStop = (): void => {
    app.editMacroViewModel.stopPlayback();
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

          <EditMacroHeaderControls
            macro={state.macro}
            isPlaying={state.isPlaying}
            isPaused={state.isPaused}
            isCreating={state.isCreating}
            onPlayPreview={handlePlayPreview}
            onPause={handlePause}
            onResume={handleResume}
            onStop={handleStop}
            onDelete={() => void handleDelete()}
          />
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
        <div className="text-text-muted py-8 text-center">Loading...</div>
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

          <MacroStepsEditor
            macro={state.macro}
            deletedStepIds={state.deletedStepIds}
            newStepIds={state.newStepIds}
            isPlaying={state.isPlaying}
            currentStepId={state.currentStepId}
            completedStepIds={state.completedStepIds}
            erroredStepIds={state.erroredStepIds}
            onUpdateStep={handleUpdateStep}
            onAddStep={handleAddStep}
            onDeleteStep={handleDeleteStep}
            onUndoDelete={handleUndoDelete}
          />

          <div className="flex shrink-0 gap-2">
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
        <Text className="py-8 text-center">No macro selected</Text>
      )}
    </Layout>
  );
};
