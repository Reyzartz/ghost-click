import { useEffect, useState } from "react";
import { SidePanelApp } from "../SidePanelApp";
import { Alert, Button, Text, Icon } from "@/design-system";
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
            <Icon
              icon={Circle}
              size="sm"
              color="error"
              className="fill-error animate-pulse"
            />
            <Text variant="body" className="text-error-text font-medium">
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
        <div className="border-border bg-surface-muted grow overflow-scroll rounded-lg border">
          {state.steps.length === 0 ? (
            <div className="text-text-muted px-3 py-8 text-center">
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
                      className="text-text-disabled my-3 group-last:hidden"
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
