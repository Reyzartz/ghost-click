import { useEffect, useState } from "react";
import { SidePanelApp } from "../SidePanelApp";
import { PlaybackProgressState } from "../viewmodels/PlaybackProgressViewModel";

export default function PlaybackProgressView({ app }: { app: SidePanelApp }) {
  const [state, setState] = useState<PlaybackProgressState>({
    isPlaying: false,
    macro: null,
    currentStepId: null,
    currentStepIndex: 0,
    totalSteps: 0,
    error: null,
    erroredStepIds: [],
    errorDetails: [],
  });
  const [showErrorDetails, setShowErrorDetails] = useState(false);

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
              : "Playback In Progress"}
          </p>
          <h2 className="text-lg font-semibold">{state.macro?.name}</h2>
        </div>
      </header>

      {state.error && state.errorDetails.length > 0 && (
        <div className="rounded border border-red-300 bg-red-50 overflow-hidden">
          <div
            className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-red-100"
            onClick={() => setShowErrorDetails(!showErrorDetails)}
          >
            <div className="flex items-center gap-2">
              <span className="text-red-600 text-base">⚠</span>
              <span className="text-red-900 font-medium">{state.error}</span>
            </div>
            <span className="text-red-600 text-xs">
              {showErrorDetails ? "▼" : "▶"} Details
            </span>
          </div>
          {showErrorDetails && (
            <div className="border-t border-red-200 bg-red-50 overflow-auto max-h-48">
              <ul className="divide-y divide-red-200">
                {state.errorDetails.map((err, idx) => (
                  <li key={idx} className="px-3 py-2">
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-red-900 text-xs">
                            {err.stepName}
                          </span>
                          <span className="text-red-600 text-xs px-1.5 py-0.5 rounded bg-red-100">
                            {err.stepType}
                          </span>
                        </div>
                        <p className="text-xs text-red-800 mt-1 break-words">
                          {err.error}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {state.error && state.errorDetails.length === 0 && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-red-600 text-base">⚠</span>
            <span className="text-red-800">{state.error}</span>
          </div>
        </div>
      )}

      {isComplete && (
        <div className="rounded border border-green-200 bg-green-50 px-3 py-2 text-green-800">
          Playback finished. Review the steps or replay.
        </div>
      )}

      {state.isPlaying ? (
        <div className="flex gap-2">
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

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>
            Step {displayStepNumber} of {state.totalSteps}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Step */}
      {currentStep && (
        <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3 space-y-1">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Current Step
          </p>
          <p className="font-medium text-slate-900">{currentStep.name}</p>
          <p className="text-xs text-slate-600">Type: {currentStep.type}</p>
        </div>
      )}

      {/* Steps List */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          All Steps
        </p>
        <ul className="space-y-1 max-h-96 overflow-y-auto">
          {state.macro?.steps.map((step, index) => {
            const isCurrent = index === state.currentStepIndex;
            const isCompleted = index < state.currentStepIndex;
            const isErrored = erroredStepIds.includes(step.id);

            return (
              <li
                key={step.id}
                className={`rounded px-3 py-2 text-xs ${
                  isCurrent
                    ? "bg-green-100 border border-green-300 font-medium"
                    : isCompleted
                    ? "bg-slate-100 border border-slate-200 text-slate-500 line-through"
                    : "bg-white border border-slate-200"
                } ${isErrored ? "border-red-300 bg-red-50 text-red-700" : ""}`}
                autoFocus={isCurrent}
                ref={(el) => {
                  if (isCurrent && el) {
                    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">#{index + 1}</span>
                  <span>{step.name}</span>
                  {isCurrent && (
                    <span className="ml-auto text-green-600">▶</span>
                  )}
                  {isCompleted && !isErrored && (
                    <span className="ml-auto text-green-600">✓</span>
                  )}
                  {isErrored && <span className="ml-auto text-red-600">!</span>}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
