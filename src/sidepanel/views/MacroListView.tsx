import { useEffect, useMemo, useState, useRef } from "react";
import { SidePanelApp } from "../SidePanelApp";
import { Alert, Text, Button } from "@/design-system";
import { MacroSection } from "@/components/MacroSection";
import {
  Circle,
  Square,
  ArrowUp,
  ArrowDown,
  Upload,
  Settings,
} from "lucide-react";
import { MacroListState } from "../viewmodels/MacroListViewModel";
import { SearchInput } from "@/components/SearchInput";
import { MacroUtils } from "@/utils/MacroUtils";
import { TabsManager } from "@/utils/TabsManager";
import { Layout } from "@/components/Layout";

export const MacroListView = ({ app }: { app: SidePanelApp }) => {
  const [state, setState] = useState<MacroListState>({
    loading: true,
    macros: [],
    allMacros: [],
    currentDomain: "",
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

  const handleStartRecording = async () => {
    const activeTab = await TabsManager.getActiveTab();
    if (!activeTab || !activeTab.id) {
      app.logger.error("No active tab found for recording");
      return;
    }

    app.emitter.emit("START_RECORDING", {
      sessionId: MacroUtils.generateSessionId(),
      initialUrl: window.location.href,
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

            {state.currentDomain &&
              !app.macroListViewModel.showSearchResults() && (
                <Text variant="small" color="muted" className="truncate">
                  Domain: {state.currentDomain}
                </Text>
              )}
            {app.macroListViewModel.showSearchResults() && (
              <Text variant="small" color="muted" className="truncate">
                {state.filteredMacros.length} results for &quot;
                {state.searchQuery}&quot;
              </Text>
            )}
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
              icon={Upload}
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

      <SearchInput
        value={state.searchQuery}
        onChange={(value) => app.macroListViewModel.setSearchQuery(value)}
        placeholder="Search macros..."
        onKeyDown={handleKeyDown}
        ref={searchInputRef}
      />

      {app.macroListViewModel.showSearchResults() && (
        <Text
          variant="small"
          color="muted"
          className="flex items-center gap-0.5"
        >
          Use <ArrowUp size={12} className="inline" />
          <ArrowDown size={12} className="inline" /> to navigate, Enter to play,
          Esc to clear
        </Text>
      )}

      <div className="flex-1 overflow-scroll">
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
            selectedIndex={state.selectedIndex}
          />
        ) : (
          <>
            <MacroSection
              title="Current Domain"
              macros={state.macros}
              loading={state.loading}
              emptyMessage="No macros saved for this domain."
              onPlay={handlePlay}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCopy={handleCopy}
              onDuplicate={handleDuplicate}
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
                onCopy={handleCopy}
                onDuplicate={handleDuplicate}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
};
