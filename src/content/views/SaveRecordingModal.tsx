import { useState, useEffect } from "react";
import { ContentApp } from "../ContentApp";
import { DisplayFavicon } from "@/components/DisplayFavicon";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Text,
} from "@/design-system";

type SaveRecordingState = {
  isOpen: boolean;
  macroName: string;
  sessionId: string;
  initialUrl: string;
  domain: string;
  faviconUrl: string;
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
    faviconUrl: "",
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

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Modal
      isOpen={state.isOpen}
      onClose={handleCancel}
      maxWidth="md"
      zIndex={2147483646}
      className="bg-slate-100!"
    >
      <ModalHeader>
        <div className="flex gap-2">
          <DisplayFavicon
            faviconUrl={state.faviconUrl}
            name={state.domain}
            size="large"
            className="bg-white"
          />

          <div className="space-y-0.5">
            <Text variant="h2">Save Recording</Text>
            {state.domain && (
              <Text variant="small" color="muted">
                {state.domain}
              </Text>
            )}
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="space-y-4 mx-4 mb-4 bg-white border border-solid border-slate-200 rounded-lg px-3 py-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Text variant="small" color="muted">
              Steps recorded:
            </Text>
            <Text variant="small">{state.stepCount}</Text>
          </div>
          <div className="flex items-center gap-2">
            <Text variant="small" color="muted">
              Duration:
            </Text>
            <Text variant="small">{formatDuration(state.duration)}</Text>
          </div>
        </div>

        <Input
          label="Macro Name"
          type="text"
          value={state.macroName}
          onChange={(e) =>
            app.saveRecordingViewModel.updateMacroName(e.target.value)
          }
          placeholder="Enter macro name"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && state.macroName.trim()) {
              handleSave();
            }
          }}
        />

        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={!state.macroName.trim()}
            variant="primary"
            fullWidth
          >
            Save
          </Button>
          <Button onClick={handleCancel} variant="danger" fullWidth>
            Discard
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};
