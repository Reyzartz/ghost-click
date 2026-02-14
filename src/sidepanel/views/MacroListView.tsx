import { useEffect, useState, useRef } from "react";
import { SidePanelApp } from "../SidePanelApp";
import { Alert, Text, Button, Icon } from "@/design-system";
import { MacroSection } from "@/components/MacroSection";
import {
  Circle,
  Square,
  ArrowUp,
  ArrowDown,
  Settings,
  ImportIcon,
} from "lucide-react";
import { MacroListState } from "../viewmodels/MacroListViewModel";
import { SearchInput } from "@/components/SearchInput";
import { MacroUtils } from "@/utils/MacroUtils";
import { TabsManager } from "@/utils/TabsManager";
import { Layout } from "@/components/Layout";
import clsx from "clsx";

export const MacroListView = ({ app }: { app: SidePanelApp }) => {
  const [state, setState] = useState<MacroListState>({
    loading: true,
    pinnedMacros: [],
    unpinnedMacros: [],
    allMacros: [],
    isRecording: false,
    error: null,
    searchQuery: "",
    filteredMacros: [],
    selectedIndex: 0,
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = app.macroListViewModel.subscribe(setState);
    return () => unsubscribe();
  }, [app]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (!state.searchQuery) return;

    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        app.macroListViewModel.moveSelectionUp();
        break;
      case "ArrowDown":
        e.preventDefault();
        app.macroListViewModel.moveSelectionDown();
        break;
      case "Enter":
        e.preventDefault();
        app.macroListViewModel.selectCurrentMacro();
        break;
      case "Escape":
        e.preventDefault();
        app.macroListViewModel.setSearchQuery("");
        searchInputRef.current?.blur();
        break;
    }
  };

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

  const handleCopy = (macroId: string): void => {
    void app.macroListViewModel.copyMacro(macroId);
  };

  const handleDuplicate = (macroId: string): void => {
    app.macroListViewModel.duplicateMacro(macroId);
  };

  const handleImport = (): void => {
    app.emitter.emit("OPEN_IMPORT_MACRO_MODAL");
  };

  const handleOpenSettings = (): void => {
    app.viewService.navigateToView("settings");
  };

  const handlePin = (macroId: string, value: boolean): void => {
    if (value) {
      app.macroListViewModel.pinMacro(macroId);
    } else {
      app.macroListViewModel.unpinMacro(macroId);
    }
  };

  const handleStartRecording = async () => {
    const activeTab = await TabsManager.getActiveTab();
    if (!activeTab || !activeTab.id || !activeTab.url) {
      app.logger.error("No active tab found for recording");
      return;
    }

    const domain = MacroUtils.extractDomainFromURL(activeTab.url);

    app.emitter.emit("START_RECORDING", {
      sessionId: MacroUtils.generateSessionId(),
      domain,
      tabId: activeTab.id,
    });
  };

  const handleStopRecording = (): void => {
    app.emitter.emit("STOP_RECORDING", {}, { currentTab: false });
  };

  return (
    <Layout
      header={
        <header className="flex items-start justify-between gap-4 px-4 pt-2.5">
          <div className="grow overflow-hidden">
            <Text variant="h2">Macros</Text>

            <Text
              variant="small"
              color="muted"
              className={clsx(
                "truncate transition-[height] duration-200",
                app.macroListViewModel.showSearchResults() ? "h-4" : "h-0"
              )}
            >
              {state.filteredMacros.length} results for &quot;
              {state.searchQuery}&quot;
            </Text>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {state.isRecording ? (
              <Button
                onClick={handleStopRecording}
                variant="danger"
                size="sm"
                icon={Square}
                title="Stop recording"
              />
            ) : (
              <Button
                onClick={() => {
                  void handleStartRecording();
                }}
                variant="primary"
                size="sm"
                icon={Circle}
                title="Start recording"
              />
            )}

            <Button
              onClick={handleImport}
              variant="secondary"
              size="sm"
              icon={ImportIcon}
              title="Import macro"
            />

            <Button
              onClick={handleOpenSettings}
              variant="ghost"
              size="sm"
              icon={Settings}
              title="Settings"
            />
          </div>
        </header>
      }
    >
      {state.error && <Alert variant="error">{state.error}</Alert>}

      <div className="flex flex-col gap-1">
        <SearchInput
          value={state.searchQuery}
          onChange={(value) => app.macroListViewModel.setSearchQuery(value)}
          placeholder="Search macros..."
          onKeyDown={handleKeyDown}
          ref={searchInputRef}
        />

        <Text
          variant="small"
          color="muted"
          className={clsx(
            "flex items-center gap-2 truncate transition-[height] duration-200",
            app.macroListViewModel.showSearchResults() ? "h-4" : "h-0"
          )}
        >
          Use <Icon icon={ArrowUp} size="xs" className="inline" />
          <Icon icon={ArrowDown} size="xs" className="inline" /> to navigate,
          Enter to play, Esc to clear
        </Text>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-scroll">
        {app.macroListViewModel.showSearchResults() ? (
          <MacroSection
            title="Search Results"
            macros={state.filteredMacros}
            loading={state.loading}
            emptyMessage={`No macros found for "${state.searchQuery}"`}
            onPlay={handlePlay}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCopy={handleCopy}
            onDuplicate={handleDuplicate}
            onPin={handlePin}
            selectedIndex={state.selectedIndex}
          />
        ) : (
          <>
            {state.pinnedMacros.length > 0 && (
              <MacroSection
                title="Pinned Macros"
                macros={state.pinnedMacros}
                loading={state.loading}
                emptyMessage="No macros saved yet."
                onPlay={handlePlay}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCopy={handleCopy}
                onDuplicate={handleDuplicate}
                onPin={handlePin}
              />
            )}

            <MacroSection
              title="All Macros"
              macros={state.unpinnedMacros}
              loading={state.loading}
              emptyMessage="No macros saved yet."
              onPlay={handlePlay}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCopy={handleCopy}
              onDuplicate={handleDuplicate}
              onPin={handlePin}
            />
          </>
        )}
      </div>
    </Layout>
  );
};
