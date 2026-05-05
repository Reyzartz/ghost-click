import { useEffect, useState } from "react";
import { SidePanelApp } from "../SidePanelApp";
import { Alert, Button, Text, Icon, Card } from "@/design-system";
import { Layout } from "@/design-system/Layout";
import { Square, X, CircleSmall } from "lucide-react";
import { ConfirmActionButton } from "@/components/ConfirmActionModal";
import { EditStepItem } from "@/components/EditStepItem";
import { MacroStep } from "@/models";
import { RecordingProgressState } from "../viewmodels/RecordingProgressViewModel";

const formatElapsed = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export const RecordingProgressView = ({ app }: { app: SidePanelApp }) => {
  const [state, setState] = useState<RecordingProgressState>({
    loading: true,
    isRecording: false,
    sessionId: null,
    steps: [],
    elapsed: 0,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = app.recordingProgressViewModel.subscribe(setState);
    return () => unsubscribe();
  }, [app]);

  const handleStopRecording = (): void => {
    app.emitter.emit("STOP_RECORDING", undefined, { currentTab: false });
  };

  const handleDiscard = (): void => {
    app.emitter.emit("CANCEL_RECORDING", undefined, { currentTab: false });
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
        <Layout.Header
          title={
            <div className="flex items-center gap-2">
              {state.isRecording && (
                <Icon
                  icon={CircleSmall}
                  size="sm"
                  color="error"
                  className="fill-error animate-pulse"
                />
              )}
              <Text variant="h3">Recording</Text>
            </div>
          }
        >
          {state.isRecording && (
            <Text
              variant="small"
              className="text-text-muted font-mono tabular-nums"
            >
              {formatElapsed(Number(state.elapsed))}
            </Text>
          )}
        </Layout.Header>
      }
    >
      {state.error && <Alert variant="error">{state.error}</Alert>}

      {/* Stop + Cancel row */}
      {state.isRecording && (
        <Card className="flex gap-2 rounded-lg pr-2.5 pl-2.5">
          <Button
            onClick={handleStopRecording}
            variant="danger"
            size="md"
            icon={Square}
            fullWidth
          >
            Stop
          </Button>

          <ConfirmActionButton
            onConfirm={handleDiscard}
            variant="ghost"
            size="md"
            icon={X}
            className="shrink-0"
            title="Discard Recording"
            message="Are you sure you want to discard this recording? All recorded steps will be lost."
            confirmText="Discard"
            cancelText="Keep Recording"
          />
        </Card>
      )}

      {/* Steps count label */}

      {/* Steps list */}
      <div className="flex grow flex-col gap-1.5 overflow-y-auto">
        {state.steps.length > 0 && (
          <Text variant="caption" color="muted">
            {state.steps.length} {state.steps.length === 1 ? "step" : "steps"}{" "}
            recorded
          </Text>
        )}

        {state.steps.length === 0 && !state.isRecording && (
          <div className="text-text-muted px-3 py-8 text-center">
            <Text>No steps recorded</Text>
          </div>
        )}

        {state.steps.map((step, index) => {
          const isLastStep = index === state.steps.length - 1;
          return (
            <div
              key={step.id}
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
            </div>
          );
        })}

        {/* Waiting indicator */}
        {state.isRecording && (
          <div className="flex w-full items-center justify-center gap-2 px-1 py-2">
            <span className="bg-error h-2 w-2 animate-pulse rounded-full" />
            <Text variant="small" color="muted">
              Waiting for next action on page...
            </Text>
          </div>
        )}
      </div>

      {!state.isRecording && state.steps.length > 0 && (
        <Alert variant="info">
          Recording stopped. The save dialog should appear in the recording tab.
        </Alert>
      )}
    </Layout>
  );
};
