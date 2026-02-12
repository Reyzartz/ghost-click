import { useEffect, useState } from "react";
import { SidePanelApp } from "../SidePanelApp";
import { PlaybackProgressState } from "../viewmodels/PlaybackProgressViewModel";
import { ErrorDetailsPanel } from "@/components/ErrorDetailsPanel";
import { Alert, Button, Text } from "@/design-system";
import { Play, Pause, Square, Edit, RotateCcw } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { StepListItem } from "@/components/StepListItem";
import { DisplayFavicon } from "@/components/DisplayFavicon";
import { Layout } from "@/components/Layout";

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
  const isComplete = Boolean(state.macro && !state.isPlaying && !state.error);
  const erroredStepIds = state.erroredStepIds ?? [];

  const handleReplay = (): void => {
    if (!state.macro) return;
    app.playbackProgressViewModel.clearErrors();
    app.emitter.emit("PLAY_MACRO", { macroId: state.macro.id });
  };

  const handleGoBack = (): void => {
    app.playbackProgressViewModel.clearErrors();
    if (state.isPlaying) {
      app.emitter.emit("STOP_PLAYBACK", undefined, {
        currentTab: false,
      });
    }
    app.viewService.navigateToView("macroList");
  };

  const handleStop = (): void => {
    app.emitter.emit("STOP_PLAYBACK", undefined, {
      currentTab: false,
    });
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

  const handleEditMacro = (): void => {
    if (!state.macro) return;
    app.playbackProgressViewModel.clearErrors();
    void app.editMacroViewModel.loadMacro(state.macro.id);
    app.viewService.navigateToView("editMacro");
  };

  return (
    <Layout
      header={<Layout.Header title="Playback Progress" onBack={handleGoBack} />}
    >
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
              <Button
                variant="danger"
                size="sm"
                onClick={handleStop}
                icon={Square}
                title="Stop Playback"
              />

              {state.isPaused ? (
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleResume}
                  icon={Play}
                  title="Resume Playback"
                />
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handlePause}
                  icon={Pause}
                  title="Pause Playback"
                />
              )}
            </>
          ) : (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={handleReplay}
                icon={RotateCcw}
                title="Replay Playback"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleEditMacro}
                icon={Edit}
                title="Edit Macro"
              />
            </>
          )}
        </div>
      </div>

      <ProgressBar
        current={displayStepNumber}
        total={state.totalSteps}
        percentage={progress}
      />

      {state.error && state.errorDetails.length > 0 && (
        <ErrorDetailsPanel
          errorMessage={state.error}
          errorDetails={state.errorDetails}
        />
      )}

      {state.error && state.errorDetails.length === 0 && (
        <Alert variant="error">{state.error}</Alert>
      )}

      {isComplete && (
        <Alert variant="success">
          Playback finished. Review the steps or replay.
        </Alert>
      )}

      <div className="max-h-full grow space-y-2 overflow-y-auto">
        <Text
          variant="caption"
          color="muted"
          className="bg-surface sticky top-0"
        >
          All Steps
        </Text>
        <ul className="space-y-1">
          {state.macro?.steps.map((step, index) => (
            <StepListItem
              key={step.id}
              step={step}
              index={index}
              isCurrent={index === state.currentStepIndex}
              isCompleted={index < state.currentStepIndex}
              isErrored={erroredStepIds.includes(step.id)}
            />
          ))}
        </ul>
      </div>
    </Layout>
  );
};
