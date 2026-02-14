import { useState, useEffect } from "react";
import { SidePanelApp } from "../SidePanelApp";
import { DisplayFavicon } from "@/components/DisplayFavicon";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Text,
  ModalFooter,
  Card,
} from "@/design-system";
import { SaveRecordingState } from "../viewmodels/SaveRecordingViewModel";
import { EditIcon, SaveIcon } from "lucide-react";
import { MacroMetadataRow } from "@/components/MetaDataRow";

export const SaveRecordingModal = ({ app }: { app: SidePanelApp }) => {
  const [state, setState] = useState<SaveRecordingState>({
    isOpen: false,
    macro: null,
    macroName: "",
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

  const handleSaveAndEdit = (): void => {
    void app.saveRecordingViewModel.saveAndEdit(state.macroName);
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
    >
      <ModalHeader>
        <div className="flex gap-2">
          <DisplayFavicon
            faviconUrl={state.macro?.faviconUrl ?? ""}
            name={state.macro?.name ?? ""}
            size="large"
          />

          <div className="space-y-0.5">
            <Text variant="h2">Save Recording</Text>
            {state.macro?.domain && (
              <Text variant="small" color="muted">
                {state.macro.domain}
              </Text>
            )}
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="space-y-2">
        {state.macro && (
          <Card variant="secondary">
            <MacroMetadataRow
              label="Steps recorded"
              value={state.macro?.steps.length ?? 0}
            />

            <MacroMetadataRow
              label="Duration"
              value={formatDuration(
                state.macro.steps[state.macro.steps.length - 1].timestamp -
                  state.macro.steps[0].timestamp
              )}
            />
          </Card>
        )}
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

      <ModalFooter>
        <Button
          onClick={handleSave}
          variant="primary"
          fullWidth
          disabled={!state.macroName.trim()}
          icon={SaveIcon}
        >
          Save
        </Button>

        <Button
          onClick={handleSaveAndEdit}
          variant="secondary"
          fullWidth
          disabled={!state.macroName.trim()}
          icon={EditIcon}
        >
          Edit
        </Button>
      </ModalFooter>
    </Modal>
  );
};
