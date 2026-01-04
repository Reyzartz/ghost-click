import { Macro } from "@/models";
import { MacroRepository } from "@/repositories/MacroRepository";
import { BaseViewModel } from "@/utils/BaseViewModel";
import { Emitter } from "@/utils/Emitter";

export interface MacroListState {
  loading: boolean;
  macros: Macro[];
  allMacros: Macro[];
  currentDomain: string;
  error?: string | null;
}

export type MacroSortBy = "createdAt" | "updatedAt";
export type MacroSortOrder = "asc" | "desc";

export class MacroListViewModel extends BaseViewModel {
  private state: MacroListState = {
    loading: true,
    macros: [],
    allMacros: [],
    currentDomain: "",
    error: null,
  };
  private listeners: Array<(state: MacroListState) => void> = [];

  constructor(
    private readonly macroRepository: MacroRepository,
    protected readonly emitter: Emitter
  ) {
    super("MacroListViewModel", emitter);
  }

  async init(): Promise<void> {
    this.logger.info("Initializing macro list view model");
    this.loadCurrentDomain();

    this.emitter.on("SAVED_MACRO", () => {
      this.logger.info("Detected SAVED_MACRO event; reloading list");
      void this.loadMacros();
    });

    // Listen for tab changes
    chrome.tabs.onActivated.addListener(() => {
      this.logger.info("Tab activated, checking domain");
      this.loadCurrentDomain();
    });

    // Listen for tab updates (navigation)
    chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
      if (changeInfo.status === "complete" && tab.active) {
        this.logger.info("Tab updated and complete, checking domain");
        this.loadCurrentDomain();
      }
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
      this.setState({ macros, allMacros, loading: false });
    } catch (err) {
      this.logger.error("Failed to load macros", { err });
      this.setState({ error: "Failed to load macros", loading: false });
    }
  }

  private loadCurrentDomain(): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url || "";
      const domain = this.extractDomain(url);
      this.logger.info("Current domain detected", { domain });
      this.setState({ currentDomain: domain });
      void this.loadMacros();
    });
  }

  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return "";
    }
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
