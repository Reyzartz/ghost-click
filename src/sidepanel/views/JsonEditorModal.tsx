import { useState, useCallback } from "react";
import { Code2, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@/design-system";
import CodeMirror from "@uiw/react-codemirror";
import { MacroStep } from "@/models";
import { MacroUtils } from "@/utils/MacroUtils";
import { JsonEditorUtils, ErrorItem } from "@/utils/JsonEditorUtils";

interface JsonStepsEditorModalProps {
  isOpen: boolean;
  steps: MacroStep[];
  onApply: (steps: MacroStep[]) => void;
  onClose: () => void;
}

export const JsonStepsEditorModal = ({
  isOpen,
  steps,
  onApply,
  onClose,
}: JsonStepsEditorModalProps) => {
  const [jsonText, setJsonText] = useState(() =>
    JSON.stringify(steps, null, 2)
  );
  const [errors, setErrors] = useState<ErrorItem[]>([]);
  const [parsedSteps, setParsedSteps] = useState<MacroStep[] | null>(steps);

  const validate = useCallback(async (value: string): Promise<void> => {
    try {
      const parsed = JSON.parse(value) as unknown;
      await MacroUtils.stepsSchema.validate(parsed, { abortEarly: false });
      setParsedSteps(parsed as MacroStep[]);
      setErrors([]);
    } catch (err) {
      setParsedSteps(null);
      setErrors(JsonEditorUtils.toErrorItems(err));
    }
  }, []);

  const handleChange = (value: string): void => {
    setJsonText(value);
    void validate(value);
  };

  const handleApply = (): void => {
    if (!parsedSteps) return;
    onApply(parsedSteps);
    onClose();
  };

  const isValid = parsedSteps !== null && errors.length === 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <ModalHeader title="Edit Steps" icon={Code2} />

      <ModalBody className="overflow-hidden p-0">
        <CodeMirror
          value={jsonText}
          onChange={handleChange}
          extensions={JsonEditorUtils.extensions}
          theme="dark"
          height="60vh"
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
            highlightActiveLineGutter: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: false,
          }}
        />

        {/* Status bar */}
        <div className="bg-background-secondary border-border flex items-center gap-1.5 border-t px-3 py-1.5">
          {isValid ? (
            <>
              <CheckCircle2 className="text-success-icon size-3 shrink-0" />
              <span className="text-success-text font-mono text-xs">Valid</span>
            </>
          ) : (
            <>
              <AlertCircle className="text-error-icon size-3 shrink-0" />
              <span className="text-error-text font-mono text-xs">
                {errors.length} error{errors.length !== 1 ? "s" : ""}
              </span>
            </>
          )}
        </div>

        {/* Error list */}
        {errors.length > 0 && (
          <div className="bg-error-bg border-error-border max-h-32 overflow-y-auto border-t">
            {errors.map((err, idx) => (
              <div
                key={idx}
                className="border-error-border flex items-start gap-2 border-b px-3 py-2 last:border-b-0"
              >
                <AlertCircle className="text-error-icon mt-0.5 size-3.5 shrink-0" />
                <div className="min-w-0 space-y-0.5">
                  {err.path && (
                    <div className="text-error-border font-mono text-xs font-medium">
                      {err.path}
                    </div>
                  )}
                  <div className="text-error-text font-mono text-xs leading-relaxed">
                    {err.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <Button variant="text" color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleApply} disabled={!isValid}>
          Apply
        </Button>
      </ModalFooter>
    </Modal>
  );
};
