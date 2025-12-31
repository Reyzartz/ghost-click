import { useEffect, useState } from "react";
import { Macro } from "@/models";
import { SidePanelApp } from "./SidePanelApp";

type MacroListState = {
  loading: boolean;
  macros: Macro[];
  error?: string | null;
};

// ViewModel-driven rendering: the component subscribes to VM state
export default function App({ app }: { app: SidePanelApp }) {
  const [state, setState] = useState<MacroListState>({
    loading: true,
    macros: [],
    error: null,
  });

  useEffect(() => {
    const unsubscribe = app.macroListViewModel.subscribe(setState);
    return () => unsubscribe();
  }, [app]);

  return (
    <div className="p-4 space-y-3 text-sm text-slate-900">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Side Panel
          </p>
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

      {!state.loading && state.macros.length === 0 && (
        <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-slate-600">
          No macros saved yet.
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
                <p className="text-xs text-slate-500">{macro.id}</p>
              </div>
              <span className="text-xs text-slate-600">
                {macro.steps.length} step{macro.steps.length === 1 ? "" : "s"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
