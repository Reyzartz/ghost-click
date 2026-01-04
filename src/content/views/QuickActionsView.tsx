import { useEffect, useState, useRef } from "react";
import { QuickActionsState } from "../viewmodels/QuickActionsViewModel";
import { ContentApp } from "../ContentApp";

export default function QuickActionsView({ app }: { app: ContentApp }) {
  const [state, setState] = useState<QuickActionsState>({
    isOpen: false,
    macros: [],
    filteredMacros: [],
    selectedIndex: 0,
    loading: false,
    searchQuery: "",
  });
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = app.quickActionsViewModel.subscribe(setState);
    return () => unsubscribe();
  }, [app]);

  // Auto-focus search input when opened
  useEffect(() => {
    if (state.isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [state.isOpen]);

  useEffect(() => {
    if (!state.isOpen) return;

    const handleKeyDown = (e: KeyboardEvent): void => {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          app.quickActionsViewModel.moveSelectionUp();
          break;
        case "ArrowDown":
          e.preventDefault();
          app.quickActionsViewModel.moveSelectionDown();
          break;
        case "Enter":
          e.preventDefault();
          app.quickActionsViewModel.selectCurrentMacro();
          break;
        case "Escape":
          e.preventDefault();
          app.quickActionsViewModel.close();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.isOpen, app]);

  if (!state.isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm h-screen w-screen"
      style={{
        zIndex: 99999,
      }}
      onClick={() => app.quickActionsViewModel.close()}
    >
      <div
        className="bg-white rounded-lg shadow-2xl overflow-hidden"
        style={{
          width: 600,
          maxHeight: 800,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}

        {/* Search Bar */}
        <div className="px-6 py-2 border-solid border-b border-slate-600">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search macros..."
            value={state.searchQuery}
            onChange={(e) =>
              app.quickActionsViewModel.setSearchQuery(e.target.value)
            }
            className="w-full px-4 py-2 text-sm border border-solid border-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent placeholder:text-slate-400 text-slate-900"
          />
        </div>

        <p className="text-xs text-slate-500 mt-1 px-6 py-2">
          Use ↑↓ to navigate, Enter to select, Esc to close
        </p>

        {/* Macro List */}
        <div className="overflow-y-auto" style={{ maxHeight: 400 }}>
          {state.loading && (
            <div className="px-6 py-8 text-center text-slate-500">
              Loading macros...
            </div>
          )}

          {!state.loading && state.filteredMacros.length === 0 && (
            <div className="px-6 py-8 text-center text-slate-500">
              {state.searchQuery
                ? `No macros found for "${state.searchQuery}"`
                : "No macros available. Record one first!"}
            </div>
          )}

          {!state.loading && state.filteredMacros.length > 0 && (
            <ul className="divide-y divide-slate-100">
              {state.filteredMacros.map((macro, index) => {
                const isSelected = index === state.selectedIndex;
                return (
                  <li
                    key={macro.id}
                    className={`px-6 py-4 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-slate-900 text-white"
                        : "bg-white hover:bg-slate-50 text-slate-900"
                    }`}
                    onClick={() => {
                      app.quickActionsViewModel.selectCurrentMacro();
                    }}
                    ref={(el) => {
                      if (isSelected && el) {
                        el.scrollIntoView({
                          block: "nearest",
                          behavior: "smooth",
                        });
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium truncate ${
                            isSelected ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {macro.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-xs ${
                              isSelected ? "text-slate-300" : "text-slate-500"
                            }`}
                          >
                            {macro.steps.length} step
                            {macro.steps.length === 1 ? "" : "s"}
                          </span>
                          {macro.domain && (
                            <>
                              <span
                                className={`text-xs ${
                                  isSelected
                                    ? "text-slate-400"
                                    : "text-slate-300"
                                }`}
                              >
                                •
                              </span>
                              <span
                                className={`text-xs ${
                                  isSelected
                                    ? "text-slate-300"
                                    : "text-slate-500"
                                }`}
                              >
                                {macro.domain}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="ml-4">
                          <span className="text-white text-lg">▶</span>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
