import { useState, useEffect } from "react";
import { clsx } from "clsx";
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
import { EditIcon, SaveIcon } from "lucide-react";

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
    <Modal isOpen={state.isOpen} onClose={handleDiscard} maxWidth="md">
      <ModalHeader>
        <Text variant="h2">Import Macro</Text>
      </ModalHeader>

      <ModalBody className="mx-4 mb-4 rounded-lg border border-solid border-slate-200 bg-slate-50 py-3 pr-3 pl-3">
        <Input
          label="Macro Name"
          type="text"
          value={state.macroName}
          onChange={(e) =>
            app.importMacroViewModel.updateMacroName(e.target.value)
          }
          placeholder="Enter macro name"
          className="mb-3"
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
          className="grow font-mono text-xs"
          containerClassName={clsx(
            "flex flex-col transition-all duration-200",
            state.parsedMacro ? "h-34" : "h-62"
          )}
          autoFocus
          error={state.error}
        />

        <div
          className={clsx(
            "overflow-hidden transition-[opacity,height] duration-200",
            state.parsedMacro ? "h-28 opacity-100" : "h-0 opacity-0"
          )}
        >
          {state.parsedMacro && (
            <div className="mt-2 divide-slate-200 rounded border border-slate-300 bg-white px-3 py-2">
              <MacroMetadataRow
                label="Steps"
                value={state.parsedMacro.steps.length}
              />
              <MacroMetadataRow
                label="Domain"
                value={state.parsedMacro.domain}
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
              icon={SaveIcon}
            >
              Save
            </Button>
            <Button
              onClick={() => void handleCreateAndEdit()}
              disabled={!state.macroName.trim()}
              variant="secondary"
              fullWidth
              icon={EditIcon}
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
