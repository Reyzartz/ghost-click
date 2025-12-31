import { Macro } from "@/models";
import { MacroRepository } from "@/repositories/MacroRepository";
import { Emitter } from "@/utils/Emitter";

export interface MacroListState {
  loading: boolean;
  macros: Macro[];
  error?: string | null;
}

export class MacroListViewModel {
  private state: MacroListState = { loading: true, macros: [], error: null };
  private listeners: Array<(state: MacroListState) => void> = [];

  constructor(
    private readonly macroRepository: MacroRepository,
    private readonly emitter: Emitter
  ) {}

  init(): void {
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

  private async loadMacros(): Promise<void> {
    this.setState({ loading: true, error: null });
    try {
      const macros = await this.macroRepository.loadAll();
      this.setState({ macros, loading: false });
    } catch (err) {
      this.setState({ error: "Failed to load macros", loading: false });
    }
  }
}
