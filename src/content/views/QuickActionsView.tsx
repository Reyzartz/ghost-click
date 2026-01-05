import { useEffect, useState, useRef } from "react";
import { QuickActionsState } from "../viewmodels/QuickActionsViewModel";
import { ContentApp } from "../ContentApp";
import { SearchInput } from "@/components/SearchInput";
import { QuickActionItem } from "@/components/QuickActionItem";

export const QuickActionsView = ({ app }: { app: ContentApp }) => {
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
        <SearchInput
          value={state.searchQuery}
          onChange={(value) => app.quickActionsViewModel.setSearchQuery(value)}
          placeholder="Search macros..."
          ref={searchInputRef}
        />

        <p className="text-xs text-slate-500 mt-1 px-6 py-2">
          Use ↑↓ to navigate, Enter to select, Esc to close
        </p>

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
              {state.filteredMacros.map((macro, index) => (
                <QuickActionItem
                  key={macro.id}
                  macro={macro}
                  isSelected={index === state.selectedIndex}
                  onSelect={() =>
                    app.quickActionsViewModel.selectCurrentMacro()
                  }
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
