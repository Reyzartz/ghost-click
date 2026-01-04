import { Macro } from "@/models";
import { MacroRepository } from "@/repositories/MacroRepository";
import { BaseViewModel } from "@/utils/BaseViewModel";
import { Emitter } from "@/utils/Emitter";

export interface QuickActionsState {
  isOpen: boolean;
  macros: Macro[];
  filteredMacros: Macro[];
  selectedIndex: number;
  loading: boolean;
  searchQuery: string;
}

export class QuickActionsViewModel extends BaseViewModel {
  private state: QuickActionsState = {
    isOpen: false,
    macros: [],
    filteredMacros: [],
    selectedIndex: 0,
    loading: false,
    searchQuery: "",
  };
  private listeners: Array<(state: QuickActionsState) => void> = [];

  constructor(
    private readonly macroRepository: MacroRepository,
    protected readonly emitter: Emitter
  ) {
    super("QuickActionsViewModel", emitter);
  }

  async init(): Promise<void> {
    this.logger.info("Initializing quick actions view model");

    this.emitter.on("TOGGLE_QUICK_ACTIONS", () => {
      this.logger.info("Toggle quick actions event received");
      void this.toggle();
    });

    // Reload macros when saved
    this.emitter.on("SAVED_MACRO", () => {
      if (this.state.isOpen) {
        void this.loadMacros();
      }
    });
  }

  subscribe(listener: (state: QuickActionsState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private setState(next: Partial<QuickActionsState>): void {
    this.state = { ...this.state, ...next };
    this.listeners.forEach((l) => l(this.state));
  }

  async toggle(): Promise<void> {
    if (this.state.isOpen) {
      this.close();
    } else {
      await this.open();
    }
  }

  async open(): Promise<void> {
    this.logger.info("Opening quick actions");
    this.setState({ isOpen: true, selectedIndex: 0, searchQuery: "" });
    await this.loadMacros();
  }

  close(): void {
    this.logger.info("Closing quick actions");
    this.setState({ isOpen: false, selectedIndex: 0, searchQuery: "" });
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
      return this.state.macros;
    }

    const lowerQuery = query.toLowerCase();

    const results = this.state.macros.filter(
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
      this.logger.info("Selecting macro", { macroId: macro.id });
      this.emitter.emit("PLAY_MACRO", { macroId: macro.id });
      this.close();
    }
  }

  private async loadMacros(): Promise<void> {
    this.setState({ loading: true });
    try {
      const macros = await this.macroRepository.loadAll();

      macros.sort((a, b) => b.updatedAt - a.updatedAt);

      this.logger.info("Loaded macros for quick actions", {
        count: macros.length,
      });
      this.setState({ macros, filteredMacros: macros, loading: false });
    } catch (err) {
      this.logger.error("Failed to load macros", { err });
      this.setState({ loading: false });
    }
  }
}
