import { useEffect, useState, useRef } from "react";
import { QuickActionsState } from "../viewmodels/QuickActionsViewModel";
import { ContentApp } from "../ContentApp";
import { SearchInput } from "@/components/SearchInput";
import { QuickActionItem } from "@/components/QuickActionItem";
import { Text, Icon } from "@/design-system";
import { ArrowUp, ArrowDown, TimerIcon } from "lucide-react";

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (!state.isOpen) return;

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

  if (!state.isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex h-screen w-screen items-center justify-center bg-black/50 backdrop-blur-sm"
      style={{
        zIndex: 99999,
      }}
      onClick={() => app.quickActionsViewModel.close()}
    >
      <div
        className="bg-surface overflow-hidden rounded-lg p-4 shadow-2xl"
        style={{
          width: 600,
          maxHeight: 800,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <header className="mb-3 flex items-center gap-2">
            <Icon icon={TimerIcon} size="md" color="muted" />
            <Text variant="h2">Quick Actions</Text>
          </header>

          <SearchInput
            value={state.searchQuery}
            onChange={(value) =>
              app.quickActionsViewModel.setSearchQuery(value)
            }
            placeholder="Search macros..."
            onKeyDown={handleKeyDown}
            ref={searchInputRef}
          />

          <Text
            variant="small"
            color="muted"
            className="mt-2 flex items-center gap-0.5"
          >
            Use <Icon icon={ArrowUp} size="xs" className="inline" />
            <Icon icon={ArrowDown} size="xs" className="inline" /> to navigate,
            Enter to select, Esc to close
          </Text>
        </div>

        <div className="mt-3 overflow-y-auto" style={{ maxHeight: 400 }}>
          {state.loading && (
            <div className="py-8 text-center">
              <Text color="muted">Loading macros...</Text>
            </div>
          )}

          {!state.loading && state.filteredMacros.length === 0 && (
            <div className="py-8 text-center">
              <Text color="muted">
                {state.searchQuery
                  ? `No macros found for "${state.searchQuery}"`
                  : "No macros available. Record one first!"}
              </Text>
            </div>
          )}

          {!state.loading && state.filteredMacros.length > 0 && (
            <ul>
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
