import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { SidePanelApp } from "../SidePanelApp";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Textarea,
  ModalFooter,
  Card,
} from "@/design-system";
import { ImportMacroState } from "../viewmodels/ImportMacroViewModel";
import { EditIcon, ImportIcon, SaveIcon } from "lucide-react";
import { MacroMetadataRow } from "@/components/MetaDataRow";

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
      <ModalHeader title="Import Macro" icon={ImportIcon} />

      <ModalBody>
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
            state.parsedMacro ? "h-45.5" : "h-62"
          )}
          autoFocus
          error={state.error}
        />

        <div
          className={clsx(
            "overflow-hidden transition-[opacity,height] duration-200",
            state.parsedMacro ? "h-16.5 opacity-100" : "h-0 opacity-0"
          )}
        >
          {state.parsedMacro && (
            <Card className="mt-2" variant="secondary">
              <MacroMetadataRow
                label="Steps"
                value={state.parsedMacro.steps.length}
              />
              <MacroMetadataRow
                label="Domain"
                value={state.parsedMacro.domain}
              />
            </Card>
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
