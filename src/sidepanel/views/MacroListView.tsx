import { useEffect, useMemo, useState } from "react";
import { SidePanelApp } from "../SidePanelApp";
import { Alert, Text, Button } from "@/design-system";
import { MacroSection } from "@/components/MacroSection";
import { Circle, Square } from "lucide-react";
import { MacroListState } from "../viewmodels/MacroListViewModel";

export const MacroListView = ({ app }: { app: SidePanelApp }) => {
  const [state, setState] = useState<MacroListState>({
    loading: true,
    macros: [],
    allMacros: [],
    currentDomain: "",
    isRecording: false,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = app.macroListViewModel.subscribe(setState);
    return () => unsubscribe();
  }, [app]);

  const otherDomainMacros = useMemo(
    () =>
      state.allMacros.filter((macro) => macro.domain !== state.currentDomain),
    [state.allMacros, state.currentDomain],
  );

  const handlePlay = (macroId: string): void => {
    app.emitter.emit("PLAY_MACRO", { macroId });
  };

  const handleEdit = (macroId: string): void => {
    void app.editMacroViewModel.loadMacro(macroId);
    app.viewService.navigateToView("editMacro");
  };

  const handleDelete = (macroId: string): void => {
    void app.macroListViewModel.deleteMacro(macroId);
  };

  const handleStartRecording = (): void => {
    app.emitter.emit("START_RECORDING", {
      sessionId: crypto.randomUUID(),
      initialUrl: window.location.href,
    });
  };

  const handleStopRecording = (): void => {
    app.emitter.emit("STOP_RECORDING", {}, { currentTab: false });
  };
  
  return (
    <div className="p-4 space-y-3 text-sm text-slate-900 bg-white">
      <header className="flex items-center justify-between gap-4">
        <div className="grow overflow-hidden">
          <Text variant="h2">Macros</Text>

          {state.currentDomain && (
            <Text variant="small" color="muted" className="truncate">
              Domain: {state.currentDomain}
            </Text>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {state.isRecording ? (
            <Button
              onClick={handleStopRecording}
              variant="danger"
              size="sm"
              icon={Square}
            >
              Stop
            </Button>
          ) : (
            <Button
              onClick={handleStartRecording}
              variant="primary"
              size="sm"
              icon={Circle}
            >
              Record
            </Button>
          )}
        </div>
      </header>

      {state.error && <Alert variant="error">{state.error}</Alert>}

      <MacroSection
        title="Current Domain"
        macros={state.macros}
        loading={state.loading}
        emptyMessage="No macros saved for this domain."
        onPlay={handlePlay}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {!state.loading && otherDomainMacros.length > 0 && (
        <MacroSection
          title="All Domains"
          macros={otherDomainMacros}
          loading={state.loading}
          emptyMessage="No macros from other domains."
          onPlay={handlePlay}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};
