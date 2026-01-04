import { useEffect, useMemo, useState } from "react";
import { Macro } from "@/models";
import { SidePanelApp } from "../SidePanelApp";

type MacroListState = {
  loading: boolean;
  macros: Macro[];
  allMacros: Macro[];
  currentDomain: string;
  error?: string | null;
};

export default function MacroListView({ app }: { app: SidePanelApp }) {
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
  return (
    <div className="p-4 space-y-3 text-sm text-slate-900">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Side Panel
          </p>
          {state.currentDomain && (
            <p className="text-xs text-slate-500">
              Domain: {state.currentDomain}
            </p>
          )}
          <h2 className="text-lg font-semibold">Macros</h2>
        </div>
        <span className="text-xs text-slate-500">
          {state.loading ? "Loading…" : `${state.macros.length} saved`}
        </span>
      </header>

      {state.error && (
        <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">
          {state.error}
        </div>
      )}

      {/* Current Domain Section */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
          Current Domain
        </h3>
        {!state.loading && state.macros.length === 0 && (
          <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-slate-600">
            No macros saved for this domain.
          </div>
        )}
        <ul className="space-y-2">
          {state.macros.map((macro) => (
            <li
              key={macro.id}
              className="rounded border border-slate-200 px-3 py-2 hover:border-slate-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{macro.name}</p>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-slate-600">
                      {macro.steps.length} step
                      {macro.steps.length === 1 ? "" : "s"}
                    </span>
                    {macro.domain && (
                      <span className="text-xs text-slate-400">
                        • {macro.domain}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-end gap-2 flex-col ">
                  <button
                    className="cursor-pointer rounded bg-slate-900 px-2 py-1 text-xs text-white hover:bg-slate-800"
                    onClick={() => {
                      app.emitter.emit("PLAY_MACRO", { macroId: macro.id });
                    }}
                  >
                    Play
                  </button>
                  <button
                    className="cursor-pointer rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                    onClick={() =>
                      void app.macroListViewModel.deleteMacro(macro.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* All Domains Section */}
      {!state.loading && otherDomainMacros.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
            All Domains
          </h3>
          <ul className="space-y-2">
            {otherDomainMacros.map((macro) => (
              <li
                key={macro.id}
                className="rounded border border-slate-200 px-3 py-2 hover:border-slate-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{macro.name}</p>
                    <div className="flex gap-2 items-center">
                      <span className="text-xs text-slate-600">
                        {macro.steps.length} step
                        {macro.steps.length === 1 ? "" : "s"}
                      </span>
                      {macro.domain && (
                        <span className="text-xs text-slate-400">
                          • {macro.domain}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-end gap-2 flex-col ">
                    <button
                      className="cursor-pointer rounded bg-slate-900 px-2 py-1 text-xs text-white hover:bg-slate-800"
                      onClick={() => {
                        app.emitter.emit("PLAY_MACRO", { macroId: macro.id });
                      }}
                    >
                      Play
                    </button>
                    <button
                      className="cursor-pointer rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                      onClick={() =>
                        void app.macroListViewModel.deleteMacro(macro.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
