import { Macro } from "@/models";
import { MacroRepository } from "@/repositories/MacroRepository";
import { BaseViewModel } from "@/utils/BaseViewModel";
import { Emitter } from "@/utils/Emitter";

export interface MacroListState {
  loading: boolean;
  macros: Macro[];
  error?: string | null;
}

export class MacroListViewModel extends BaseViewModel {
  private state: MacroListState = { loading: true, macros: [], error: null };
  private listeners: Array<(state: MacroListState) => void> = [];

  constructor(
    private readonly macroRepository: MacroRepository,
    protected readonly emitter: Emitter
  ) {
    super("MacroListViewModel", emitter);
  }

  init(): void {
    this.logger.info("MacroListViewModel initialized");

    this.loadMacros();
    this.emitter.on("SAVED_MACRO", () => {
      void this.loadMacros();
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

  private async loadMacros(): Promise<void> {
    this.logger.info("Loading macros");
    this.setState({ loading: true, error: null });
    try {
      const macros = await this.macroRepository.loadAll();
      this.logger.info("Loaded macros", { count: macros.length });
      this.setState({ macros, loading: false });
    } catch (err) {
      this.logger.error("Failed to load macros", { err });
      this.setState({ error: "Failed to load macros", loading: false });
    }
  }
}
