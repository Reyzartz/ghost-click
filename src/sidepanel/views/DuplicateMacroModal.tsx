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
} from "@/design-system";
import { DuplicateMacroState } from "../viewmodels/DuplicateMacroViewModel";
import { SaveIcon, EditIcon } from "lucide-react";

export const DuplicateMacroModal = ({ app }: { app: SidePanelApp }) => {
  const [state, setState] = useState<DuplicateMacroState>({
    isOpen: false,
    macroName: "",
    originalMacro: null,
    domain: "",
    faviconUrl: "",
    stepCount: 0,
  });

  useEffect(() => {
    const unsubscribe = app.duplicateMacroViewModel.subscribe((vmState) => {
      setState(vmState);
    });

    return () => unsubscribe();
  }, [app]);

  if (!state.isOpen) return null;

  const handleSave = (): void => {
    void app.duplicateMacroViewModel.saveDuplicate(state.macroName);
  };

  const handleSaveAndEdit = (): void => {
    app.duplicateMacroViewModel.saveAndEdit(state.macroName);
  };

  const handleCancel = (): void => {
    app.duplicateMacroViewModel.closeModal();
  };

  return (
    <Modal isOpen={state.isOpen} onClose={handleCancel} maxWidth="md">
      <ModalHeader>
        <div className="flex gap-2">
          <DisplayFavicon
            faviconUrl={state.faviconUrl}
            name={state.domain}
            size="large"
          />

          <div className="space-y-0.5">
            <Text variant="h2">Duplicate Macro</Text>
            {state.domain && (
              <Text variant="small" color="muted">
                {state.domain}
              </Text>
            )}
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Text variant="small" color="muted">
              Steps:
            </Text>
            <Text variant="small">{state.stepCount}</Text>
          </div>
        </div>

        <Input
          label="Macro Name"
          type="text"
          value={state.macroName}
          onChange={(e) =>
            app.duplicateMacroViewModel.updateMacroName(e.target.value)
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
