import { useEffect, useState } from "react";
import { SidePanelApp } from "../SidePanelApp";
import { Alert, Button, Text } from "@/design-system";
import { ArrowDown, Square, Circle } from "lucide-react";
import { EditStepItem } from "@/components/EditStepItem";
import { MacroStep } from "@/models";
import { RecordingProgressState } from "../viewmodels/RecordingProgressViewModel";
import { Layout } from "@/components/Layout";

export const RecordingProgressView = ({ app }: { app: SidePanelApp }) => {
  const [state, setState] = useState<RecordingProgressState>({
    loading: true,
    isRecording: false,
    sessionId: null,
    steps: [],
    error: null,
  });

  useEffect(() => {
    const unsubscribe = app.recordingProgressViewModel.subscribe(setState);
    return () => unsubscribe();
  }, [app]);

  const handleStopRecording = (): void => {
    app.emitter.emit("STOP_RECORDING", undefined, {
      currentTab: false,
    });
  };

  const handleBack = (): void => {
    app.viewService.navigateToView("macroList");
  };

  const handleUpdateStep = (stepId: string, step: Partial<MacroStep>): void => {
    app.recordingProgressViewModel.updateStep(stepId, step);
  };

  const handleDeleteStep = (stepId: string): void => {
    app.recordingProgressViewModel.deleteStep(stepId);
  };

  return (
    <Layout
      header={
        <Layout.Header title="Recording in Progress" onBack={handleBack} />
      }
    >
      {state.error && <Alert variant="error">{state.error}</Alert>}

      {state.isRecording && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Circle
              size={16}
              className="animate-pulse fill-red-500 text-red-500"
            />
            <Text variant="body" className="font-medium text-red-700">
              Recording...
            </Text>
          </div>

          <Button
            onClick={handleStopRecording}
            variant="danger"
            size="sm"
            icon={Square}
          >
            Stop Recording
          </Button>
        </div>
      )}

      <div className="flex grow flex-col overflow-hidden">
        <Text variant="body" className="mb-2 font-medium">
          Recorded Steps ({state.steps.length})
        </Text>
        <div className="grow overflow-scroll rounded-lg border border-slate-200 bg-slate-50">
          {state.steps.length === 0 ? (
            <div className="px-3 py-8 text-center text-slate-500">
              <Text>
                {state.isRecording
                  ? "Perform actions on the page to record them..."
                  : "No steps recorded"}
              </Text>
            </div>
          ) : (
            <div className="p-4">
              {state.steps.map((step, index) => {
                const isLastStep = index === state.steps.length - 1;
                return (
                  <div
                    key={step.id}
                    className="group flex w-full flex-col items-center"
                    ref={(ref) => {
                      if (isLastStep)
                        ref?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                    }}
                  >
                    <EditStepItem
                      step={step}
                      index={index}
                      handleUpdateStep={handleUpdateStep}
                      handleDeleteStep={handleDeleteStep}
                      isDeleted={false}
                      isNew={false}
                      isEditDisabled={false}
                      handleUndoDelete={() => {}}
                      isCurrent={false}
                      isCompleted={false}
                      isErrored={false}
                      isDeletable={false}
                    />

                    <ArrowDown
                      size={16}
                      className="my-3 text-slate-300 group-last:hidden"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {!state.isRecording && state.steps.length > 0 && (
        <Alert variant="info">
          Recording stopped. The save dialog should appear in the recording tab.
        </Alert>
      )}
    </Layout>
  );
};
