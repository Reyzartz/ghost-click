import { useState, useEffect } from "react";
import { ContentApp } from "../ContentApp";

type SaveRecordingState = {
  isOpen: boolean;
  macroName: string;
  sessionId: string;
  initialUrl: string;
  domain: string;
  stepCount: number;
  duration: number;
};

export const SaveRecordingModal = ({ app }: { app: ContentApp }) => {
  const [state, setState] = useState<SaveRecordingState>({
    isOpen: false,
    macroName: "",
    sessionId: "",
    initialUrl: "",
    domain: "",
    stepCount: 0,
    duration: 0,
  });

  useEffect(() => {
    const unsubscribe = app.saveRecordingViewModel.subscribe((vmState) => {
      setState(vmState);
    });

    return () => unsubscribe();
  }, [app]);

  if (!state.isOpen) return null;

  const handleSave = (): void => {
    app.saveRecordingViewModel.saveRecording(state.macroName);
  };

  const handleCancel = (): void => {
    app.saveRecordingViewModel.cancelRecording();
  };

  const handleReRecord = (): void => {
    app.saveRecordingViewModel.reRecord();
  };

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div
      style={{ zIndex: 2147483646 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center pointer-events-auto"
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Save Recording</h2>
          <p className="text-xs text-slate-300 mt-1">
            Name your macro and save it for future use
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Recording Info */}
          <div className="bg-slate-50 rounded border border-solid border-slate-200 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Steps recorded:</span>
              <span className="font-medium text-slate-900">
                {state.stepCount}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Duration:</span>
              <span className="font-medium text-slate-900">
                {formatDuration(state.duration)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Domain:</span>
              <span className="font-medium text-slate-900 truncate ml-2">
                {state.domain}
              </span>
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label
              htmlFor="macro-name"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Macro Name
            </label>
            <input
              id="macro-name"
              type="text"
              value={state.macroName}
              onChange={(e) =>
                app.saveRecordingViewModel.updateMacroName(e.target.value)
              }
              className="w-full rounded border border-solid border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none text-slate-900"
              placeholder="Enter macro name"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && state.macroName.trim()) {
                  handleSave();
                }
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-4 grid gap-2 grid-cols-2">
          <button
            onClick={handleSave}
            disabled={!state.macroName.trim()}
            className="cursor-pointer flex-1 rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            Save
          </button>
          <button
            onClick={handleReRecord}
            className="cursor-pointer flex-1 rounded border border-solid border-slate-300  px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Re-Record
          </button>
          <button
            onClick={handleCancel}
            className="cursor-pointer flex-1 col-span-2 rounded border border-solid border-red-500 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-red-50 bg-red-100 transition-colors"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};
