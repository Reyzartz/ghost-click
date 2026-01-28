import { useState, useEffect } from "react";
import { SidePanelApp } from "../SidePanelApp";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Text,
  Textarea,
  ModalFooter,
} from "@/design-system";
import { ImportMacroState } from "../viewmodels/ImportMacroViewModel";

const MacroMetadataRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center justify-between p-1.5">
    <Text variant="small" color="muted">
      {label}
    </Text>
    <Text variant="small" className="font-medium">
      {value}
    </Text>
  </div>
);

export const ImportMacroModal = ({ app }: { app: SidePanelApp }) => {
  const [state, setState] = useState<ImportMacroState>({
    isOpen: false,
    pastedText: "",
    parsedMacro: null,
    macroName: "",
    error: null,
  });

  useEffect(() => {
    const unsubscribe = app.importMacroViewModel.subscribe((vmState) => {
      setState(vmState);
    });

    return () => unsubscribe();
  }, [app]);

  if (!state.isOpen) return null;

  const handleSave = async (): Promise<void> => {
    await app.importMacroViewModel.saveMacro();
  };

  const handleCreateAndEdit = () => {
    app.importMacroViewModel.createAndEdit();
  };

  const handleDiscard = (): void => {
    app.importMacroViewModel.closeModal();
  };

  return (
    <Modal
      isOpen={state.isOpen}
      onClose={handleDiscard}
      maxWidth="md"
      className="bg-slate-100!"
    >
      <ModalHeader>
        <Text variant="h2">Import Macro</Text>
      </ModalHeader>

      <ModalBody className="flex flex-col gap-2">
        <Input
          label="Macro Name"
          type="text"
          value={state.macroName}
          onChange={(e) =>
            app.importMacroViewModel.updateMacroName(e.target.value)
          }
          placeholder="Enter macro name"
          onKeyDown={(e) => {
            if (e.key === "Enter" && state.macroName.trim()) {
              void handleSave();
            }
          }}
        />

        <Textarea
          label="Paste Macro JSON"
          value={state.pastedText}
          onChange={(e) =>
            app.importMacroViewModel.updatePastedText(e.target.value)
          }
          placeholder="Paste macro JSON here..."
          className="font-mono grow text-xs"
          containerClassName={`flex flex-col transition-all duration-200 ${state.parsedMacro ? "h-34" : "h-60"}`}
          autoFocus
          error={state.error}
        />

        <div
          className={`transition-[opacity,height] duration-200 overflow-hidden ${state.parsedMacro ? "opacity-100 h-26" : "opacity-0 h-0"}`}
        >
          {state.parsedMacro && (
            <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 divide-y divide-slate-200">
              <MacroMetadataRow
                label="Steps"
                value={state.parsedMacro.steps.length}
              />
              <MacroMetadataRow
                label="Domain"
                value={state.parsedMacro.domain}
              />
              <MacroMetadataRow
                label="Initial URL"
                value={state.parsedMacro.initialUrl}
              />
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        {state.parsedMacro ? (
          <>
            <Button
              onClick={() => void handleSave()}
              disabled={!state.macroName.trim()}
              variant="primary"
              fullWidth
            >
              Save
            </Button>
            <Button
              onClick={() => void handleCreateAndEdit()}
              disabled={!state.macroName.trim()}
              variant="secondary"
              fullWidth
            >
              Edit
            </Button>
          </>
        ) : (
          <Button onClick={handleDiscard} variant="danger" fullWidth>
            Cancel
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};
