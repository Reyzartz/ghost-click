import { useState, useEffect } from "react";
import { ContentApp } from "../ContentApp";
import { DisplayFavicon } from "@/components/DisplayFavicon";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  InfoPanel,
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
    <Modal
      isOpen={state.isOpen}
      onClose={handleCancel}
      maxWidth="md"
      zIndex={2147483646}
    >
      <ModalHeader variant="dark">
        <div className="flex items-center gap-3">
          <DisplayFavicon
            faviconUrl={state.faviconUrl}
            name={state.domain}
            size="large"
          />

          <div>
            <Text variant="h2" className="text-white">
              Save Recording
            </Text>
            <Text variant="small" className="text-slate-300 mt-1">
              Name your macro and save it for future use
            </Text>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="space-y-4">
        <InfoPanel
          items={[
            { label: "Steps recorded", value: state.stepCount },
            { label: "Duration", value: formatDuration(state.duration) },
            {
              label: "Domain",
              value: <span className="truncate">{state.domain}</span>,
            },
          ]}
        />

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
      </ModalBody>

      <ModalFooter className="grid gap-2 grid-cols-2">
        <Button
          onClick={handleSave}
          disabled={!state.macroName.trim()}
          variant="primary"
        >
          Save
        </Button>
        <Button onClick={handleReRecord} variant="secondary">
          Re-Record
        </Button>
        <Button onClick={handleCancel} variant="danger" className="col-span-2">
          Discard
        </Button>
      </ModalFooter>
    </Modal>
  );
};
