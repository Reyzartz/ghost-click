import { useEffect, useMemo, useState } from "react";
import { Macro } from "@/models";
import { SidePanelApp } from "../SidePanelApp";
import { ErrorAlert } from "@/components/ErrorAlert";
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
          <h2 className="text-lg font-semibold">Macros</h2>

          {state.currentDomain && (
            <p className="text-xs text-slate-500 truncate">
              Domain: {state.currentDomain}
            </p>
          )}
        </div>

        <span className="text-xs text-slate-500 shrink-0">
          {state.loading ? "Loading…" : `${state.macros.length} saved`}
        </span>
      </header>

      {state.error && <ErrorAlert message={state.error} />}

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
