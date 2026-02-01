import { Macro } from "@/models";
import { MacroRepository } from "@/repositories/MacroRepository";
import { RecordingStateRepository } from "@/repositories/RecordingStateRepository";
import { MacroShareService } from "@/services/MacroShareService";
import { BaseViewModel } from "@/utils/BaseViewModel";
import { Emitter } from "@/utils/Emitter";
import { MacroUtils } from "@/utils/MacroUtils";
import { TabsManager } from "@/utils/TabsManager";

export interface MacroListState {
  loading: boolean;
  macros: Macro[];
  allMacros: Macro[];
  currentDomain: string;
  isRecording: boolean;
  error?: string | null;
  searchQuery: string;
  filteredMacros: Macro[];
  selectedIndex: number;
}

export type MacroSortBy = "createdAt" | "updatedAt";
export type MacroSortOrder = "asc" | "desc";

export class MacroListViewModel extends BaseViewModel {
  private state: MacroListState = {
    loading: true,
    macros: [],
    allMacros: [],
    currentDomain: "",
    isRecording: false,
    error: null,
    searchQuery: "",
    filteredMacros: [],
    selectedIndex: 0,
  };
  private listeners: Array<(state: MacroListState) => void> = [];

  constructor(
    private readonly macroRepository: MacroRepository,
    private readonly recordingStateRepository: RecordingStateRepository,
    private readonly macroShareService: MacroShareService,
    protected readonly emitter: Emitter
  ) {
    super("MacroListViewModel", emitter);
  }

  async init(): Promise<void> {
    this.logger.info("Initializing macro list view model");
    await this.loadCurrentDomain();

    this.setState({
      isRecording: await this.recordingStateRepository.isRecording(),
    });

    this.emitter.on("SAVED_MACRO", () => {
      this.logger.info("Detected SAVED_MACRO event; reloading list");
      void this.loadMacros();
    });

    // Listen for tab changes
    chrome.tabs.onActivated.addListener(() => {
      this.logger.info("Tab activated, checking domain");
      void this.loadCurrentDomain();
    });

    // Listen for tab updates (navigation)
    chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
      if (changeInfo.status === "complete" && tab.active) {
        this.logger.info("Tab updated and complete, checking domain");
        void this.loadCurrentDomain();
      }
    });

    this.emitter.on("START_RECORDING", () => {
      this.logger.info("Recording started");
      this.setState({ isRecording: true });
    });

    this.emitter.on("STOP_RECORDING", () => {
      this.logger.info("Recording stopped");
      this.setState({ isRecording: false });
    });
  }

  subscribe(listener: (state: MacroListState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private setState(next: Partial<MacroListState>): void {
    this.state = { ...this.state, ...next };
    this.listeners.forEach((l) => l(this.state));
  }

  async deleteMacro(id: string): Promise<void> {
    try {
      this.logger.info("Deleting macro", { id });
      await this.macroRepository.delete(id);
      this.logger.info("Deleted macro", { id });
      await this.loadMacros();
    } catch (err) {
      this.logger.error("Failed to delete macro", { id, err });
      this.setState({ error: "Failed to delete macro" });
    }
  }

  async copyMacro(id: string): Promise<void> {
    try {
      this.logger.info("Copying macro to clipboard", { id });
      const macro = this.state.allMacros.find((m) => m.id === id);
      if (!macro) {
        throw new Error("Macro not found");
      }
      await this.macroShareService.copyToClipboard(macro);
      this.logger.info("Macro copied to clipboard", { id });
    } catch (err) {
      this.logger.error("Failed to copy macro", { id, err });
      this.setState({ error: "Failed to copy macro" });
    }
  }

  duplicateMacro(id: string): void {
    this.logger.info("Opening duplicate macro modal", { id });
    const macro = this.state.allMacros.find((m) => m.id === id);
    if (!macro) {
      this.logger.error("Macro not found for duplicate", { id });
      this.setState({ error: "Macro not found" });
      return;
    }
    this.emitter.emit("OPEN_DUPLICATE_MACRO_MODAL", { macro });
  }

  setSearchQuery(query: string): void {
    this.logger.info("Setting search query", { query });
    const filteredMacros = this.filterMacros(query);

    this.setState({
      searchQuery: query,
      filteredMacros,
      selectedIndex: 0,
    });
  }

  private filterMacros(query: string): Macro[] {
    if (!query.trim()) {
      return [];
    }

    const lowerQuery = query.toLowerCase();

    const results = this.state.allMacros.filter(
      (macro) =>
        macro.name.toLowerCase().includes(lowerQuery) ||
        macro.domain?.toLowerCase().includes(lowerQuery)
    );

    return results;
  }

  moveSelectionUp(): void {
    if (this.state.filteredMacros.length === 0) return;
    const newIndex =
      this.state.selectedIndex === 0
        ? this.state.filteredMacros.length - 1
        : this.state.selectedIndex - 1;
    this.setState({ selectedIndex: newIndex });
  }

  moveSelectionDown(): void {
    if (this.state.filteredMacros.length === 0) return;
    const newIndex =
      this.state.selectedIndex === this.state.filteredMacros.length - 1
        ? 0
        : this.state.selectedIndex + 1;
    this.setState({ selectedIndex: newIndex });
  }

  selectCurrentMacro(): void {
    const macro = this.state.filteredMacros[this.state.selectedIndex];
    if (macro) {
      this.logger.info("Selecting macro via keyboard", { macroId: macro.id });
      this.emitter.emit("PLAY_MACRO", { macroId: macro.id });
    }
  }

  private async loadMacros(
    sortBy: MacroSortBy = "updatedAt",
    sortOrder: MacroSortOrder = "desc"
  ): Promise<void> {
    this.logger.info("Loading macros", { domain: this.state.currentDomain });
    this.setState({ loading: true, error: null });
    try {
      const macros = MacroListViewModel.sortMacros(
        await this.macroRepository.loadByDomain(this.state.currentDomain),
        sortBy,
        sortOrder
      );

      const allMacros = MacroListViewModel.sortMacros(
        await this.macroRepository.loadAll(),
        sortBy,
        sortOrder
      );

      this.logger.info("Loaded macros", {
        sortBy,
        sortOrder,
        currentDomainCount: macros.length,
        allCount: allMacros.length,
      });

      const filteredMacros = this.state.searchQuery
        ? this.filterMacros(this.state.searchQuery)
        : [];

      this.setState({ macros, allMacros, loading: false, filteredMacros });
    } catch (err) {
      this.logger.error("Failed to load macros", { err });
      this.setState({ error: "Failed to load macros", loading: false });
    }
  }

  private async loadCurrentDomain(): Promise<void> {
    const activeTab = await TabsManager.getActiveTab();
    if (!activeTab || !activeTab.url) {
      this.logger.info("No active tab found; cannot determine domain");
      this.setState({ currentDomain: "" });
      void this.loadMacros();
      return;
    }

    const domain = MacroUtils.extractDomainFromURL(activeTab.url);
    this.logger.info("Current domain detected", { domain });
    this.setState({ currentDomain: domain });
    void this.loadMacros();
  }

  private static sortMacros(
    macros: Macro[],
    sortBy: MacroSortBy,
    sortOrder: MacroSortOrder
  ): Macro[] {
    let res = macros;
    switch (sortBy) {
      case "createdAt":
      case "updatedAt":
        res.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }

    if (sortOrder === "asc") {
      res = res.reverse();
    }

    return res;
  }
}
