import { useEffect, useState } from "react";
import { SidePanelApp } from "../SidePanelApp";
import { Alert, Button, Card, Input, Text } from "@/design-system";
import { MacroStep } from "@/models";
import { DisplayFavicon } from "@/components/DisplayFavicon";
import { EditMacroHeaderControls } from "@/components/EditMacroHeaderControls";
import { MacroStepsEditor } from "@/components/MacroStepsEditor";
import { EditMacroState } from "../viewmodels/EditMacroViewModel";
import { Layout } from "@/design-system/Layout";
import clsx from "clsx";

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

  const handleCancel = async (): Promise<void> => {
    app.viewService.navigateToView("macroList");
    app.editMacroViewModel.reset();
    await handleBack();
  };

  const handleSave = async (): Promise<void> => {
    if (state.macro === null) return;
    await app.editMacroViewModel.updateMacro(state.macro);
    app.viewService.navigateToView("macroList");
  };

  const handleBack = async (): Promise<void> => {
    if (state.isPlaying) {
      await app.editMacroViewModel.stopPlayback();
    }

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

  const handleStop = async (): Promise<void> => {
    await app.editMacroViewModel.stopPlayback();
  };

  return (
    <Layout
      header={
        <Layout.Header
          title={state.isCreating ? "Create Macro" : "Edit Macro"}
          confirmAction={{
            onConfirm: handleCancel,
            title: state.isCreating ? "Discard Macro" : "Discard Changes",
            message: state.isCreating
              ? "Are you sure you want to discard this macro?"
              : "Are you sure you want to discard your changes?",
            isDestructiveAction: true,
            confirmText: "Discard",
          }}
        >
          <div
            className={clsx(
              "flex shrink-0 items-center justify-end gap-2",
              state.isPlaying ? "-translate-y-full" : "translate-y-0",
              "transition-transform duration-300 ease-in-out"
            )}
          >
            <Button
              onClick={() => void handleSave()}
              disabled={state.loading || !state.macro?.name.trim()}
              size="sm"
            >
              {state.loading
                ? "Saving..."
                : state.isCreating
                  ? "Create"
                  : "Update"}
            </Button>
          </div>
        </Layout.Header>
      }
    >
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
            disabled={state.loading || state.isPlaying}
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
        </div>
      ) : (
        <Text className="py-8 text-center">No macro selected</Text>
      )}

      {state.macro && (
        <Card
          variant="secondary"
          className="flex items-center justify-between gap-4"
          size="sm"
        >
          <div className="flex flex-1 items-center gap-2 overflow-hidden">
            <DisplayFavicon
              faviconUrl={state.macro.faviconUrl}
              name={state.macro.name}
              size="small"
            />

            <Text variant="h4" className="flex-1 truncate">
              {state.macro?.name}
            </Text>
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
        </Card>
      )}
    </Layout>
  );
};
