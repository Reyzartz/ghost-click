import { useEffect, useState } from "react";
import { SidePanelApp } from "../SidePanelApp";
import { PlaybackProgressState } from "../viewmodels/PlaybackProgressViewModel";
import { ErrorDetailsPanel } from "@/components/ErrorDetailsPanel";
import { ErrorAlert } from "@/components/ErrorAlert";
import { ProgressBar } from "@/components/ProgressBar";
import { StepListItem } from "@/components/StepListItem";

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

  const currentStep = app.playbackProgressViewModel.getCurrentStep();
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
  const hasError = Boolean(state.error);
  const erroredStepIds = state.erroredStepIds ?? [];

  const handleReplay = (): void => {
    if (!state.macro) return;
    app.playbackProgressViewModel.clearErrors();
    app.emitter.emit("PLAY_MACRO", { macroId: state.macro.id });
  };

  const handleGoBack = (): void => {
    app.playbackProgressViewModel.clearErrors();
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

  return (
    <div className="p-4 space-y-4 text-sm text-slate-900">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {hasError && state.isPlaying
              ? "Playback In Progress (Errors)"
              : hasError
              ? "Playback Error"
              : isComplete
              ? "Playback Completed"
              : state.isPaused
              ? "Playback Paused"
              : "Playback In Progress"}
          </p>
          <h2 className="text-lg font-semibold">{state.macro?.name}</h2>
        </div>
      </header>

      {state.error && state.errorDetails.length > 0 && (
        <ErrorDetailsPanel
          errorMessage={state.error}
          errorDetails={state.errorDetails}
        />
      )}

      {state.error && state.errorDetails.length === 0 && (
        <ErrorAlert message={state.error} simple />
      )}

      {isComplete && (
        <div className="rounded border border-green-200 bg-green-50 px-3 py-2 text-green-800">
          Playback finished. Review the steps or replay.
        </div>
      )}

      {state.isPlaying ? (
        <div className="flex gap-2">
          {state.isPaused ? (
            <button
              className="cursor-pointer rounded bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700"
              onClick={handleResume}
            >
              ▶ Resume Playback
            </button>
          ) : (
            <button
              className="cursor-pointer rounded bg-yellow-600 px-3 py-2 text-xs font-medium text-white hover:bg-yellow-700"
              onClick={handlePause}
            >
              ⏸ Pause Playback
            </button>
          )}

          <button
            className="cursor-pointer rounded bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700"
            onClick={handleStop}
          >
            ⏹ Stop Playback
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            className="cursor-pointer rounded bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
            onClick={handleReplay}
          >
            Replay
          </button>
          <button
            className="cursor-pointer rounded border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            onClick={handleGoBack}
          >
            Go Back
          </button>
        </div>
      )}

      <ProgressBar
        current={displayStepNumber}
        total={state.totalSteps}
        percentage={progress}
      />

      {currentStep && (
        <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3 space-y-1">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Current Step
          </p>
          <p className="font-medium text-slate-900">{currentStep.name}</p>
          <p className="text-xs text-slate-600">Type: {currentStep.type}</p>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          All Steps
        </p>
        <ul className="space-y-1 max-h-96 overflow-y-auto">
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
    </div>
  );
};
