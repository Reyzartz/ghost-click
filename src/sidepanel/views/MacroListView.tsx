import { useEffect, useState, useRef } from "react";
import { SidePanelApp } from "../SidePanelApp";
import { Alert, Button, Icon, Kbd } from "@/design-system";
import { MacroSection } from "@/components/MacroSection";
import {
  Circle,
  Square,
  Settings,
  ImportIcon,
  CircleSmall,
  Search,
} from "lucide-react";
import { MacroListState } from "../viewmodels/MacroListViewModel";
import { SearchInput } from "@/components/SearchInput";
import { MacroUtils } from "@/utils/MacroUtils";
import { TabsManager } from "@/utils/TabsManager";
import { Layout } from "@/design-system/Layout";
import { GhostLogo } from "@/components/GhostLogo";
import { EmptyState } from "@/components/EmptyState";

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
    showSearchBar: false,
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = app.macroListViewModel.subscribe(setState);
    return () => unsubscribe();
  }, [app]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
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

        if (state.searchQuery) {
          app.macroListViewModel.setSearchQuery("");
        } else {
          toggleSearchBar();
        }
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

  const toggleSearchBar = (): void => {
    app.macroListViewModel.toggleSearchBar();

    setTimeout(() => {
      if (!state.showSearchBar) {
        searchInputRef.current?.focus();
      } else {
        searchInputRef.current?.blur();
      }
    }, 350);
  };

  return (
    <Layout
      header={
        <Layout.Header
          title={<GhostLogo height={40} width={84} />}
          className="pl-4"
        >
          <>
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

            {state.allMacros.length > 0 && (
              <Button
                onClick={toggleSearchBar}
                variant={state.showSearchBar ? "secondary" : "ghost"}
                size="sm"
                icon={Search}
                title="Search macros"
              />
            )}

            <Button
              onClick={handleImport}
              variant="ghost"
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
          </>
        </Layout.Header>
      }
    >
      {state.error && <Alert variant="error">{state.error}</Alert>}

      <SearchInput
        visible={state.showSearchBar}
        value={state.searchQuery}
        onChange={(value) => app.macroListViewModel.setSearchQuery(value)}
        placeholder="Search by name or domain..."
        onKeyDown={handleKeyDown}
        ref={searchInputRef}
        resultCount={state.filteredMacros.length}
      />

      <div className="flex flex-1 flex-col gap-2 overflow-scroll">
        {state.searchQuery ? (
          <MacroSection
            title={`Search Results (${state.filteredMacros.length})`}
            macros={state.filteredMacros}
            loading={state.loading}
            emptyComponent={
              <EmptyState
                emptyIcon={<Icon icon={Search} size="sm" color="muted" />}
                title={`No macros found for "${state.searchQuery}"`}
                message={
                  <>
                    Try a different name or domain, or press{" "}
                    <Kbd size="sm">Esc</Kbd> to clear your search.
                  </>
                }
              />
            }
            onPlay={handlePlay}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCopy={handleCopy}
            onDuplicate={handleDuplicate}
            onPin={handlePin}
            selectedIndex={state.selectedIndex}
            className="flex-1"
          />
        ) : (
          <>
            {state.pinnedMacros.length > 0 && (
              <MacroSection
                title="Pinned Macros"
                macros={state.pinnedMacros}
                loading={state.loading}
                onPlay={handlePlay}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCopy={handleCopy}
                onDuplicate={handleDuplicate}
                onPin={handlePin}
              />
            )}

            <MacroSection
              title="Macros"
              macros={state.unpinnedMacros}
              loading={state.loading}
              emptyComponent={
                <EmptyState
                  title="No Macros Yet"
                  emptyIcon={
                    <Icon icon={CircleSmall} size="sm" filled color="muted" />
                  }
                  message="Click the record button above to capture your first macro on this tab."
                  buttonProps={{
                    icon: CircleSmall,
                    children: "Start Recording",
                    iconFilled: true,
                    onClick: () => {
                      void handleStartRecording();
                    },
                  }}
                />
              }
              onPlay={handlePlay}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCopy={handleCopy}
              onDuplicate={handleDuplicate}
              onPin={handlePin}
              className="flex-1"
            />
          </>
        )}
      </div>
    </Layout>
  );
};
