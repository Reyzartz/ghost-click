import { useEffect, useState } from "react";
import { SidePanelApp } from "../SidePanelApp";
import { PlaybackProgressState } from "../viewmodels/PlaybackProgressViewModel";
import { ErrorDetailsPanel } from "@/components/ErrorDetailsPanel";
import { Alert, Button, Card, Text } from "@/design-system";
import { Play, Pause, Edit, RotateCcw, CopyPlus, Trash2 } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { StepListItem } from "@/components/StepListItem";
import { Layout } from "@/design-system/Layout";
import { ConfirmActionButton } from "@/components/ConfirmActionModal";

export const PlaybackProgressView = ({ app }: { app: SidePanelApp }) => {
  const [state, setState] = useState<PlaybackProgressState>({
    isPlaying: false,
    isPaused: false,
    macro: null,
    currentStepId: null,
    currentStepIndex: 0,
    totalSteps: 0,
    error: null,
    erroredStepIds: [],
    errorDetails: [],
  });

  useEffect(() => {
    const unsubscribe = app.playbackProgressViewModel.subscribe(setState);
    return () => unsubscribe();
  }, [app]);

  if (!state.macro) {
    return null;
  }

  const normalizedStepIndex = Math.min(
    state.currentStepIndex,
    state.totalSteps
  );
  const progress =
    state.totalSteps > 0
      ? Math.min(
          100,
          Math.round((normalizedStepIndex / state.totalSteps) * 100)
        )
      : 0;

  const displayStepNumber = state.totalSteps
    ? Math.min(state.currentStepIndex + 1, state.totalSteps)
    : 0;

  const erroredStepIds = state.erroredStepIds ?? [];

  const handleReplay = (): void => {
    if (!state.macro) return;
    app.playbackProgressViewModel.clearErrors();
    app.emitter.emit("PLAY_MACRO", { macroId: state.macro.id });
  };

  const handleGoBack = async (): Promise<void> => {
    if (state.isPlaying) {
      await handleStop();
    }

    app.playbackProgressViewModel.clearErrors();
    app.viewService.navigateToView("macroList");
  };

  const handleStop = (): Promise<void> => {
    return new Promise<void>((resolve) => {
      app.emitter.emit("STOP_PLAYBACK", undefined, { currentTab: false });
      setTimeout(() => {
        resolve();
      }, 300);
    });
  };

  const handlePause = (): void => {
    app.emitter.emit("PAUSE_PLAYBACK", undefined, { currentTab: false });
  };

  const handleResume = (): void => {
    app.emitter.emit("RESUME_PLAYBACK", undefined, { currentTab: false });
  };

  const handleEditMacro = async (): Promise<void> => {
    if (!state.macro) return;
    await handleStop();

    app.playbackProgressViewModel.clearErrors();
    void app.editMacroViewModel.loadMacro(state.macro.id);
    app.viewService.navigateToView("editMacro");
  };

  const handleDuplicate = async (): Promise<void> => {
    if (!state.macro) return;
    await handleStop();

    app.macroListViewModel.duplicateMacro(state.macro.id);
  };

  const handleDelete = async (): Promise<void> => {
    if (!state.macro) return;
    await handleStop();

    await app.macroListViewModel.deleteMacro(state.macro.id);
    app.viewService.navigateToView("macroList");
  };

  return (
    <Layout
      header={
        <Layout.Header title={state.macro.name} onBack={handleGoBack}>
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={handleEditMacro}
            title="Edit macro"
          />
          <Button
            variant="ghost"
            size="sm"
            icon={CopyPlus}
            onClick={handleDuplicate}
            title="Duplicate macro"
          />
          <ConfirmActionButton
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={handlePause}
            onCancel={handleResume}
            onConfirm={handleDelete}
            title="Delete macro"
            message="Are you sure you want to delete this macro? This action cannot be undone."
            confirmText="Delete"
          />
        </Layout.Header>
      }
    >
      {/* Progress + Controls */}
      <Card className="flex flex-col gap-3 rounded-lg pr-2.5 pl-2.5">
        <Button
          variant={state.isPlaying && !state.isPaused ? "secondary" : "primary"}
          onClick={
            state.isPlaying
              ? state.isPaused
                ? handleResume
                : handlePause
              : handleReplay
          }
          icon={state.isPlaying ? (state.isPaused ? Play : Pause) : RotateCcw}
          fullWidth
        >
          {state.isPlaying ? (state.isPaused ? "Play" : "Pause") : "Replay"}
        </Button>

        <ProgressBar
          current={displayStepNumber}
          total={state.totalSteps}
          percentage={progress}
        />
      </Card>

      {state.error && state.errorDetails.length > 0 && (
        <ErrorDetailsPanel
          errorMessage={state.error}
          errorDetails={state.errorDetails}
        />
      )}

      {state.error && state.errorDetails.length === 0 && (
        <Alert variant="error">{state.error}</Alert>
      )}

      {/* Steps list */}
      <div className="grow overflow-y-auto">
        <ul className="flex flex-col gap-1.5">
          <Text variant="caption" color="muted">
            Steps
          </Text>
          {state.macro.steps.map((step, index) => (
            <StepListItem
              key={step.id}
              step={step}
              index={index}
              isCurrent={index === state.currentStepIndex}
              isCompleted={index < state.currentStepIndex}
              isErrored={erroredStepIds.includes(step.id)}
              isPaused={state.isPaused}
            />
          ))}
        </ul>
      </div>
    </Layout>
  );
};
