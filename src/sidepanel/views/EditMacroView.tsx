import { useEffect, useState } from "react";
import { SidePanelApp } from "../SidePanelApp";
import { ErrorAlert } from "@/components/ErrorAlert";
import { EditStepItem } from "@/components/EditStepItem";
import { AddStepButton } from "@/components/AddStepButton";
import { ClickStep, InputStep, KeyPressStep, Macro, MacroStep } from "@/models";
import { DisplayFavicon } from "@/components/DisplayFavicon";

type EditMacroState = {
  loading: boolean;
  macro: Macro | null;
  error?: string | null;
  success?: boolean;
  deletedStepIds: Set<string>;
};

export const EditMacroView = ({ app }: { app: SidePanelApp }) => {
  const [state, setState] = useState<EditMacroState>({
    loading: false,
    macro: null,
    error: null,
    success: false,
    deletedStepIds: new Set(),
  });

  useEffect(() => {
    const unsubscribe = app.editMacroViewModel.subscribe((vmState) => {
      setState({
        loading: vmState.loading,
        macro: vmState.macro,
        error: vmState.error,
        success: vmState.success,
        deletedStepIds: vmState.deletedStepIds,
      });
    });

    return () => unsubscribe();
  }, [app]);

  const handleCancel = (): void => {
    app.viewService.navigateToView("macroList");
    app.editMacroViewModel.reset();
  };

  const handleSave = async (): Promise<void> => {
    if (state.macro === null) return;
    await app.editMacroViewModel.updateMacro(state.macro);
    app.viewService.navigateToView("macroList");
  };

  const handleBack = (): void => {
    app.viewService.navigateToView("macroList");
    app.editMacroViewModel.reset();
  };

  const handleUpdateStep = (stepId: string, step: Partial<MacroStep>): void => {
    void app.editMacroViewModel.updateStep(stepId, step);
  };

  const handleAddStep = (
    newStep: ClickStep | InputStep | KeyPressStep,
    position: number
  ): void => {
    app.editMacroViewModel.addStep(newStep, position);
  };

  const handleDeleteStep = (stepId: string): void => {
    app.editMacroViewModel.deleteStep(stepId);
  };

  const handleUndoDelete = (stepId: string): void => {
    app.editMacroViewModel.undoDeleteStep(stepId);
  };

  return (
    <div className="p-4 space-y-4 text-sm text-slate-900">
      <header className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="cursor-pointer text-slate-500 hover:text-slate-700"
        >
          ← Back
        </button>
      </header>

      <div>
        <h2 className="text-lg font-semibold mb-1">Edit Macro</h2>

        <div className="flex items-center gap-1 ">
          <DisplayFavicon
            faviconUrl={state.macro?.faviconUrl || null}
            name={state.macro?.domain || ""}
            size="small"
          />
          {state.macro?.domain && (
            <p className="text-xs text-slate-500"> • {state.macro.domain}</p>
          )}
        </div>
      </div>

      {state.error && <ErrorAlert message={state.error} />}

      {state.success && (
        <div className="rounded bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-800">
          Macro updated successfully!
        </div>
      )}

      {state.loading && !state.macro ? (
        <div className="text-center py-8 text-slate-500">Loading...</div>
      ) : state.macro ? (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="macro-name"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Macro Name
            </label>
            <input
              id="macro-name"
              type="text"
              value={state.macro.name}
              onChange={(e) =>
                app.editMacroViewModel.updateMacroName(e.target.value)
              }
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              placeholder="Enter macro name"
              disabled={state.loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Steps ({state.macro.steps.length})
            </label>
            <div
              className="rounded border border-slate-200 bg-slate-50 overflow-y-auto"
              style={{ height: "calc(100vh - 300px)" }}
            >
              {state.macro.steps.length === 0 ? (
                <div className="px-3 py-4 text-center text-slate-500 text-xs">
                  No steps recorded
                </div>
              ) : (
                <div className="py-2">
                  {state.macro.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="items-center flex flex-col group"
                    >
                      <EditStepItem
                        step={step}
                        index={index}
                        handleUpdateStep={handleUpdateStep}
                        handleDeleteStep={handleDeleteStep}
                        isDeleted={state.deletedStepIds.has(step.id)}
                        handleUndoDelete={handleUndoDelete}
                      />
                      <div className="text-slate-300 text-sm">|</div>
                      <AddStepButton
                        onAddStep={(step) => handleAddStep(step, index + 1)}
                      />
                      <div className="text-slate-300 group-last:hidden">↓</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={state.loading || !state.macro?.name.trim()}
              className="flex-1 rounded bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {state.loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              disabled={state.loading}
              className="flex-1 rounded border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500">No macro selected</div>
      )}
    </div>
  );
};
