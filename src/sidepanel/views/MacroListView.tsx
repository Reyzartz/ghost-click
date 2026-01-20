import { useEffect, useMemo, useState } from "react";
import { Macro } from "@/models";
import { SidePanelApp } from "../SidePanelApp";
import { Alert, Text, Badge } from "@/design-system";
import { MacroSection } from "@/components/MacroSection";

type MacroListState = {
  loading: boolean;
  macros: Macro[];
  allMacros: Macro[];
  currentDomain: string;
  error?: string | null;
};

export const MacroListView = ({ app }: { app: SidePanelApp }) => {
  const [state, setState] = useState<MacroListState>({
    loading: true,
    macros: [],
    allMacros: [],
    currentDomain: "",
    error: null,
  });

  useEffect(() => {
    const unsubscribe = app.macroListViewModel.subscribe(setState);
    return () => unsubscribe();
  }, [app]);

  // Filter out current domain macros from all macros
  const otherDomainMacros = useMemo(
    () =>
      state.allMacros.filter((macro) => macro.domain !== state.currentDomain),
    [state.allMacros, state.currentDomain]
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

  return (
    <div className="p-4 space-y-3 text-sm text-slate-900">
      <header className="flex items-center justify-between gap-4">
        <div className="grow overflow-hidden">
          <Text variant="h2">Macros</Text>

          {state.currentDomain && (
            <Text variant="small" color="muted" className="truncate">
              Domain: {state.currentDomain}
            </Text>
          )}
        </div>

        <Badge variant="default">
          {state.loading ? "Loading…" : `${state.macros.length} saved`}
        </Badge>
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
